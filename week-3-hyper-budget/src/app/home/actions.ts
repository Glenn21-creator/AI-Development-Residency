"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Unlink the bank. Deleting the connection cascades to its accounts and their
// transactions, so the person's synced bank data is removed. Their own settings
// (buckets, pay frequency, savings goal) and the append-only savings cushion stay.
// They can reconnect any time.
export async function disconnectBank() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("bank_connections").delete().eq("user_id", user.id);

  revalidatePath("/home");
  revalidatePath("/savings");
  revalidatePath("/alerts");
}

export type ClearState = {
  ok?: boolean;
  error?: string;
  at?: number;
};

// Clear my data (testing). Wipes the person's transactions, accounts, bank
// connection, and savings cushion so the engine can be tested from a clean slate.
// Their own settings (buckets, pay frequency, savings goal) stay. The actual
// deletes happen in the clear_my_data SQL function, which is scoped to the signed-in
// user, so a person can only ever clear their own data.
//
// It returns the real error if the delete fails (for example if the migration has
// not been run yet), instead of silently pretending it worked. On success the client
// refreshes Home, which sees no accounts and sends them to the connect page.
export async function clearMyData(
  _prev: ClearState,
  _formData: FormData,
): Promise<ClearState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in again." };

  const { error } = await supabase.rpc("clear_my_data");
  if (error) {
    // Surface the database message so a missing migration is obvious.
    return { error: `Could not clear your data: ${error.message}` };
  }

  revalidatePath("/home");
  revalidatePath("/savings");
  revalidatePath("/alerts");
  revalidatePath("/activity");
  return { ok: true, at: Date.now() };
}

export type SpendState = {
  ok?: boolean;
  error?: string;
  loggedCents?: number;
  bucket?: string;
  at?: number; // changes each success, so the UI can react to repeated logs
};

// Log a spend by hand. It records a money-out transaction dated now, so it lands in
// the current cycle and safe-to-spend updates immediately. Category is left blank,
// so the bucket mapping treats it as discretionary (fun), which is what a quick
// "I just spent this" is. Attached to the person's first account if they have one.
export async function logSpend(
  _prev: SpendState,
  formData: FormData,
): Promise<SpendState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in again." };

  const amount = Number(String(formData.get("amount") ?? "").replace(",", "."));
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Please enter an amount greater than zero." };
  }
  const note = String(formData.get("note") ?? "").trim() || null;
  const cents = Math.round(amount * 100);

  // The dialog offers a fixed set of buckets (no free text). Map the choice to a
  // bank label the engine already recognises, so the spend lands in the right
  // bucket. "fun" is left blank, which the mapping treats as discretionary.
  const bucket = String(formData.get("bucket") ?? "fun");
  const categoryForBucket: Record<string, string | null> = {
    essentials: "rent",
    bills: "bill_payment",
    fun: null,
  };
  const category = bucket in categoryForBucket ? categoryForBucket[bucket] : null;

  const { data: acct } = await supabase
    .from("accounts")
    .select("id,currency")
    .eq("user_id", user.id)
    .order("name")
    .limit(1)
    .maybeSingle();
  const { data: profile } = await supabase
    .from("profiles")
    .select("currency")
    .eq("id", user.id)
    .maybeSingle();
  const currency = acct?.currency ?? profile?.currency ?? "EUR";

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    account_id: acct?.id ?? null,
    amount_cents: -cents, // money out
    currency,
    description: note,
    category, // chosen bucket, mapped to a recognised label (blank = fun)
    occurred_at: new Date().toISOString(),
    status: "settled",
    source: "manual",
  });
  if (error) return { error: "Could not log the spend. Please try again." };

  revalidatePath("/home");
  revalidatePath("/savings");
  revalidatePath("/alerts");
  return { ok: true, loggedCents: cents, bucket, at: Date.now() };
}

// Log income by hand (money in). Useful for testing the math without the bank, and
// for cash income the bank did not sync. Records a positive transaction dated now,
// so it lands in the current cycle and safe-to-spend goes up.
export async function logIncome(
  _prev: SpendState,
  formData: FormData,
): Promise<SpendState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in again." };

  const amount = Number(String(formData.get("amount") ?? "").replace(",", "."));
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Please enter an amount greater than zero." };
  }
  const note = String(formData.get("note") ?? "").trim() || null;
  const cents = Math.round(amount * 100);

  const { data: acct } = await supabase
    .from("accounts")
    .select("id,currency")
    .eq("user_id", user.id)
    .order("name")
    .limit(1)
    .maybeSingle();
  const { data: profile } = await supabase
    .from("profiles")
    .select("currency")
    .eq("id", user.id)
    .maybeSingle();
  const currency = acct?.currency ?? profile?.currency ?? "EUR";

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    account_id: acct?.id ?? null,
    amount_cents: cents, // money in (positive)
    currency,
    description: note,
    category: "credit",
    occurred_at: new Date().toISOString(),
    status: "settled",
    source: "manual",
  });
  if (error) return { error: "Could not log the income. Please try again." };

  revalidatePath("/home");
  revalidatePath("/savings");
  revalidatePath("/alerts");
  return { ok: true, loggedCents: cents, bucket: "income", at: Date.now() };
}
