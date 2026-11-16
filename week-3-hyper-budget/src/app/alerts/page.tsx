import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";

type AlertItem = {
  key: string;
  severity: "info" | "warning" | "success";
  title: string;
  body: string;
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

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default async function AlertsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("currency")
    .eq("id", user.id)
    .maybeSingle();
  const currency = profile?.currency ?? "EUR";

  // Bucket targets, to work out this cycle's fun allowance.
  const { data: bucketRows } = await supabase
    .from("buckets")
    .select("type,target_cents")
    .eq("user_id", user.id);
  const target = (type: string) =>
    num((bucketRows ?? []).find((b) => b.type === type)?.target_cents);

  // The current cycle's real figures (after spending).
  const { data: cycleRows } = await supabase.rpc("current_cycle_summary");
  const row = Array.isArray(cycleRows) && cycleRows.length > 0 ? cycleRows[0] : null;

  const alerts: AlertItem[] = [];

  if (row) {
    const income = num(row.income_cents);
    const overspent = num(row.amount_overspent);
    const funRemaining = num(row.safe_to_spend); // already includes the fun floor

    // The funded fun allowance for this cycle (before spending), via allocate_cycle.
    const { data: allocRows } = await supabase.rpc("allocate_cycle", {
      income_cents: income,
      essentials_cents: target("essentials"),
      bills_cents: target("bills"),
      fun_floor_cents: target("fun"),
      savings_cents: target("savings"),
    });
    const alloc = Array.isArray(allocRows) && allocRows.length > 0 ? allocRows[0] : null;
    const allowance = alloc ? num(alloc.safe_to_spend) + num(alloc.fun_floor_funded) : 0;
    const pct = allowance > 0 ? ((allowance - funRemaining) / allowance) * 100 : 0;

    // At most one fun-money alert, leading with what is still safe. No nagging.
    if (overspent > 0) {
      alerts.push({
        key: "over",
        severity: "warning",
        title: "You are a little over this cycle",
        body: `About ${money(overspent, currency)} past this cycle. Food and rent come first, and your next income will help you catch up.`,
      });
    } else if (allowance > 0 && funRemaining <= 0) {
      alerts.push({
        key: "used",
        severity: "info",
        title: "Your fun money is used up for this cycle",
        body: "Essentials and bills are still safe. Nothing you need to do.",
      });
    } else if (allowance > 0 && pct >= 80) {
      alerts.push({
        key: "t80",
        severity: "info",
        title: "You have used over 80% of your fun money this cycle",
        body: "Just a heads-up. Essentials and bills are safe.",
      });
    } else if (allowance > 0 && pct >= 50) {
      alerts.push({
        key: "t50",
        severity: "info",
        title: "You have used over half your fun money this cycle",
        body: "Just a heads-up. Essentials and bills are safe.",
      });
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4, pb: 12 }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Alerts
          </Typography>

          {alerts.length === 0 ? (
            <Alert severity="success" variant="outlined">
              <AlertTitle>Nothing needs your attention</AlertTitle>
              You are all set. We will gently let you know if your fun money is running
              low or a bill is coming up.
            </Alert>
          ) : (
            <Stack spacing={1.5}>
              {alerts.map((a) => (
                <Alert key={a.key} severity={a.severity} variant="outlined">
                  <AlertTitle>{a.title}</AlertTitle>
                  {a.body}
                </Alert>
              ))}
            </Stack>
          )}

          <Typography variant="caption" color="text.secondary">
            These are quiet, in-app nudges. Bill reminders will appear here once you add
            bills, and push notifications come later.
          </Typography>
        </Stack>
      </Box>
      <BottomNav />
    </Container>
  );
}
