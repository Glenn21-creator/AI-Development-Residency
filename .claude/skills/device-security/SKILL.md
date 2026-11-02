---
name: device-security
description: Use this skill whenever you build or change how Hyper Budget is locked, unlocked, or protected on the device. It covers app lock, face or fingerprint unlock, auto-lock after inactivity, and hiding balances in the app switcher and on screen. Follow it for any feature touching unlock, privacy on screen, or who can open the app.
---

# Hyper Budget: Device security

Hyper Budget shows someone's money, which is private and sensitive. A phone gets
left on a desk, handed to a child, or glanced at by someone nearby. This skill
keeps a user's financial picture private on their own device, in a way that feels
calm and easy rather than annoying.

## App lock

- Offer an app lock so Hyper Budget requires authentication to open.
- Lock on launch and when returning from the background after the auto-lock time.
- Keep the setup simple and clearly optional at first, but strongly encouraged,
  explained in plain, non-scary language.

## Face or fingerprint unlock (biometrics)

- Support the platform's biometric unlock (Face ID, Touch ID, Android biometrics)
  as the easy default, because low friction is what keeps ADHD users using it.
- Always provide a fallback (device passcode or an app PIN) in case biometrics
  fail or are unavailable.
- Use the platform's biometric APIs. Do not store or handle the biometric data
  yourself; the operating system does that. The app only receives a yes-or-no
  result.
- Never store a PIN or passcode in plain text. If an app PIN is used, store it
  hashed with a strong password hash (Argon2id, bcrypt, or scrypt) and a unique
  salt. See `secrets-and-api-keys`.

## Auto-lock after inactivity

- Lock the app automatically after a short period of inactivity, with a sensible
  default and a user-adjustable setting.
- Lock immediately when the app goes to the background, so a quick switch does
  not leave money data open.

## Hide balances in the app switcher and on screen

- When the app goes to the background, hide the financial content in the app
  switcher preview (show a blank or branded screen, not the balances). Use the
  platform's privacy-screen approach for this.
- Offer a "hide balances" toggle that replaces amounts with dots or a blur on
  screen, so a user can open the app near other people without showing numbers.
  This also supports the calm, shame-free feel (see `adhd-ux-guidelines`).
- Remember the hide-balances choice per user, and make it quick to toggle.

## General device-security rules

- **Sessions still apply behind the lock.** Unlocking the app is not the same as
  authorizing every action; keep secure sessions (see `security`).
- **Fail safely.** If unlock fails repeatedly, slow down retries rather than
  granting access. Do not reveal whether an account exists.
- **No sensitive data in logs or crash reports.** Never log balances, tokens, or
  personal data.
- **Encrypt sensitive data at rest on the device** (see `local-data-and-sync`),
  so a lost or stolen phone does not expose it.
- Keep the whole experience kind and low-friction. Security that annoys the user
  gets turned off, which is worse than a gentle default.

## Quick pre-delivery check

- App lock works on launch and on return from background.
- Biometric unlock works, with a reliable fallback.
- Auto-lock triggers after inactivity and on backgrounding.
- Balances are hidden in the app switcher preview.
- The hide-balances toggle works and is remembered.
- No PIN, passcode, token, or balance is stored or logged in plain text.

Related: `secrets-and-api-keys`, `security`, `local-data-and-sync`,
`adhd-ux-guidelines`, `gdpr-privacy`.
