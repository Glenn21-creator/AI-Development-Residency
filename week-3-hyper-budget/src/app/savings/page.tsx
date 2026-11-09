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

  // Compute-on-open: lock any completed cycles' surviving savings (idempotent), then
  // read the cumulative cushion (locked cycles plus this cycle's provisional). This
  // is the append-only ledger cushion (ADR 0011), not the raw savings-account
  // balance. If the migrations are not applied yet, fall back to 0 so the page works.
  await supabase.rpc("lock_completed_cycles");
  let savedCents = 0;
  const { data: cushionData, error: cushionErr } = await supabase.rpc("savings_cushion");
  if (!cushionErr) {
    const n = typeof cushionData === "number" ? cushionData : Number(cushionData);
    if (Number.isFinite(n)) savedCents = n;
  }

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
