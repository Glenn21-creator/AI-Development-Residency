import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import SavingsView, { type SavingsGoal } from "./SavingsView";

export default async function SavingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // The one cushion goal (most recent, if any).
  const { data: goalRow } = await supabase
    .from("savings_goals")
    .select("name,target_cents")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const goal: SavingsGoal | null = goalRow
    ? { name: goalRow.name ?? "Emergency cushion", targetCents: goalRow.target_cents ?? 0 }
    : null;

  // Saved so far = the real balance in the person's savings accounts. This is the
  // same set the safe-to-spend math excludes from spendable money, so the cushion
  // and the spendable number never double-count the same euro.
  const { data: accountRows } = await supabase
    .from("accounts")
    .select("type,balance_cents")
    .eq("user_id", user.id);
  const savedCents = (accountRows ?? [])
    .filter((a) => (a.type ?? "").toUpperCase() === "SAVINGS")
    .reduce((sum, a) => sum + (a.balance_cents ?? 0), 0);

  const { data: profile } = await supabase
    .from("profiles")
    .select("currency")
    .eq("id", user.id)
    .maybeSingle();
  const currencyCode = profile?.currency ?? "EUR";

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4, pb: 12 }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Savings
          </Typography>
          <SavingsView
            goal={goal}
            savedCents={savedCents}
            currencyCode={currencyCode}
          />
        </Stack>
      </Box>
      <BottomNav />
    </Container>
  );
}
