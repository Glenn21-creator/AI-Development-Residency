import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeView, { type HomeData, type ConnectedAccount } from "./HomeView";

// The empty state, shown before the person has connected a bank and set buckets.
// Everything is zero and has no "Safe"/"Covered" badge, so it never implies money
// is set aside when nothing is yet. The caption invites them to set up.
const EMPTY: HomeData = {
  safeToSpendCents: 0,
  onTrack: false,
  buckets: [
    { key: "essentials", name: "Food & rent", note: "Set aside first, kept safe", amountCents: 0 },
    { key: "bills", name: "Bills", note: "Held for upcoming bills", amountCents: 0 },
    { key: "savings", name: "Savings", note: "Tucked away toward your cushion", amountCents: 0 },
    { key: "fun", name: "Fun money", note: "What's safe to spend right now", amountCents: 0 },
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

  // Home is for connected people. Before a bank is linked, send them to the connect
  // page so they are not looking at an empty Home.
  if (accounts.length === 0) redirect("/start");

  const { data: bucketRows } = await supabase
    .from("buckets")
    .select("type,target_cents")
    .eq("user_id", user.id);
  const hasBuckets = (bucketRows ?? []).some((b) => (b.target_cents ?? 0) > 0);

  // The real current-cycle figures (after this cycle's spending), computed in SQL via
  // current_cycle_summary. We read the actual amount LEFT in each bucket, not the
  // targets, so the cards never claim money is set aside when it has been spent or
  // eaten by an overspend. Falls back to the sample if the migrations are not applied
  // or the cycle has no activity.
  const toNum = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  let safeCents: number | null = null;
  let overspentCents = 0;
  let essLeft = 0;
  let billsLeft = 0;
  let funFloorLeft = 0;
  let savLeft = 0;
  const { data: cycleRows, error: cycleErr } = await supabase.rpc("current_cycle_summary");
  if (!cycleErr && Array.isArray(cycleRows) && cycleRows.length > 0) {
    const row = cycleRows[0] as Record<string, number | string>;
    safeCents = toNum(row.safe_to_spend);
    overspentCents = toNum(row.amount_overspent);
    essLeft = toNum(row.essentials_left);
    billsLeft = toNum(row.bills_left);
    funFloorLeft = toNum(row.fun_floor_left);
    savLeft = toNum(row.savings_left);
  }

  // Fun money is the guaranteed fun floor plus the discretionary remainder. The
  // floor is not a separate bucket; it just keeps some fun in a tight cycle.
  const funTotal = (safeCents ?? 0) + funFloorLeft;

  const useReal = hasBuckets && accounts.length > 0 && safeCents !== null;

  // Honest status: there is money protected, or there is not. No false "Safe".
  const protectedStatus = (
    left: number,
    full: string,
    empty: string,
  ): { status: string; statusKind: "safe" | "heads-up" } =>
    left > 0
      ? { status: full, statusKind: "safe" }
      : { status: empty, statusKind: "heads-up" };

  const data: HomeData = useReal
    ? {
        safeToSpendCents: funTotal,
        onTrack: funTotal > 0 && overspentCents === 0,
        amountOverspentCents: overspentCents,
        buckets: [
          {
            key: "essentials",
            name: "Food & rent",
            note: "Set aside first, kept safe",
            amountCents: essLeft,
            ...protectedStatus(essLeft, "Safe", "Nothing set aside"),
          },
          {
            key: "bills",
            name: "Bills",
            note: "Held for upcoming bills",
            amountCents: billsLeft,
            ...protectedStatus(billsLeft, "Covered", "Not covered"),
          },
          {
            key: "savings",
            name: "Savings",
            note: "Tucked away toward your cushion",
            amountCents: savLeft,
          },
          {
            key: "fun",
            name: "Fun money",
            note: "What's safe to spend right now",
            amountCents: funTotal,
          },
        ],
      }
    : EMPTY;

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
      connected={accounts.length > 0}
      bankStatus={sp.bank ?? null}
      firstName={firstName}
      displayCurrency={displayCurrency}
      real={useReal}
    />
  );
}
