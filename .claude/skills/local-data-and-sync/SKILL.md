---
name: local-data-and-sync
description: Use this skill whenever you build or change how Hyper Budget stores data on the phone, works offline, or syncs with the server. It covers storing data safely on the device, keeping the app usable with no connection, and syncing without losing data or creating duplicates (including from repeated taps). Follow it for any save, read, cache, or sync code.
---

# Hyper Budget: Local data, offline, and sync

Hyper Budget has to keep working when the user disappears for weeks and when
their connection drops. That means data lives on the phone, the app works
offline, and it syncs cleanly when it reconnects, without ever losing an entry or
counting one twice. For a money app, a lost or doubled entry breaks trust, so
this is handled carefully.

## Store data safely on the phone

- Keep a local copy of the data the app needs so it works without a connection:
  buckets, balances, recent transactions, and settings.
- **Encrypt sensitive data at rest on the device.** Use the platform's secure
  storage for anything sensitive. Never store tokens or financial detail in plain
  text on the device. See `secrets-and-api-keys` and `device-security`.
- Store money as whole minor units (integer cents or pence) or a money decimal
  type, never floating-point. See `safe-to-spend-math`.
- Keep only what the app needs, for as long as it needs it. See `gdpr-privacy`.

## Work offline

- The app stays usable with no connection: the user can see balances, buckets,
  and the safe-to-spend number from the local copy.
- When data is not live, say so clearly and kindly (for example "Last updated 2
  hours ago"), so the user is never misled by a stale number.
- Queue any changes the user makes offline and apply them when the connection
  returns.

## Sync without losing data or duplicating it

This is the part most likely to cause bugs. Follow every rule.

- **Give every record a stable unique id** created on the device (for example a
  UUID). Sync by id, so the same record is matched across device and server
  instead of being added twice.
- **Make sync operations idempotent.** Sending the same change twice must have
  the same result as sending it once. This is how a dropped-and-retried sync does
  not create duplicates.
- **Queue changes with a clear order** and mark each as pending, synced, or
  failed. Retry failed ones safely.
- **Decide conflicts on purpose.** When the device and server disagree, use a
  clear rule (for example newest change wins for a user edit), and never silently
  drop a user's entry. When unsure, keep both and flag it rather than lose data.
- **Reconcile against the bank data as the source of truth** for synced
  transactions, while keeping manually entered items separate and clearly marked
  (see `open-banking-sandbox`).

## Prevent duplicates from repeated taps

ADHD users may tap a button several times. The app must never create several
entries, payments, or allocations from one intent.

- **Debounce or disable** an action button while it is processing, so a fast
  double tap does not fire twice.
- **Use an idempotency key** for any create or money action: generate one id for
  the user's intent and reject a second request with the same id.
- **Check for an existing record** before creating one, by the stable id.
- This matters for safe-to-spend too: the same charge must never reduce
  safe-to-spend twice. See `safe-to-spend-math`.

## Protect against data loss

- Confirm a write succeeded before telling the user it is saved.
- Never clear local data until the server has confirmed it has the change.
- Keep the app recoverable: if a sync fails, the user's data is still safe on the
  device and will sync later.

## Quick pre-delivery check

- The app works with the connection turned off, and says when data is not live.
- Repeated taps create exactly one entry, payment, or allocation.
- A change made offline and synced later is neither lost nor duplicated.
- Sensitive data on the device is encrypted, not plain text.
- Money is stored as integer minor units or a money type, not floating-point.

Related: `safe-to-spend-math`, `secrets-and-api-keys`, `device-security`,
`open-banking-sandbox`, `gdpr-privacy`, `testing`.
