import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { createClient } from "@/lib/supabase/server";
import {
  exchangeCodeForToken,
  getAccounts,
  getTransactions,
} from "@/lib/truelayer/client";

type TLAccount = {
  account_id: string;
  display_name?: string;
  account_type?: string;
  currency?: string;
};

function ErrorView({ message }: { message: string }) {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            We could not finish connecting
          </Typography>
          <Alert severity="warning" variant="outlined">
            {message}
          </Alert>
          <Button variant="contained" href="/home">
            Back to home
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; state?: string; error?: string }>;
}) {
  const sp = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("tl_state")?.value;

  if (sp.error) {
    return <ErrorView message="The bank connection was cancelled or refused." />;
  }
  if (!sp.code || !sp.state || sp.state !== savedState) {
    return (
      <ErrorView message="This connection link is invalid or has expired. Please start again." />
    );
  }

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const redirectUri = `${proto}://${host}/callback`;

  try {
    const token = await exchangeCodeForToken(sp.code, redirectUri);
    const accountsResp = await getAccounts(token.access_token);
    const accounts = (accountsResp.results ?? []) as TLAccount[];

    const withCounts = await Promise.all(
      accounts.map(async (a) => {
        const txns = await getTransactions(a.account_id, token.access_token);
        return { account: a, count: (txns.results ?? []).length };
      }),
    );

    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 6 }}>
          <Stack spacing={3} sx={{ alignItems: "stretch" }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Your bank is connected
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We pulled the following from the sandbox. Next we will save this and
              turn it into your real safe-to-spend number.
            </Typography>

            <Stack spacing={1.5}>
              {withCounts.map(({ account, count }) => (
                <Card key={account.account_id} variant="outlined">
                  <CardContent>
                    <Typography sx={{ fontWeight: 700 }}>
                      {account.display_name ?? "Account"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {account.account_type ?? "account"} ·{" "}
                      {account.currency ?? ""} · {count} transactions
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              {withCounts.length === 0 && (
                <Alert severity="info" variant="outlined">
                  Connected, but no accounts were returned.
                </Alert>
              )}
            </Stack>

            <Button variant="contained" href="/home">
              Continue to home
            </Button>
          </Stack>
        </Box>
      </Container>
    );
  } catch {
    return (
      <ErrorView message="Something went wrong talking to the bank. Please try connecting again." />
    );
  }
}
