"use client";

import { useActionState, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import { saveGoal, type SavingsState } from "./actions";

export type SavingsGoal = {
  name: string;
  targetCents: number;
};

function money(cents: number, code: string) {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `${Math.round(cents / 100)} ${code}`;
  }
}

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

export default function SavingsView({
  goal,
  savedCents,
  currencyCode,
}: {
  goal: SavingsGoal | null;
  savedCents: number;
  currencyCode: string;
}) {
  const [state, action, pending] = useActionState<SavingsState, FormData>(
    saveGoal,
    {},
  );
  const [editing, setEditing] = useState(!goal);
  const symbol = symbolFor(currencyCode);

  // After a successful save, drop back to the progress view.
  useEffect(() => {
    if (state.saved) setEditing(false);
  }, [state.saved]);

  if (goal && !editing) {
    const target = goal.targetCents;
    const pct = target > 0 ? Math.min(100, Math.round((savedCents / target) * 100)) : 0;
    const toGo = Math.max(0, target - savedCents);
    const reached = target > 0 && savedCents >= target;

    return (
      <Stack spacing={2.5}>
        <Card variant="outlined" sx={{ bgcolor: "#E9F5EE", borderColor: "#CFE6DA" }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {goal.name}
                </Typography>
                {reached && (
                  <Chip label="Goal reached" color="success" variant="outlined" />
                )}
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                {money(savedCents, currencyCode)}
                <Typography component="span" variant="body1" color="text.secondary">
                  {" "}
                  of {money(target, currencyCode)}
                </Typography>
              </Typography>

              <LinearProgress
                variant="determinate"
                value={pct}
                aria-label={`Saved ${pct} percent of your goal`}
                sx={{ height: 10, borderRadius: 5 }}
              />

              <Typography variant="body2" color="text.secondary">
                {reached
                  ? "You have reached your cushion goal. Lovely work."
                  : `${money(toGo, currencyCode)} to go, no rush and no deadline.`}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary">
          This grows from the money in your savings accounts. Nothing to top up by
          hand.
        </Typography>

        <Box>
          <Button variant="text" size="small" onClick={() => setEditing(true)}>
            Edit goal
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <form action={action}>
      <Stack spacing={2.5} sx={{ alignItems: "stretch" }}>
        <Typography variant="body1" color="text.secondary">
          Set one simple cushion goal. We will quietly track it against your
          savings. No deadline, no pressure.
        </Typography>

        {state.error && (
          <Alert severity="warning" variant="outlined">
            {state.error}
          </Alert>
        )}

        <TextField
          name="name"
          label="Goal name"
          helperText="For example, Emergency cushion."
          defaultValue={goal?.name ?? "Emergency cushion"}
          fullWidth
        />

        <TextField
          name="target"
          label="Goal amount"
          helperText="The cushion you are building toward."
          defaultValue={major(goal?.targetCents ?? 0)}
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

        <Stack direction="row" spacing={1.5}>
          <Button type="submit" variant="contained" size="large" disabled={pending}>
            {pending ? "Saving..." : "Save my goal"}
          </Button>
          {goal && (
            <Button
              type="button"
              variant="text"
              size="large"
              onClick={() => setEditing(false)}
              disabled={pending}
            >
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </form>
  );
}
