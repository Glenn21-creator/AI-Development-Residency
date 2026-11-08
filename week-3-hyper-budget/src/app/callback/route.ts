import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  exchangeCodeForToken,
  getAccounts,
  getBalance,
  getTransactions,
} from "@/lib/truelayer/client";

type TLAccount = {
  account_id: string;
  display_name?: string;
  account_type?: string;
  currency?: string;
};
type TLBalance = { current?: number; currency?: string };
type TLTxn = {
  transaction_id: string;
  amount: number;
  currency?: string;
  description?: string;
  transaction_category?: string;
  timestamp: string;
};

// Keep the first sync light: the most recent transactions per account.
const TXN_CAP = 100;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const home = new URL("/home", url.origin);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("tl_state")?.value;
  if (oauthError || !code || !state || state !== savedState) {
    home.searchParams.set("bank", "error");
    return NextResponse.redirect(home);
  }

  try {
    const redirectUri = `${url.origin}/callback`;
    const token = await exchangeCodeForToken(code, redirectUri);
    const access = token.access_token;

    const accountsResp = await getAccounts(access);
    const tlAccounts = (accountsResp.results ?? []) as TLAccount[];

    // Idempotent: clear any previous connection first. The delete cascades to
    // that connection's accounts and their transactions, so a reconnect
    // replaces the old snapshot instead of duplicating it. We do not store the
    // bank token at all, so there is no secret left behind.
    await supabase.from("bank_connections").delete().eq("user_id", user.id);

    const { data: conn, error: connErr } = await supabase
      .from("bank_connections")
      .insert({
        user_id: user.id,
        provider: "truelayer",
        status: "healthy",
        is_sandbox: true,
      })
      .select("id")
      .single();
    if (connErr || !conn) throw new Error("Could not save the connection");

    for (const a of tlAccounts) {
      let balanceCents = 0;
      try {
        const bal = await getBalance(a.account_id, access);
        const current = (bal.results?.[0] as TLBalance | undefined)?.current;
        if (typeof current === "number") balanceCents = Math.round(current * 100);
      } catch {
        // A missing balance should not stop the whole sync.
      }

      const { data: acct, error: acctErr } = await supabase
        .from("accounts")
        .insert({
          user_id: user.id,
          connection_id: conn.id,
          name: a.display_name ?? "Account",
          type: a.account_type ?? null,
          balance_cents: balanceCents,
          currency: a.currency ?? "GBP",
          is_manual: false,
        })
        .select("id")
        .single();
      if (acctErr || !acct) continue;

      const txnsResp = await getTransactions(a.account_id, access);
      const txns = ((txnsResp.results ?? []) as TLTxn[]).slice(0, TXN_CAP);
      if (txns.length > 0) {
        const rows = txns.map((t) => ({
          user_id: user.id,
          account_id: acct.id,
          provider_txn_id: t.transaction_id,
          amount_cents: Math.round(t.amount * 100),
          currency: t.currency ?? a.currency ?? "GBP",
          description: t.description ?? null,
          category: t.transaction_category ?? null,
          occurred_at: t.timestamp,
          status: "settled",
          source: "synced",
        }));
        await supabase.from("transactions").insert(rows);
      }
    }

    home.searchParams.set("bank", "connected");
    const res = NextResponse.redirect(home);
    res.cookies.delete("tl_state");
    return res;
  } catch {
    home.searchParams.set("bank", "error");
    return NextResponse.redirect(home);
  }
}
