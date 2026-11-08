"use client";

import { usePathname, useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

// The four main tabs, always in the same place, as designed.
const tabs = [
  { label: "Home", href: "/home", icon: "🏠" },
  { label: "Buckets", href: "/buckets", icon: "📁" },
  { label: "Alerts", href: "/alerts", icon: "🔔" },
  { label: "Savings", href: "/savings", icon: "🐷" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const current = tabs.findIndex((t) => pathname === t.href);

  return (
    <Paper
      elevation={3}
      sx={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 10 }}
    >
      <BottomNavigation
        showLabels
        value={current === -1 ? 0 : current}
        onChange={(_, index) => router.push(tabs[index].href)}
      >
        {tabs.map((t) => (
          <BottomNavigationAction
            key={t.href}
            label={t.label}
            icon={
              <span aria-hidden="true" style={{ fontSize: 20 }}>
                {t.icon}
              </span>
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
