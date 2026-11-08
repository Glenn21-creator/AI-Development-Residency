import { createBrowserClient } from "@supabase/ssr";

// The Supabase client for code that runs in the browser (client components).
// It uses the public anon key; Row-Level Security decides what it can reach.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
