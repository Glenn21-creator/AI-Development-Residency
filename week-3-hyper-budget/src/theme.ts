"use client";

import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

// Roboto is Material UI's default typeface. Loaded here so the whole app
// uses one consistent, readable font.
export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// The Hyper Budget theme. Calm, light, and kind by design:
// - Light mode only (no automatic dark mode), per the ADHD UX guidelines.
// - A calm teal-green primary instead of an alarming bright colour.
// - Softer amber for warnings so "heads up" never feels like "you failed".
// - Base font size 16px and up for easy reading.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2E7D6B" }, // calm teal-green
    secondary: { main: "#5B6BB5" },
    success: { main: "#2E7D32" },
    warning: { main: "#B26A00" }, // soft amber, not a harsh red
    error: { main: "#C62828" },
    background: { default: "#F7F9F9", paper: "#FFFFFF" },
    text: { primary: "#1F2A2E", secondary: "#4A5A61" },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    fontSize: 16, // readable base size
    button: { textTransform: "none" }, // calmer buttons, no shouting caps
  },
  shape: { borderRadius: 12 }, // soft, friendly corners
});

export default theme;
