import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isOpenLocalMode, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * SERVER-SIDE ONLY. Call at the top of every admin route handler.
 * Returns an error response to send back, or null when the caller is signed in.
 */
export async function denyUnlessAdmin(): Promise<NextResponse | null> {
  if (isOpenLocalMode()) return null;

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!isSupabaseConfigured() || !anonKey) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy.",
      },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  // getUser() verifies the session with Supabase instead of trusting the cookie
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  return null;
}
