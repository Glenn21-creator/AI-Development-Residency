"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import BottomNav from "@/components/BottomNav";
import { logout, disconnectBank, logSpend, type SpendState } from "./actions";

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

// Exact money (with cents) for the "Logged" confirmation, so a small spend still
// shows a real figure even though the big numbers are whole euros.
function moneyExact(cents: number, code: string) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: code }).format(
      cents / 100,
    );
  } catch {
    return `${(cents / 100).toFixed(2)} ${code}`;
  }
}

function bucketLabel(bucket: string | undefined): string {
  if (bucket === "essentials") return "Food & rent";
  if (bucket === "bills") return "Bills";
  return "Fun money";
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
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [spendOpen, setSpendOpen] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);
  const [spendState, spendAction, spendPending] = useActionState<SpendState, FormData>(
    logSpend,
    {},
  );
  const show = (cents: number, code: string = displayCurrency) =>
    hidden ? "•••" : money(cents, code);

  // On each successful log, close the dialog and show a brief confirmation, so a
  // spend always gives feedback even when it is absorbed by a bucket.
  useEffect(() => {
    if (spendState.at && spendState.ok) {
      setSpendOpen(false);
      setSnack(
        `Logged ${moneyExact(spendState.loggedCents ?? 0, displayCurrency)} to ${bucketLabel(spendState.bucket)}`,
      );
      // Re-fetch the server-rendered numbers so the screen reflects the new spend.
      router.refresh();
    }
  }, [spendState.at, spendState.ok, spendState.loggedCents, spendState.bucket, displayCurrency, router]);

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

          {connected && (
            <Box sx={{ textAlign: "center" }}>
              <Button variant="text" size="small" onClick={() => setSpendOpen(true)}>
                Log a spend
              </Button>
            </Box>
          )}

          <Button variant="outlined" href="/connect">
            {connected
              ? "Reconnect your bank (sandbox)"
              : "Connect your bank (sandbox)"}
          </Button>

          {connected && (
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="text"
                size="small"
                color="inherit"
                onClick={() => setDisconnectOpen(true)}
              >
                Disconnect bank
              </Button>
            </Box>
          )}

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

      <Dialog open={spendOpen} onClose={() => setSpendOpen(false)} fullWidth maxWidth="xs">
        <form action={spendAction}>
          <DialogTitle>Log a spend</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Add a spend and watch your safe-to-spend update.
            </DialogContentText>
            {spendState.error && (
              <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
                {spendState.error}
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField
                name="amount"
                label="Amount"
                helperText={`In ${displayCurrency}`}
                type="number"
                fullWidth
                autoFocus
                slotProps={{ htmlInput: { min: 0, step: "0.01", inputMode: "decimal" } }}
              />
              <TextField
                select
                name="bucket"
                label="Spend from"
                defaultValue="fun"
                fullWidth
                helperText="Fun money is your everyday spending."
              >
                <MenuItem value="fun">Fun money</MenuItem>
                <MenuItem value="essentials">Food & rent</MenuItem>
                <MenuItem value="bills">Bills</MenuItem>
              </TextField>
              <TextField name="note" label="What was it? (optional)" fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setSpendOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={spendPending}>
              {spendPending ? "Saving..." : "Log it"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={disconnectOpen} onClose={() => setDisconnectOpen(false)}>
        <DialogTitle>Disconnect your bank?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes your linked accounts and their transactions from Hyper
            Budget. Your buckets and savings goal stay, and you can reconnect any
            time.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisconnectOpen(false)}>Keep connected</Button>
          <form action={disconnectBank}>
            <Button type="submit" color="warning" onClick={() => setDisconnectOpen(false)}>
              Disconnect
            </Button>
          </form>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      <BottomNav />
    </Container>
  );
}
