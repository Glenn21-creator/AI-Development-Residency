import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Runs on every request to refresh the auth session cookie, so a logged-in
// person stays logged in as they move around the app.
//
// It fails soft on purpose: if the Supabase config is missing, or a transient
// auth or network error happens, it lets the request through instead of taking
// down every page with a 500. A missing session just means the person is treated
// as logged out and the pages redirect to login as normal.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    // Refreshes the session if it has expired. Do not run other logic between
    // creating the client and this call.
    await supabase.auth.getUser();
  } catch {
    // Do not let an auth or network hiccup fail the whole request.
    return NextResponse.next({ request });
  }

  return supabaseResponse;
}
