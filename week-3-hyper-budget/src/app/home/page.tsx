import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

// A protected placeholder home screen. It confirms the whole stack works end to
// end: the screen, the server, the database, and sign-in. If no one is logged
// in, it sends them to the login screen.
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
            You&apos;re in.
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Signed in as {user.email}. This is a placeholder home screen for now.
            It proves the whole stack works end to end: the screen, the server,
            the database, and sign-in.
          </Typography>

          <form action={logout}>
            <Button type="submit" variant="outlined" size="large">
              Log out
            </Button>
          </form>
        </Stack>
      </Box>
    </Container>
  );
}
