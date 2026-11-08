import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";

export default async function SavingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4, pb: 12 }}>
        <Stack spacing={1}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Savings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Coming soon. Your quiet cushion goal will grow here, no pressure and
            no deadline.
          </Typography>
        </Stack>
      </Box>
      <BottomNav />
    </Container>
  );
}
