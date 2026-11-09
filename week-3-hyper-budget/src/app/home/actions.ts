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
