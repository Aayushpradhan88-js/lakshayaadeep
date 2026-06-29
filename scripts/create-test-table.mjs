import { Client } from "pg";

function parseTableName(rawName) {
  const fallback = "dev_test_users";
  const name = rawName || fallback;

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(
      "Invalid table name. Use only letters, numbers, and underscore.",
    );
  }

  return name.toLowerCase();
}

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing in .env.local");
  }

  const tableName = parseTableName(process.argv[2]);
  const sslMode = process.env.DB_SSL_MODE || "relaxed";

  const client = new Client({
    connectionString,
    ssl:
      sslMode === "off"
        ? false
        : {
            rejectUnauthorized: false,
          },
  });

  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.${tableName} (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      ALTER TABLE public.${tableName} DISABLE ROW LEVEL SECURITY;
    `);

    console.log(`Table created or already exists: public.${tableName}`);
    console.log("RLS is disabled for development testing.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("DB setup failed:", error.message);
  process.exit(1);
});
