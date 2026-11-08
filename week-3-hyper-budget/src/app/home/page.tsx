import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeView, { type HomeData, type ConnectedAccount } from "./HomeView";

// Fallback sample data, shown until the person has set buckets and the
// safe-to-spend function exists. Notes avoid a hardcoded currency.
const SAMPLE: HomeData = {
  safeToSpendCents: 6800,
  onTrack: true,
  buckets: [
    { key: "essentials", name: "Food & rent", note: "Set aside first, kept safe", amountCents: 50000, status: "Safe", statusKind: "safe" },
    { key: "bills", name: "Bills", note: "3 bills, all covered", amountCents: 12000, status: "Covered", statusKind: "covered" },
    { key: "savings", name: "Savings cushion", note: "Building quietly toward your cushion", amountCents: 4000, progress: { current: 4000, target: 30000 } },
    { key: "fun", name: "Fun money", note: "Over halfway this week", amountCents: 6800, status: "Over halfway", statusKind: "heads-up", progress: { current: 11200, target: 18000 } },
  ],
};

function firstNameFrom(meta: Record<string, unknown>, email: string): string | null {
  const given = typeof meta.given_name === "string" ? meta.given_name : "";
  const full =
    typeof meta.full_name === "string"
      ? meta.full_name
      : typeof meta.name === "string"
        ? meta.name
        : "";
  const candidate = given || full.split(" ")[0] || email.split("@")[0] || "";
  if (!candidate) return null;
  return candidate.charAt(0).toUpperCase() + candidate.slice(1);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ bank?: string }>;
}) {
  const sp = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: accountsData } = await supabase
    .from("accounts")
    .select("id,name,type,balance_cents,currency")
    .eq("user_id", user.id)
    .order("name");
  const accounts = (accountsData ?? []) as ConnectedAccount[];

  const { data: bucketRows } = await supabase
    .from("buckets")
    .select("type,target_cents")
    .eq("user_id", user.id);
  const bucketCents = (type: string) =>
    (bucketRows ?? []).find((b) => b.type === type)?.target_cents ?? 0;
  const hasBuckets = (bucketRows ?? []).some((b) => (b.target_cents ?? 0) > 0);

  // The safe-to-spend math itself runs in SQL (get_safe_to_spend). If the
  // migration has not been applied yet, the call fails and we fall back to the
  // sample data, so the page still works.
  let safeCents: number | null = null;
  const { data: rpcData, error: rpcErr } = await supabase.rpc("get_safe_to_spend");
  if (!rpcErr) {
    const n = typeof rpcData === "number" ? rpcData : Number(rpcData);
    if (Number.isFinite(n)) safeCents = n;
  }

  const useReal = hasBuckets && accounts.length > 0 && safeCents !== null;

  const data: HomeData = useReal
    ? {
        safeToSpendCents: safeCents as number,
        onTrack: (safeCents as number) > 0,
        buckets: [
          { key: "essentials", name: "Food & rent", note: "Set aside first, kept safe", amountCents: bucketCents("essentials"), status: "Safe", statusKind: "safe" },
          { key: "bills", name: "Bills", note: "Held for upcoming bills", amountCents: bucketCents("bills"), status: "Covered", statusKind: "covered" },
          { key: "savings", name: "Savings", note: "Tucked away toward your cushion", amountCents: bucketCents("savings") },
          { key: "fun", name: "Fun money", note: "What's safe to spend right now", amountCents: safeCents as number },
        ],
      }
    : SAMPLE;

  const firstName = firstNameFrom(user.user_metadata ?? {}, user.email ?? "");
  const { data: profile } = await supabase
    .from("profiles")
    .select("currency")
    .eq("id", user.id)
    .maybeSingle();
  const displayCurrency = profile?.currency ?? "EUR";

  return (
    <HomeView
      data={data}
      accounts={accounts}
      connected={accounts.length > 0}
      bankStatus={sp.bank ?? null}
      firstName={firstName}
      displayCurrency={displayCurrency}
      real={useReal}
    />
  );
}
