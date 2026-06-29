import { NextResponse } from "next/server";

import { verifySuperAdminRequest } from "@/lib/server/admin-auth";
import { getDashboardData, withAdminDb } from "@/lib/server/admin-db";

export async function GET(request: Request) {
  const auth = await verifySuperAdminRequest(request);

  if (!auth.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: auth.message,
      },
      { status: auth.status },
    );
  }

  try {
    const data = await withAdminDb(async (client) => {
      return getDashboardData(client);
    });

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data.",
      },
      { status: 500 },
    );
  }
}
