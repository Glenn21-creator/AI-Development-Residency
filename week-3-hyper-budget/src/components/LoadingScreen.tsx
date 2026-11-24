import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import BottomNav from "@/components/BottomNav";

// A calm, instant loading state for the tab screens. The App Router shows it the
// moment a tab is tapped, so there is always clear feedback while the page's data
// loads (no more frozen screen for a second or two). It keeps the bottom nav
// visible, with the tapped tab already highlighted, so nothing jumps. The skeleton's
// gentle shimmer is calmer than a spinner (adhd-ux).
export default function LoadingScreen() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4, pb: 12 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="55%" height={44} />
          <Skeleton variant="rounded" height={132} />
          <Skeleton variant="text" width="40%" height={28} />
          <Skeleton variant="rounded" height={84} />
          <Skeleton variant="rounded" height={84} />
          <Skeleton variant="rounded" height={84} />
        </Stack>
      </Box>
      <BottomNav />
    </Container>
  );
}
