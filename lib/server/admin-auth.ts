import env from "@/lib/env";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/features/auth/lib/seed-admin";

export type AdminAuthResult =
  | { ok: true; email: string; userId: string }
  | { ok: false; status: number; message: string };

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

async function verifyAdminRequest(request: Request): Promise<AdminAuthResult> {
  const token = getBearerToken(request);

  if (!token) {
    return { ok: false, status: 401, message: "Missing bearer token." };
  }

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return {
      ok: false,
      status: 500,
      message: "Supabase environment/keys is not properly/functionally configured",
    };
  }

  const supabase = createClient(url, anonKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  console.log("user", user, error)

  if (error || !user) {
    return { ok: false, status: 401, message: "Invalid or expired session." };
  }

  if (!isAdminEmail(user.email)) {
    return {
      ok: false,
      status: 403,
      message: "Admin access is required.",
    };
  }

  return {
    ok: true,
    email: user.email ?? "",
    userId: user.id,
  };
}

export { verifyAdminRequest, verifyAdminRequest as verifySuperAdminRequest }
export default verifyAdminRequest
