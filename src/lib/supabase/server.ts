import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service role client: SERVER-SIDE ONLY for secure operations that bypass RLS
// Never expose this client or SUPABASE_SERVICE_ROLE_KEY to frontend/client bundles
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
