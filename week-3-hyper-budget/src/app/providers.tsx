"use client";

import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";

// Wraps the whole app so every screen gets:
// - AppRouterCacheProvider: makes Material UI's styles render correctly on
//   the server (no flash of unstyled content on first load).
// - ThemeProvider: makes our calm Hyper Budget theme available everywhere.
// - CssBaseline: a sensible, consistent style reset across browsers.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
