import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createClient } from "@/lib/supabase/server";

// The first step after logging in: connect a bank. Once connected, the person is
// sent on to Home. If they already have a bank linked, skip straight to Home.
export default async function StartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: accounts } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);
  if ((accounts ?? []).length > 0) redirect("/home");

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
        <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
            Hyper Budget
          </Typography>

          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Let&apos;s connect your bank
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Connect a bank account so Hyper Budget can show you what is safe to spend.
            This is the sandbox, so when it asks, use the test login the facilitator
            gives you. Nothing real is touched.
          </Typography>

          <Button variant="contained" size="large" href="/connect">
            Connect your bank (sandbox)
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
