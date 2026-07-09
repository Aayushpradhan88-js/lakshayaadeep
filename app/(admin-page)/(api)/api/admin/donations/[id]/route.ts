import { NextResponse } from "next/server";

import { verifySuperAdminRequest } from "@/lib/server/admin-auth";
import { withAdminDb } from "@/lib/server/admin-db";

const ALLOWED_STATUSES = ["pending", "completed", "failed", "cancelled"] as const;

type DonationStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await verifySuperAdminRequest(request);

  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, message: auth.message },
      { status: auth.status },
    );
  }

  const { id } = await params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const status = body.status;
  if (!status || !ALLOWED_STATUSES.includes(status as DonationStatus)) {
    return NextResponse.json(
      { ok: false, message: "Invalid donation status." },
      { status: 400 },
    );
  }

  try {
    const row = await withAdminDb(async (client) => {
      const result = await client.query(
        `
          UPDATE public.donations
          SET status = $1
          WHERE id = $2
          RETURNING *;
        `,
        [status, id],
      );

      return result.rows[0] ?? null;
    });

    if (!row) {
      return NextResponse.json(
        { ok: false, message: "Donation not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, data: row });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update donation status.",
      },
      { status: 500 },
    );
  }
}
