"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import BottomNav from "@/components/BottomNav";
import { logout } from "./actions";

export type Bucket = {
  key: string;
  name: string;
  note: string;
  amountCents: number;
  status?: string;
  statusKind?: "safe" | "covered" | "heads-up";
  progress?: { current: number; target: number };
};

export type HomeData = {
  safeToSpendCents: number;
  onTrack: boolean;
  amountOverspentCents?: number;
  buckets: Bucket[];
};

export type ConnectedAccount = {
  id: string;
  name: string;
  type: string | null;
  balance_cents: number;
  currency: string;
};

function money(cents: number, code: string) {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `${Math.round(cents / 100)} ${code}`;
  }
}

export default function HomeView({
  data,
  accounts,
  connected,
  bankStatus,
  firstName,
  displayCurrency,
  real,
}: {
  data: HomeData;
  accounts: ConnectedAccount[];
  connected: boolean;
  bankStatus: string | null;
  firstName: string | null;
  displayCurrency: string;
  real: boolean;
}) {
  const [hidden, setHidden] = useState(false);
  const show = (cents: number, code: string = displayCurrency) =>
    hidden ? "•••" : money(cents, code);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4, pb: 12 }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => setHidden((h) => !h)}
            >
              {hidden ? "Show balances" : "Hide balances"}
            </Button>
          </Stack>

          {bankStatus === "connected" && (
            <Alert severity="success" variant="outlined">
              Your bank is connected.
            </Alert>
          )}
          {bankStatus === "error" && (
            <Alert severity="warning" variant="outlined">
              We could not finish connecting your bank. Please try again.
            </Alert>
          )}

          <Card variant="outlined" sx={{ bgcolor: "#E9F5EE", borderColor: "#CFE6DA" }}>
            <CardContent>
              <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Safe to spend right now
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {show(data.safeToSpendCents)}
                </Typography>
                {(data.amountOverspentCents ?? 0) > 0 ? (
                  <>
                    <Chip
                      label={`Over by ${show(data.amountOverspentCents ?? 0)} this cycle`}
                      color="warning"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      You have gone a little past this cycle. Your next income will
                      help you catch up.
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      This is yours to spend. Essentials and bills are already set
                      aside.
                    </Typography>
                    {data.onTrack && (
                      <Chip
                        label="You're on track this cycle"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Button variant="outlined" href="/connect">
            {connected
              ? "Reconnect your bank (sandbox)"
              : "Connect your bank (sandbox)"}
          </Button>

          {connected && (
            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">
                Your connected accounts
              </Typography>
              {accounts.map((a) => (
                <Card key={a.id} variant="outlined">
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ justifyContent: "space-between", alignItems: "center" }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{a.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(a.type ?? "account").toLowerCase()}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {show(a.balance_cents)}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          <Typography variant="overline" color="text.secondary">
            Your money, sorted automatically
          </Typography>

          <Stack spacing={1.5}>
            {data.buckets.map((b) => (
              <Card key={b.key} variant="outlined">
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{b.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {b.note}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {show(b.amountCents)}
                      </Typography>
                      {b.status && (
                        <Chip
                          size="small"
                          label={b.status}
                          color={b.statusKind === "heads-up" ? "warning" : "success"}
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                  </Stack>
                  {b.progress && (
                    <LinearProgress
                      variant="determinate"
                      aria-label={`${b.name} progress`}
                      value={Math.min(
                        100,
                        (b.progress.current / b.progress.target) * 100,
                      )}
                      sx={{ mt: 1.5, height: 8, borderRadius: 4 }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {real
              ? "These are your figures, from your connected accounts and the buckets you set."
              : connected
                ? "Your bank is connected. Set your buckets on the Buckets tab to see your real safe-to-spend. The numbers above are still samples."
                : "These are sample numbers for now, until your real money is connected."}
          </Typography>

          <Divider />

          <form action={logout}>
            <Button type="submit" variant="text" size="small" color="inherit">
              Log out
            </Button>
          </form>
        </Stack>
      </Box>

      <BottomNav />
    </Container>
  );
}
