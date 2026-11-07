import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// A calm welcome screen. One clear primary action, warm and plain language,
// no shame and nothing alarming. This also proves Material UI is wired up.
export default function Home() {
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
          <Typography variant="overline" color="primary" fontWeight={700}>
            Hyper Budget
          </Typography>

          <Typography variant="h3" component="h1" fontWeight={700}>
            Welcome. Let&apos;s make money feel calm.
          </Typography>

          <Typography variant="body1" color="text.secondary">
            A gentle, ADHD-friendly way to see what&apos;s safe to spend. No
            shame, no catch-up chores, just a clear next step whenever you open
            the app.
          </Typography>

          <Button variant="contained" size="large">
            Get started
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
