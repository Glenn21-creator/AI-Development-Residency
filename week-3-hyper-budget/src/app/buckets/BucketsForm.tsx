"use client";

import { useActionState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import { saveBuckets, type BucketsState } from "./actions";

export type BucketsInitial = {
  essentials: number;
  bills: number;
  savings: number;
};

function symbolFor(code: string): string {
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? code;
  } catch {
    return code;
  }
}

function major(cents: number): string {
  return cents ? String(Math.round(cents / 100)) : "";
}

export default function BucketsForm({
  initial,
  currencyCode,
}: {
  initial: BucketsInitial;
  currencyCode: string;
}) {
  const [state, action, pending] = useActionState<BucketsState, FormData>(
    saveBuckets,
    {},
  );
  const symbol = symbolFor(currencyCode);

  const amount = (
    name: "essentials" | "bills" | "savings",
    label: string,
    helper: string,
    value: number,
  ) => (
    <TextField
      name={name}
      label={label}
      helperText={helper}
      defaultValue={major(value)}
      type="number"
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">{symbol}</InputAdornment>
          ),
        },
        htmlInput: { min: 0, step: "1", inputMode: "decimal" },
      }}
    />
  );

  return (
    <form action={action}>
      <Stack spacing={2.5} sx={{ alignItems: "stretch" }}>
        <Typography variant="body1" color="text.secondary">
          Set how much to protect each period. Whatever is left after these
          becomes your safe-to-spend.
        </Typography>

        {state.saved && (
          <Alert severity="success" variant="outlined">
            Saved. Your safe-to-spend will use these.
          </Alert>
        )}
        {state.error && (
          <Alert severity="warning" variant="outlined">
            {state.error}
          </Alert>
        )}

        {amount(
          "essentials",
          "Food & rent to protect",
          "Set aside first, kept safe.",
          initial.essentials,
        )}
        {amount(
          "bills",
          "Bills to set aside",
          "Money held for upcoming bills.",
          initial.bills,
        )}
        {amount(
          "savings",
          "Savings to set aside",
          "Tucked away toward your cushion.",
          initial.savings,
        )}

        <Button type="submit" variant="contained" size="large" disabled={pending}>
          {pending ? "Saving..." : "Save my buckets"}
        </Button>
      </Stack>
    </form>
  );
}
