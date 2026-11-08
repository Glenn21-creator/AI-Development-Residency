"use client";

import { useActionState, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { saveBuckets, type BucketsState } from "./actions";

export type BucketsInitial = {
  essentials: number;
  bills: number;
  fun: number;
  savings: number;
  payFrequency: "weekly" | "monthly";
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
  const [freq, setFreq] = useState<"weekly" | "monthly">(initial.payFrequency);
  const symbol = symbolFor(currencyCode);

  const amount = (
    name: "essentials" | "bills" | "fun" | "savings",
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
          Set what to protect each pay cycle. Whatever is left after these becomes
          your safe-to-spend.
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

        <Stack spacing={1}>
          <Typography variant="subtitle2" component="label" id="pay-frequency-label">
            How often are you paid?
          </Typography>
          <ToggleButtonGroup
            value={freq}
            exclusive
            onChange={(_, v) => {
              if (v) setFreq(v);
            }}
            aria-labelledby="pay-frequency-label"
            fullWidth
            color="primary"
          >
            <ToggleButton value="weekly">Weekly</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
          </ToggleButtonGroup>
          <input type="hidden" name="pay_frequency" value={freq} />
          <Typography variant="caption" color="text.secondary">
            Your buckets and savings reset each cycle.
          </Typography>
        </Stack>

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
          "fun",
          "Minimum fun money (optional)",
          "A little guilt-free spending kept even in tight cycles. Leave at 0 for none.",
          initial.fun,
        )}
        {amount(
          "savings",
          "Savings to set aside",
          "Tucked away toward your cushion. Saved only if the cycle can afford it.",
          initial.savings,
        )}

        <Button type="submit" variant="contained" size="large" disabled={pending}>
          {pending ? "Saving..." : "Save my buckets"}
        </Button>
      </Stack>
    </form>
  );
}
