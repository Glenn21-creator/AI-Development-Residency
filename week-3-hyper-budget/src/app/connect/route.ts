import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAuthLink } from "@/lib/truelayer/client";

// Starts the bank connection. Only a logged-in person can begin. We send a
// random "state" value and remember it in a cookie, so when TrueLayer sends the
// person back we can confirm the response is really ours (CSRF protection).
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const state = crypto.randomUUID();
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/callback`;

  const res = NextResponse.redirect(buildAuthLink(redirectUri, state));
  res.cookies.set("tl_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
