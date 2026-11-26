export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.length > 0 && !url.includes("placeholder-project") && !url.includes("your-project");
}

/**
 * Without Supabase there is nothing to sign in to. The admin area stays open for
 * local development, and closed on a deployed site.
 */
export function isOpenLocalMode(): boolean {
  return !isSupabaseConfigured() && process.env.NODE_ENV !== "production";
}
