"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SavingsState = { saved?: boolean; error?: string };

// Parse a money input (major units like 500 or 12.50) into whole cents.
function toCents(value: FormDataEntryValue | null): number {
  const n = Number(String(value ?? "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

// Save the one cushion goal. We keep a single goal per person: replace it each
// time (delete then insert) so saving is idempotent and there are never
// duplicates. Progress is read from the real savings balance, not stored here.
export async function saveGoal(
  _prev: SavingsState,
  formData: FormData,
): Promise<SavingsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in again." };

  const name = String(formData.get("name") ?? "").trim() || "Emergency cushion";
  const targetCents = toCents(formData.get("target"));

  if (targetCents <= 0) {
    return { error: "Please enter a goal amount greater than zero." };
  }

  await supabase.from("savings_goals").delete().eq("user_id", user.id);
  const { error } = await supabase.from("savings_goals").insert({
    user_id: user.id,
    name,
    target_cents: targetCents,
  });
  if (error) return { error: "Could not save your goal. Please try again." };

  revalidatePath("/savings");
  revalidatePath("/home");
  return { saved: true };
}
