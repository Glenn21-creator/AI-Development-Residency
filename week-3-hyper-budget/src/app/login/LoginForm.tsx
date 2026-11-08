"use client";

import { useActionState, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import { authenticate, type AuthState } from "./actions";
import { createClient } from "@/lib/supabase/client";

// The log in / create account screen. One screen that flips between the two
// modes. Calm copy, one clear primary action, kind errors that keep what you
// typed, and a show-password toggle for easier typing.
export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    authenticate,
    {},
  );

  const isSignup = mode === "signup";

  async function handleGoogle() {
    setGooglePending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    // On success the browser redirects to Google, so this line only runs on error.
    if (error) setGooglePending(false);
  }

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
        <Stack spacing={3} sx={{ alignItems: "stretch" }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
            Hyper Budget
          </Typography>

          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {isSignup ? "Create your account" : "Welcome back"}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {isSignup
              ? "Let's get you set up. It only takes a moment."
              : "Let's get you in."}
          </Typography>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={handleGoogle}
            disabled={googlePending}
          >
            {googlePending ? "Redirecting..." : "Continue with Google"}
          </Button>

          <Divider>or</Divider>

          {state.error && (
            <Alert severity="warning" variant="outlined">
              {state.error}
            </Alert>
          )}
          {state.message && (
            <Alert severity="success" variant="outlined">
              {state.message}
            </Alert>
          )}

          <form action={formAction}>
            <input type="hidden" name="intent" value={mode} />
            <Stack spacing={2} sx={{ alignItems: "stretch" }}>
              <TextField
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                fullWidth
                helperText={isSignup ? "At least 6 characters." : undefined}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                }
                label="Show password"
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={pending}
              >
                {pending
                  ? "Just a moment..."
                  : isSignup
                    ? "Create account"
                    : "Log in"}
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" color="text.secondary">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => setMode("login")}
                >
                  Log in
                </Link>
              </>
            ) : (
              <>
                New here?{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => setMode("signup")}
                >
                  Create an account
                </Link>
              </>
            )}
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
