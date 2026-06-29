import "server-only";

import { Client } from "pg";

export type AdminUserRow = {
  id: string;
  email: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
};

export type ActivityLogRow = {
  id: number;
  actor_email: string;
  action: string;
  target_email: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

function makeDbClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing in .env.local");
  }

  const sslMode = process.env.DB_SSL_MODE || "relaxed";

  return new Client({
    connectionString,
    ssl:
      sslMode === "off"
        ? false
        : {
            rejectUnauthorized: false,
          },
  });
}

export async function withAdminDb<T>(
  callback: (client: Client) => Promise<T>,
): Promise<T> {
  const client = makeDbClient();
  await client.connect();

  try {
    return await callback(client);
  } finally {
    await client.end();
  }
}

export async function ensureActivityLogTable(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      actor_email TEXT NOT NULL,
      action TEXT NOT NULL,
      target_email TEXT,
      details JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    ALTER TABLE public.admin_activity_logs DISABLE ROW LEVEL SECURITY;
  `);
}

export async function logAdminActivity(
  client: Client,
  input: {
    actorEmail: string;
    action: string;
    targetEmail?: string | null;
    details?: Record<string, unknown> | null;
  },
) {
  await ensureActivityLogTable(client);

  await client.query(
    `
      INSERT INTO public.admin_activity_logs (actor_email, action, target_email, details)
      VALUES ($1, $2, $3, $4);
    `,
    [
      input.actorEmail,
      input.action,
      input.targetEmail ?? null,
      input.details ?? null,
    ],
  );
}

export async function getDashboardData(client: Client) {
  await ensureActivityLogTable(client);

  const [usersResult, statsResult, recentSignupsResult, activityResult] =
    await Promise.all([
      client.query<AdminUserRow>(`
        SELECT
          id::text,
          email,
          created_at::text,
          last_sign_in_at::text,
          email_confirmed_at::text
        FROM auth.users
        ORDER BY created_at DESC
        LIMIT 100;
      `),
      client.query<{
        total_users: string;
        recent_signups: string;
        confirmed_users: string;
      }>(`
        SELECT
          COUNT(*)::text AS total_users,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::text AS recent_signups,
          COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL)::text AS confirmed_users
        FROM auth.users;
      `),
      client.query<Pick<AdminUserRow, "id" | "email" | "created_at">>(`
        SELECT
          id::text,
          email,
          created_at::text
        FROM auth.users
        ORDER BY created_at DESC
        LIMIT 8;
      `),
      client.query<ActivityLogRow>(`
        SELECT
          id,
          actor_email,
          action,
          target_email,
          details,
          created_at::text
        FROM public.admin_activity_logs
        ORDER BY created_at DESC
        LIMIT 15;
      `),
    ]);

  const stats = statsResult.rows[0] || {
    total_users: "0",
    recent_signups: "0",
    confirmed_users: "0",
  };

  return {
    users: usersResult.rows,
    recentSignups: recentSignupsResult.rows,
    activityLogs: activityResult.rows,
    stats: {
      totalUsers: Number(stats.total_users),
      recentSignups: Number(stats.recent_signups),
      confirmedUsers: Number(stats.confirmed_users),
    },
  };
}
