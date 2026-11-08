// Server-only client for TrueLayer (the open-banking sandbox). It reads the
// app-wide client keys from the environment and never runs in the browser.
// The flow: send the person to the hosted bank screen with an auth link, get a
// code back, exchange it for a token, then read accounts and transactions.

const AUTH_BASE = "https://auth.truelayer-sandbox.com";
const DATA_BASE = "https://api.truelayer-sandbox.com/data/v1";

// What we ask permission to read: account info, balances, and transactions.
const SCOPES = ["info", "accounts", "balance", "transactions"];

// The sandbox mock bank. Fake accounts and data only.
const SANDBOX_PROVIDER = "uk-cs-mock";

// Build the link that sends the person to the hosted bank login.
export function buildAuthLink(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.TRUELAYER_CLIENT_ID ?? "",
    scope: SCOPES.join(" "),
    redirect_uri: redirectUri,
    providers: SANDBOX_PROVIDER,
    state,
  });
  return `${AUTH_BASE}/?${params.toString()}`;
}

// Trade the one-time code for an access token once the person returns.
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const res = await fetch(`${AUTH_BASE}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.TRUELAYER_CLIENT_ID ?? "",
      client_secret: process.env.TRUELAYER_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      code,
    }),
  });
  if (!res.ok) {
    throw new Error(`TrueLayer token exchange failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function dataFetch<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`${DATA_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`TrueLayer ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export async function getAccounts(accessToken: string): Promise<{ results: unknown[] }> {
  return dataFetch("/accounts", accessToken);
}

export async function getBalance(
  accountId: string,
  accessToken: string,
): Promise<{ results: unknown[] }> {
  return dataFetch(`/accounts/${accountId}/balance`, accessToken);
}

export async function getTransactions(
  accountId: string,
  accessToken: string,
): Promise<{ results: unknown[] }> {
  return dataFetch(`/accounts/${accountId}/transactions`, accessToken);
}
