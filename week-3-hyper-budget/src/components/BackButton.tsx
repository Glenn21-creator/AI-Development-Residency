"use client";

import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

// A top-left back control for secondary screens (for example Recent activity reached
// from the menu). Keyboard-focusable with a clear screen-reader label. Defaults to
// going Home, since the secondary screens are reached from there.
export default function BackButton({
  to = "/home",
  label = "Back to home",
}: {
  to?: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <IconButton onClick={() => router.push(to)} aria-label={label} edge="start">
      <Box component="span" aria-hidden="true" sx={{ fontSize: 24, lineHeight: 1 }}>
        ←
      </Box>
    </IconButton>
  );
}
