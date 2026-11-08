import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// The Supabase client for code that runs on the server (server components,
// route handlers, server actions). It reads and writes the auth session through
// cookies, so a logged-in user stays logged in. This is where database calls
// should happen, so Row-Level Security applies as the second lock.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies cannot be set.
            // Safe to ignore when middleware refreshes the session.
          }
        },
      },
    },
  );
}
