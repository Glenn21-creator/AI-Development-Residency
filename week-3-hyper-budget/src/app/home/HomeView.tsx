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
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
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
import {
  logout,
  disconnectBank,
  logSpend,
  logIncome,
  clearMyData,
  resetToNewUser,
  type SpendState,
  type ClearState,
} from "./actions";
import {
  resolveSpendSources,
  bucketDisplayName,
  joinNames,
  encodeSources,
} from "@/lib/spend-cascade";

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
  connected,
  bankStatus,
  firstName,
  displayCurrency,
  real,
}: {
  data: HomeData;
  connected: boolean;
  bankStatus: string | null;
  firstName: string | null;
  displayCurrency: string;
  real: boolean;
}) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [spendOpen, setSpendOpen] = useState(false);
  const [spendAmount, setSpendAmount] = useState("");
  const [spendBucket, setSpendBucket] = useState("fun");
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);
  const [spendState, spendAction, spendPending] = useActionState<SpendState, FormData>(
    logSpend,
    {},
  );
  const [incomeState, incomeAction, incomePending] = useActionState<SpendState, FormData>(
    logIncome,
    {},
  );
  const [clearState, clearAction, clearPending] = useActionState<ClearState, FormData>(
    clearMyData,
    {},
  );
  const [resetState, resetAction, resetPending] = useActionState<ClearState, FormData>(
    resetToNewUser,
    {},
  );
  const show = (cents: number, code: string = displayCurrency) =>
    hidden ? "•••" : money(cents, code);

  // Pre-spend heads-up and the real source of the money. We work out, from the
  // cascade, which bucket(s) the spend actually draws from, so the warning, the
  // confirmation, and Recent activity all tell the same truth. Only when we have real
  // figures; never on sample data.
  const spendCents = Math.round((Number(spendAmount.replace(",", ".")) || 0) * 100);
  const remainingByKey: Record<string, number> = {
    fun: Math.max(0, data.buckets.find((b) => b.key === "fun")?.amountCents ?? 0),
    savings: Math.max(0, data.buckets.find((b) => b.key === "savings")?.amountCents ?? 0),
    bills: Math.max(0, data.buckets.find((b) => b.key === "bills")?.amountCents ?? 0),
    essentials: Math.max(
      0,
      data.buckets.find((b) => b.key === "essentials")?.amountCents ?? 0,
    ),
  };
  const bucketRemaining = remainingByKey[spendBucket] ?? 0;
  const willOverspend = real && spendCents > 0 && spendCents > bucketRemaining;

  const { sources: spendSources, overspent: spendOverspent } =
    real && spendCents > 0
      ? resolveSpendSources(spendBucket, spendCents, remainingByKey)
      : { sources: [], overspent: 0 };
  // Record the real split (bucket + amount) so Recent activity shows it. When nothing
  // resolves (for example before any income), fall back to the chosen bucket.
  const chargedFromValue = encodeSources(
    spendSources.length > 0 ? spendSources : [{ key: spendBucket, cents: spendCents }],
  );

  const spendWarningText = (() => {
    const lead =
      bucketRemaining <= 0
        ? `Your ${bucketDisplayName(spendBucket)} is empty this cycle.`
        : `Your ${bucketDisplayName(spendBucket)} has ${moneyExact(bucketRemaining, displayCurrency)} left this cycle.`;
    // Name every bucket this spend touches, with how much comes from each.
    const breakdown = joinNames(
      spendSources.map(
        (s) => `${bucketDisplayName(s.key)} (${moneyExact(s.cents, displayCurrency)})`,
      ),
    );
    const coveredCents = spendCents - spendOverspent;
    const body = breakdown
      ? ` This ${moneyExact(coveredCents, displayCurrency)} will come from ${breakdown}.`
      : "";
    const tail =
      spendOverspent > 0
        ? ` ${moneyExact(spendOverspent, displayCurrency)} more would be over budget this cycle. Your next income will catch it up.`
        : " Your next income will top it back up.";
    return lead + body + tail;
  })();

  // On each successful log, close the dialog and show a brief confirmation, so a
  // spend always gives feedback even when it is absorbed by a bucket.
  useEffect(() => {
    if (spendState.at && spendState.ok) {
      setSpendOpen(false);
      setSpendAmount("");
      setSpendBucket("fun");
      setSnack(
        `Spent ${moneyExact(spendState.loggedCents ?? 0, displayCurrency)} from ${spendState.sourceLabel || bucketLabel(spendState.bucket)}`,
      );
      // Re-fetch the server-rendered numbers so the screen reflects the new spend.
      router.refresh();
    }
  }, [spendState.at, spendState.ok, spendState.loggedCents, spendState.bucket, displayCurrency, router]);

  useEffect(() => {
    if (incomeState.at && incomeState.ok) {
      setIncomeOpen(false);
      setSnack(`Added income ${moneyExact(incomeState.loggedCents ?? 0, displayCurrency)}`);
      router.refresh();
    }
  }, [incomeState.at, incomeState.ok, incomeState.loggedCents, displayCurrency, router]);

  // On a successful clear, close the dialog and refresh. Home then sees no accounts
  // and sends them to the connect page. On failure the dialog stays open and shows
  // the reason (see the clear dialog below).
  useEffect(() => {
    if (clearState.at && clearState.ok) {
      setClearOpen(false);
      setSnack("Your data was cleared. Starting fresh.");
      router.refresh();
    }
  }, [clearState.at, clearState.ok, router]);

  // On a successful reset, the person has no buckets, so take them to the first-run
  // welcome, the same place a brand-new user starts.
  useEffect(() => {
    if (resetState.at && resetState.ok) {
      setResetOpen(false);
      router.push("/onboarding");
    }
  }, [resetState.at, resetState.ok, router]);

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
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <Button
                variant="text"
                size="small"
                onClick={() => setHidden((h) => !h)}
              >
                {hidden ? "Show balances" : "Hide balances"}
              </Button>
              <IconButton onClick={() => setMenuOpen(true)} aria-label="Open menu">
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{ fontSize: 22, lineHeight: 1 }}
                >
                  ☰
                </Box>
              </IconButton>
            </Stack>
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

          {connected ? (
          <>
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
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => {
                  setSpendAmount("");
                  setSpendBucket("fun");
                  setSpendOpen(true);
                }}
              >
                Add a transaction
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => setIncomeOpen(true)}
              >
                Add income
              </Button>
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
              : "Set your buckets on the Buckets tab to see your real safe-to-spend."}
          </Typography>
          </>
          ) : (
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center", py: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                    Connect your bank to get started
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your buckets are set. Connect a bank account and Hyper Budget will
                    show you what is safe to spend. This is the sandbox, so use the test
                    login when it asks. Nothing real is touched.
                  </Typography>
                  <Button variant="contained" size="large" href="/connect">
                    Connect your bank (sandbox)
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}

        </Stack>
      </Box>

      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation">
          <Box sx={{ px: 2, py: 2 }}>
            <Box
              component="img"
              src="/brand/logo-full.svg"
              alt="Hyper Budget"
              sx={{ width: "100%", maxWidth: 180, height: "auto" }}
            />
          </Box>
          <Divider />
          <List>
            <ListItemButton
              onClick={() => {
                setMenuOpen(false);
                router.push("/activity");
              }}
            >
              <ListItemText primary="Recent activity" />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setMenuOpen(false);
                router.push("/connect");
              }}
            >
              <ListItemText
                primary={connected ? "Reconnect your bank" : "Connect your bank"}
              />
            </ListItemButton>
            {connected && (
              <ListItemButton
                onClick={() => {
                  setMenuOpen(false);
                  setDisconnectOpen(true);
                }}
              >
                <ListItemText primary="Disconnect bank" />
              </ListItemButton>
            )}
            <Divider />
            <ListItemButton
              onClick={() => {
                setMenuOpen(false);
                setClearOpen(true);
              }}
            >
              <ListItemText
                primary="Clear my data (testing)"
                secondary="Clears history, keeps your bank connected."
                slotProps={{ secondary: { sx: { fontSize: 12 } } }}
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setMenuOpen(false);
                setResetOpen(true);
              }}
            >
              <ListItemText
                primary="Reset to new user (testing)"
                secondary="Wipes everything, back to the welcome screen."
                slotProps={{ secondary: { sx: { fontSize: 12 } } }}
              />
            </ListItemButton>
            <Divider />
            <form action={logout}>
              <ListItemButton component="button" type="submit" sx={{ width: "100%" }}>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </form>
          </List>
        </Box>
      </Drawer>

      <Dialog open={spendOpen} onClose={() => setSpendOpen(false)} fullWidth maxWidth="xs">
        <form action={spendAction}>
          <DialogTitle>Add a transaction</DialogTitle>
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
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
                slotProps={{ htmlInput: { min: 0, step: "0.01", inputMode: "decimal" } }}
              />
              <TextField
                select
                name="bucket"
                label="What kind of spend?"
                value={spendBucket}
                onChange={(e) => setSpendBucket(e.target.value)}
                fullWidth
                helperText="What it was for. We handle where the money comes from."
              >
                <MenuItem value="fun">Fun money</MenuItem>
                <MenuItem value="essentials">Food & rent</MenuItem>
                <MenuItem value="bills">Bills</MenuItem>
              </TextField>
              <TextField name="note" label="What was it? (optional)" fullWidth />
            </Stack>
            <input type="hidden" name="charged_from" value={chargedFromValue} />

            {willOverspend && (
              <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                {spendWarningText}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setSpendOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color={willOverspend ? "warning" : "primary"}
              disabled={spendPending}
            >
              {spendPending ? "Saving..." : willOverspend ? "Spend anyway" : "Add it"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={incomeOpen} onClose={() => setIncomeOpen(false)} fullWidth maxWidth="xs">
        <form action={incomeAction}>
          <DialogTitle>Add income</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Add money in (for testing, or cash income). Your safe-to-spend will go
              up.
            </DialogContentText>
            {incomeState.error && (
              <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
                {incomeState.error}
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
              <TextField name="note" label="What was it? (optional)" fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setIncomeOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={incomePending}>
              {incomePending ? "Saving..." : "Add it"}
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

      <Dialog open={clearOpen} onClose={() => setClearOpen(false)}>
        <form action={clearAction}>
          <DialogTitle>Clear your data?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This is a testing tool. It clears all your transaction history (the ones
              synced from the sandbox and the ones you logged) and resets your savings
              cushion, so you can start fresh. Your bank stays connected, and your
              buckets and settings stay. This cannot be undone.
            </DialogContentText>
            {clearState.error && (
              <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                {clearState.error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setClearOpen(false)}>
              Keep my data
            </Button>
            <Button type="submit" color="warning" disabled={clearPending}>
              {clearPending ? "Clearing..." : "Clear it"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <form action={resetAction}>
          <DialogTitle>Reset to a new user?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This is a testing tool. It permanently deletes your buckets, bank
              connection, accounts, transactions, and savings cushion, so the app
              treats you as a brand-new user and you start again from the welcome
              screen. Your login stays. This cannot be undone.
            </DialogContentText>
            {resetState.error && (
              <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                {resetState.error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setResetOpen(false)}>
              Keep my data
            </Button>
            <Button type="submit" color="warning" disabled={resetPending}>
              {resetPending ? "Resetting..." : "Reset"}
            </Button>
          </DialogActions>
        </form>
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
