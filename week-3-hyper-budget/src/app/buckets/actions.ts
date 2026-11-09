"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BucketsState = { saved?: boolean; error?: string };

// Parse a money input (major units like 500 or 12.50) into whole cents.
function toCents(value: FormDataEntryValue | null): number {
  const n = Number(String(value ?? "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

// Save the buckets and the pay frequency. We replace the person's buckets each
// time (delete then insert) so saving is idempotent and there are never
// duplicates. The fun floor is just another bucket (type 'fun'). Pay frequency
// lives on the profile.
export async function saveBuckets(
  _prev: BucketsState,
  formData: FormData,
): Promise<BucketsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in again." };

  const essentials = toCents(formData.get("essentials"));
  const bills = toCents(formData.get("bills"));
  const fun = toCents(formData.get("fun"));
  const savings = toCents(formData.get("savings"));
  const freq = formData.get("pay_frequency") === "weekly" ? "weekly" : "monthly";

  await supabase.from("buckets").delete().eq("user_id", user.id);
  const { error } = await supabase.from("buckets").insert([
    { user_id: user.id, type: "essentials", name: "Food & rent", target_cents: essentials },
    { user_id: user.id, type: "bills", name: "Bills", target_cents: bills },
    { user_id: user.id, type: "fun", name: "Fun money", target_cents: fun },
    { user_id: user.id, type: "savings", name: "Savings", target_cents: savings },
  ]);
  if (error) return { error: "Could not save your buckets. Please try again." };

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: user.id, pay_frequency: freq }, { onConflict: "id" });
  if (profileError) {
    return { error: "Saved your buckets, but could not save your pay frequency. Please try again." };
  }

  revalidatePath("/home");
  revalidatePath("/buckets");
  revalidatePath("/savings");
  return { saved: true };
}
