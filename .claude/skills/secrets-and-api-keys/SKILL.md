---
name: secrets-and-api-keys
description: Use this skill whenever you handle API keys, tokens, bank connection tokens, passwords, or any secret in Hyper Budget. It covers never putting keys in the code, keeping secrets out of git, and safely storing and using tokens and bank connections. Follow it any time a credential or secret is created, stored, read, or passed around.
---

# Hyper Budget: Secrets and API keys

A secret is anything that would let someone in if they had it: API keys, bank
connection tokens, passwords, session tokens, and signing keys. Hyper Budget
connects to bank data, so handling secrets correctly is essential, even with
sandbox data, because we are building the real habits.

The one rule to remember: **a secret never belongs in the code or in git.**

## Never put secrets in the code

- Do not hard-code API keys, tokens, passwords, or connection strings in source
  files.
- Do not commit secrets to git, not even once, not even in a config file or a
  comment. Git keeps history, so a committed secret is exposed even after it is
  removed. If one is ever committed, treat it as leaked: rotate it immediately.
- Keep a `.gitignore` that excludes env files and any local secret files, and add
  it before writing any secret locally.
- Provide a committed example file (for example `.env.example`) with blank or
  placeholder values, so others know what is needed without seeing real values.

## Where secrets go instead

- **Local development:** environment variables or a local env file that is
  git-ignored.
- **Server / production:** a proper secrets manager, vault, or the platform's key
  management service. Not a file in the repo.
- **On the device:** the platform's secure storage (Keychain on iOS, Keystore on
  Android). Encrypt anything sensitive at rest. See `device-security` and
  `local-data-and-sync`.

## Bank connection tokens

- The provider's hosted flow handles the bank login, so we never see or store the
  user's bank credentials (see `open-banking-sandbox`).
- The access token the provider returns is a secret. Store it **server-side** in
  the secrets store, encrypted, tied to the user.
- Do not send the token to the client or keep it in client code.
- Request least privilege: only the read scopes the app needs.
- Support rotating and revoking tokens, and revoke on disconnect or logout.

## Passwords and session tokens

- Never store passwords in plain text or with a fast hash. Use Argon2id
  (preferred), bcrypt, or scrypt, each with a unique salt. See `security`.
- Generate session tokens as strong random values. Set cookies `HttpOnly`,
  `Secure`, and `SameSite` where cookies are used.
- Expire sessions sensibly and invalidate them on logout and password change.

## Keep secrets out of everywhere they leak

Secrets commonly leak through places that are easy to forget:

- **Logs:** never log a key, token, password, or full bank detail. Mask or omit
  them.
- **URLs and query strings:** never put a secret or personal data in a URL.
- **Error messages and crash reports:** keep secrets out of anything shown to a
  user or sent to a monitoring service.
- **Client-side code:** anything in the app bundle can be read. Keep secrets on
  the server.

## Good habits

- Use different keys for sandbox and any other environment, and never reuse a
  production-style key in a demo.
- Scan the repo for accidentally committed secrets before pushing.
- Rotate keys periodically and whenever someone who had access leaves or a leak is
  suspected.
- Give each service the least access it needs, no more.

## Quick pre-delivery check

- No key, token, password, or secret is in the source code or git history.
- A `.gitignore` excludes env and secret files, and an example file documents what
  is needed.
- Bank tokens are stored server-side, encrypted, never on the client.
- No secret appears in logs, URLs, or error messages.
- Passwords are hashed with Argon2id, bcrypt, or scrypt; sessions are secure.

Related: `security`, `open-banking-sandbox`, `device-security`,
`local-data-and-sync`, `gdpr-privacy`.
