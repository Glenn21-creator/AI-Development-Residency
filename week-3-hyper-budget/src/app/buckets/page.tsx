import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import BucketsForm, { type BucketsInitial } from "./BucketsForm";

export default async function BucketsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: buckets } = await supabase
    .from("buckets")
    .select("type,target_cents")
    .eq("user_id", user.id);

  const byType = new Map(
    (buckets ?? []).map((b) => [b.type as string, (b.target_cents as number) ?? 0]),
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("currency,pay_frequency")
    .eq("id", user.id)
    .maybeSingle();
  const currencyCode = profile?.currency ?? "EUR";

  const initial: BucketsInitial = {
    essentials: byType.get("essentials") ?? 0,
    bills: byType.get("bills") ?? 0,
    fun: byType.get("fun") ?? 0,
    savings: byType.get("savings") ?? 0,
    payFrequency: profile?.pay_frequency === "weekly" ? "weekly" : "monthly",
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4, pb: 12 }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Your buckets
          </Typography>
          <BucketsForm initial={initial} currencyCode={currencyCode} />
        </Stack>
      </Box>
      <BottomNav />
    </Container>
  );
}
