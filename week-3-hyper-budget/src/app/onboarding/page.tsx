import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createClient } from "@/lib/supabase/server";

// First-run welcome, shown once right after sign up. One calm screen: the logo, a
// plain three-step explanation of how the app works, and a single primary action
// into the bucket setup. No shame, no clutter, one clear next step (adhd-ux).
//
// If the person has already set their buckets, they have been here before, so send
// them on to Home instead of showing the intro again.
const STEPS: { title: string; body: string }[] = [
  {
    title: "Set your buckets",
    body: "Choose what to protect each pay cycle: food & rent, bills, and savings.",
  },
  {
    title: "Connect your bank",
    body: "We pull your transactions automatically. For now this is a safe sandbox, so nothing real is touched.",
  },
  {
    title: "See your safe-to-spend",
    body: "One honest number of what is yours to spend right now, updated as you go.",
  },
];

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: buckets } = await supabase
    .from("buckets")
    .select("target_cents")
    .eq("user_id", user.id);
  const hasBuckets = (buckets ?? []).some((b) => (b.target_cents ?? 0) > 0);
  if (hasBuckets) redirect("/home");

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 6,
        }}
      >
        <Stack spacing={4} sx={{ alignItems: "flex-start" }}>
          <Box
            component="img"
            src="/brand/logo-full.svg"
            alt="Hyper Budget"
            sx={{ width: "100%", maxWidth: 260, height: "auto" }}
          />

          <Stack spacing={1}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              You&apos;re in. Here&apos;s how it works.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Three small steps and you&apos;re set. It takes a minute, and you can
              change anything later.
            </Typography>
          </Stack>

          <Stack spacing={2.5} sx={{ width: "100%" }}>
            {STEPS.map((step, i) => (
              <Stack
                key={step.title}
                direction="row"
                spacing={2}
                sx={{ alignItems: "flex-start" }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.body}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>

          <Button variant="contained" size="large" href="/buckets" sx={{ mt: 1 }}>
            Let&apos;s set up
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
