import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";

function money(cents: number, code: string) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: code }).format(
      cents / 100,
    );
  } catch {
    return `${(cents / 100).toFixed(2)} ${code}`;
  }
}

export default async function ActivityPage() {
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

  const { data: txnRows } = await supabase
    .from("transactions")
    .select("id,amount_cents,description,category,occurred_at,source")
    .eq("user_id", user.id)
    .order("occurred_at", { ascending: false })
    .limit(40);
  const items = txnRows ?? [];

  // Map each spend's bank label to its bucket, the same way the engine does.
  const { data: lbRows } = await supabase.from("label_buckets").select("label,bucket");
  const labelMap = new Map((lbRows ?? []).map((r) => [r.label as string, r.bucket as string]));
  const bucketName = (category: string | null): string => {
    const b = labelMap.get((category ?? "").toLowerCase().trim()) ?? "fun";
    if (b === "essentials") return "Food & rent";
    if (b === "bills") return "Bills";
    if (b === "savings") return "Savings";
    return "Fun money";
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4, pb: 12 }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Recent activity
          </Typography>

          {items.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No activity yet. Spends you log and transactions from your bank will show
              here, newest first.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {items.map((t) => {
                const cents = Number(t.amount_cents) || 0;
                const isIn = cents > 0;
                const date = new Date(t.occurred_at).toISOString().slice(0, 10);
                return (
                  <Card key={t.id} variant="outlined">
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ justifyContent: "space-between", alignItems: "center" }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {t.description || (isIn ? "Money in" : "Spend")}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {date}, {t.source === "manual" ? "logged by you" : "from your bank"}
                          </Typography>
                          {!isIn && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`From ${bucketName(t.category)}`}
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            flexShrink: 0,
                            color: isIn ? "success.main" : "text.primary",
                          }}
                        >
                          {isIn ? "+" : "-"}
                          {money(Math.abs(cents), currency)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Box>
      <BottomNav />
    </Container>
  );
}
