---
name: open-banking-sandbox
description: Use this skill whenever you build or change bank linking, account connection, transaction fetching, or anything that talks to a bank data provider. It sets how to connect accounts automatically through a European open banking provider's free sandbox (fake test accounts only), with manual entry as a backup. Automatic linking is the default because manual setup is where ADHD users give up.
---

# Hyper Budget: Open banking sandbox

Hyper Budget sees a user's money by connecting to their bank. In this practice
project we only ever use a **sandbox**: a provider's free test environment with
**fake accounts and fake data**. We never connect a real bank account and never
touch real money data.

## Why automatic linking is the default

Manual setup and manual entry are exactly where ADHD users give up. The whole
product promise is near-zero upkeep. So automatic bank linking is the default
path, and manual entry exists only as a backup for when a bank cannot be linked.

- Lead new users into automatic linking first.
- Offer manual entry as a quieter, secondary option, not the main path.
- Never make manual entry feel like the normal way to use the app.

## Use a sandbox only

- Use a European open banking provider that offers a **free sandbox** (for
  example, a provider's test environment with mock banks and test users).
- Connect only to the provider's **sandbox / test** endpoints and test banks.
- Use the provider's **test credentials** for the fake accounts, which the
  provider publishes for its sandbox. Never enter a real person's bank login.
- Keep a clear flag in the code and config that says this is sandbox mode, so no
  one can point it at production by accident.

## How the connection flow should work

1. The user chooses to link a bank.
2. The app opens the provider's hosted connection screen (the provider handles
   the login, not us, so we never see or store bank credentials).
3. The provider returns a token that lets us read the account.
4. We store that token securely (see `secrets-and-api-keys`), never in the app
   code or in the client.
5. We pull accounts, balances, and transactions, and categorize them.
6. We keep the connection healthy and offer a gentle reconnect if it breaks (see
   the backlog ticket for maintaining connections).

## Security rules for bank connections

These are not optional, even with sandbox data, because we are building the real
habits:

- **We never handle the bank login ourselves.** The provider's hosted flow does.
- **Tokens are secrets.** Store them server-side in a secrets manager or vault,
  encrypted, never in source control or on the device in plain text. See
  `secrets-and-api-keys`.
- **All traffic is encrypted** with TLS 1.2 or higher (prefer 1.3).
- **Least privilege.** Request only the read access the app actually needs
  (accounts, balances, transactions). Do not request more scope than needed.
- **Validate everything the provider returns.** Treat incoming data as untrusted
  input; do not build queries or trust fields blindly.
- **Fail safely.** If a connection fails, show a kind reconnect prompt and keep
  the app usable with the last known data, clearly marked as not live.

## Manual entry backup

- Let the user add accounts and transactions by hand when linking is not possible.
- Keep it simple and forgiving: minimal fields, easy editing, no nagging.
- Mark manually entered data clearly so sync logic never confuses it with synced
  data (see `local-data-and-sync`).

## Consent and privacy

- Ask for clear, informed consent before connecting an account, and make it easy
  to disconnect. See `gdpr-privacy`.
- Explain in plain words what the app will read and why.
- Pull only the data the app needs, for only as long as it needs it.

## Note for later (out of MVP scope)

Multi-currency and wider open banking only move up the plan if Europe becomes the
target market. Keep the connection code tidy enough to extend later, but do not
build beyond the sandbox for this release. Confirm scope with `mvp-scope`.

Related: `secrets-and-api-keys`, `security`, `gdpr-privacy`, `local-data-and-sync`.
