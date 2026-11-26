import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { isOpenLocalMode, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Sends signed-out visitors from admin pages to the login screen and keeps the
 * session cookie fresh. The data itself is protected in the API route handlers.
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login" || isOpenLocalMode()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  let signedIn = false;

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (isSupabaseConfigured() && anonKey) {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet, headers) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  }

  if (!signedIn) {
    const redirect = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: "/admin/:path*",
};
