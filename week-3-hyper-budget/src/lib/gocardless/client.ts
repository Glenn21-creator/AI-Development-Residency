// Server-only client for GoCardless Bank Account Data (the open-banking sandbox).
// It reads the app-wide secret keys from the environment and never runs in the
// browser. The connection flow: create a requisition, send the person to the
// bank's hosted screen, then read the linked accounts and their transactions.

const BASE = "https://bankaccountdata.gocardless.com/api/v2";

// The mock bank for testing. Fake accounts only, and excluded from usage limits.
export const SANDBOX_INSTITUTION_ID = "SANDBOXFINANCE_SFIN0000";

// Exchange the secret keys for a short-lived access token.
async function getAccessToken(): Promise<string> {
  const res = await fetch(`${BASE}/token/new/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      secret_id: process.env.GOCARDLESS_SECRET_ID,
      secret_key: process.env.GOCARDLESS_SECRET_KEY,
    }),
  });
  if (!res.ok) {
    throw new Error(`GoCardless token request failed: ${res.status}`);
  }
  const data = (await res.json()) as { access: string };
  return data.access;
}

async function gcFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GoCardless ${path} failed: ${res.status} ${body}`);
  }
  return (await res.json()) as T;
}

export type Requisition = {
  id: string;
  status: string;
  link: string;
  accounts: string[];
};

// Start a connection. Returns the hosted link to send the person to, and the id
// we keep so we can read the linked accounts when they come back.
export async function createRequisition(
  redirectUrl: string,
  reference: string,
): Promise<Requisition> {
  const token = await getAccessToken();
  return gcFetch<Requisition>("/requisitions/", token, {
    method: "POST",
    body: JSON.stringify({
      redirect: redirectUrl,
      institution_id: SANDBOX_INSTITUTION_ID,
      reference,
    }),
  });
}

// After the person returns, read which accounts got linked (status "LN").
export async function getRequisition(requisitionId: string): Promise<Requisition> {
  const token = await getAccessToken();
  return gcFetch<Requisition>(`/requisitions/${requisitionId}/`, token);
}

export async function getAccountDetails(accountId: string): Promise<unknown> {
  const token = await getAccessToken();
  return gcFetch(`/accounts/${accountId}/details/`, token);
}

export async function getAccountBalances(accountId: string): Promise<unknown> {
  const token = await getAccessToken();
  return gcFetch(`/accounts/${accountId}/balances/`, token);
}

export async function getAccountTransactions(accountId: string): Promise<unknown> {
  const token = await getAccessToken();
  return gcFetch(`/accounts/${accountId}/transactions/`, token);
}
