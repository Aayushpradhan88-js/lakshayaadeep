import { getSupabaseClient } from "@/lib/supabase/supabase";

export async function getAdminAuthHeaders(): Promise<HeadersInit> {
  const supabase = getSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Authentication required. Please log in again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}
