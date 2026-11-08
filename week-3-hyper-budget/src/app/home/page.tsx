import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeView, { type HomeData, type ConnectedAccount } from "./HomeView";

// Sample data for the safe-to-spend card and jars. These stay as placeholders
// until the allocation and safe-to-spend SQL is built. The connected accounts
// below them are real, read from the database. Notes avoid a hardcoded currency
// so they match whatever currency the real accounts use.
const SAMPLE: HomeData = {
  safeToSpendCents: 6800,
  onTrack: true,
  buckets: [
    {
      key: "essentials",
      name: "Food & rent",
      note: "Set aside first, kept safe",
      amountCents: 50000,
      status: "Safe",
      statusKind: "safe",
    },
    {
      key: "bills",
      name: "Bills",
      note: "3 bills, all covered",
      amountCents: 12000,
      status: "Covered",
      statusKind: "covered",
    },
    {
      key: "savings",
      name: "Savings cushion",
      note: "Building quietly toward your cushion",
      amountCents: 4000,
      progress: { current: 4000, target: 30000 },
    },
    {
      key: "fun",
      name: "Fun money",
      note: "Over halfway this week",
      amountCents: 6800,
      status: "Over halfway",
      statusKind: "heads-up",
      progress: { current: 11200, target: 18000 },
    },
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
  if (!user) {
    redirect("/login");
  }

  const { data: accountsData } = await supabase
    .from("accounts")
    .select("id,name,type,balance_cents,currency")
    .eq("user_id", user.id)
    .order("name");

  const accounts = (accountsData ?? []) as ConnectedAccount[];
  const firstName = firstNameFrom(user.user_metadata ?? {}, user.email ?? "");
  const displayCurrency = accounts[0]?.currency ?? "EUR";

  return (
    <HomeView
      data={SAMPLE}
      accounts={accounts}
      connected={accounts.length > 0}
      bankStatus={sp.bank ?? null}
      firstName={firstName}
      displayCurrency={displayCurrency}
    />
  );
}
