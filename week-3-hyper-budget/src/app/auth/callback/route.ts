import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Where Google (via Supabase) sends the person back after they sign in.
// We trade the one-time code for a real session, then send them on to the app.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Clear the client router cache so the destination is fetched fresh with
      // the new session.
      revalidatePath("/", "layout");
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong; send them back to log in rather than a broken page.
  return NextResponse.redirect(`${origin}/login`);
}
