---
name: gdpr-privacy
description: Use this skill whenever Hyper Budget collects, stores, shows, shares, or deletes personal or financial data, and whenever you build consent, export, or delete features. It covers collecting only what is needed, getting consent, and letting users export or delete their data. Follow it for any data the app holds about a person, which is good practice even with sandbox data.
---

# Hyper Budget: Privacy and GDPR

Hyper Budget holds some of the most sensitive data a person has: their money.
Even though this practice project uses sandbox (fake) data, we build to real
privacy standards so the habits and the design are right. This skill is based on
the GDPR, the European data protection law, treated here as our standard.

Personal data means any information about an identifiable person. Financial data
about a person is personal data and deserves extra care.

## The principles to build by

1. **Collect only what you need (data minimisation).** Do not ask for or store
   data the app does not actually use. This is the most important rule here.
2. **Be clear and honest (transparency).** Tell the user in plain words what you
   collect and why, before you collect it.
3. **Use data only for the stated purpose (purpose limitation).** Do not reuse
   data for something the user did not agree to.
4. **Keep data correct (accuracy).** Let users fix their data.
5. **Keep data only as long as needed (storage limitation).** Delete or anonymise
   data when it is no longer needed.
6. **Protect it (security).** Encrypt it and limit who can reach it. See
   `security`, `secrets-and-api-keys`, `device-security`, `local-data-and-sync`.
7. **Be able to show you did this (accountability).** Keep it simple but
   documented.

## Consent

- Ask for clear, specific, informed consent before connecting a bank account or
  collecting personal data.
- Make consent a real choice: not pre-ticked, not buried, not forced. See the
  honest-design rule in `adhd-ux-guidelines`.
- Make withdrawing consent as easy as giving it. Disconnecting an account should
  be simple and findable.
- Record what the user consented to and when.

## Let users export their data

- Provide a way for a user to get a copy of their data in a common, readable
  format (for example JSON or CSV).
- Include the data the app holds about them: accounts, buckets, transactions,
  settings.
- Make it a plain, calm feature, not hidden away.

## Let users delete their data

- Provide a clear way to delete an account and its data (the right to be
  forgotten).
- When a user deletes, actually remove or anonymise their personal data, including
  from backups over time and from any synced copies (see `local-data-and-sync`).
- Revoke bank connection tokens on deletion (see `secrets-and-api-keys`).
- Confirm the deletion kindly and clearly. Do not make leaving harder than
  joining.

## Build privacy in by default

- Default settings are the private ones. Sharing (for example partner sharing,
  later) is off until the user turns it on.
- Do not put personal data in URLs, logs, or error messages.
- Do not send user data to any third party the user did not agree to.
- Pseudonymise or anonymise where you can, especially for anything used to
  improve the product.
- Collect analytics only if needed, only with a lawful basis, and without
  sensitive financial detail.

## If a breach ever happened

Even in a practice project, know the shape of this: be able to detect a data
breach, contain it, and understand that real products must report serious
personal-data breaches to the authority within 72 hours. Design so you could tell
what data was affected.

## Quick pre-delivery check

- The app collects only data it actually uses.
- The user is told, in plain words, what is collected and why, before it happens.
- Consent is a real, unticked choice, and easy to withdraw.
- A user can export their data in a readable format.
- A user can delete their account and data, with tokens revoked and synced copies
  removed.
- Private settings are the default; no personal data in URLs, logs, or errors.

Related: `security`, `secrets-and-api-keys`, `device-security`,
`local-data-and-sync`, `open-banking-sandbox`, `adhd-ux-guidelines`.
