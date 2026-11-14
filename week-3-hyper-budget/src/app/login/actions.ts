"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

// One server action handles both logging in and creating an account. The form
// sends an "intent" so we know which the person chose. Supabase hashes the
// password and manages the session; we never see or store the password.
export async function authenticate(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const intent = String(formData.get("intent") ?? "login");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();

  if (intent === "signup") {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error: signupMessage(error.message) };
    }
    // If email confirmation is on, there is no session yet.
    if (!data.session) {
      return {
        message:
          "Account created. Check your email to confirm, then come back and log in.",
      };
    }
    // Clear the client router cache so the next page is fetched fresh with the new
    // session, otherwise a stale logged-out page can bounce you back to login.
    revalidatePath("/", "layout");
    // New accounts start with the first-run welcome, then set their buckets.
    redirect("/onboarding");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Deliberately vague, so a stranger cannot learn which emails have accounts.
    return { error: "That email and password don't match. Want to try again?" };
  }
  // Clear the client router cache so /home is fetched fresh with the new session.
  revalidatePath("/", "layout");
  redirect("/home");
}

function signupMessage(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "That email is already registered. Try logging in instead.";
  }
  if (m.includes("password")) {
    return "Please use a longer password (at least 6 characters).";
  }
  return "Something went wrong creating your account. Please try again.";
}
