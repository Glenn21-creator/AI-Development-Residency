# Hyper Budget: Database diagram (ERD)

The tables in the `public` schema and how they relate. Every person-owned table
links back to `auth.users` (Supabase's built-in accounts table) through `user_id`,
which is how Row-Level Security keeps each person to their own rows. This renders as
a diagram on GitHub.

```mermaid
erDiagram
  auth_users ||--|| profiles : "has"
  auth_users ||--o{ consents : "gives"
  auth_users ||--o{ bank_connections : "links"
  auth_users ||--o{ accounts : "owns"
  auth_users ||--o{ transactions : "has"
  auth_users ||--o{ buckets : "sets"
  auth_users ||--o{ allocation_events : "has"
  auth_users ||--o{ bills : "has"
  auth_users ||--o{ savings_goals : "has"
  auth_users ||--o{ savings_locks : "has"
  auth_users ||--o{ push_subscriptions : "has"
  auth_users ||--o{ notifications_sent : "has"

  consents ||--o{ bank_connections : "authorises"
  bank_connections ||--o{ accounts : "provides"
  accounts ||--o{ transactions : "records"
  transactions ||--o{ allocation_events : "splits into"
  buckets ||--o{ allocation_events : "receives"

  auth_users {
    uuid id PK
    text email
  }
  profiles {
    uuid id PK "= auth.users.id"
    text display_name
    text currency
    text pay_frequency
    boolean hide_balances_default
  }
  consents {
    uuid id PK
    uuid user_id FK
    text consent_type
    boolean granted
    timestamptz withdrawn_at
  }
  bank_connections {
    uuid id PK
    uuid user_id FK
    uuid consent_id FK
    text provider
    text status
    boolean is_sandbox
    uuid vault_secret_id "token kept in Vault, not here"
  }
  accounts {
    uuid id PK
    uuid user_id FK
    uuid connection_id FK
    text name
    text type
    bigint balance_cents
    text currency
    boolean is_manual
  }
  transactions {
    uuid id PK
    uuid user_id FK
    uuid account_id FK
    text provider_txn_id "dedupe key"
    bigint amount_cents "signed: + in, - out"
    text currency
    text category "bank label"
    timestamptz occurred_at
    text source "synced or manual"
  }
  buckets {
    uuid id PK
    uuid user_id FK
    text type "essentials, bills, fun, savings"
    text name
    bigint target_cents
    bigint drip_cents
  }
  allocation_events {
    uuid id PK
    uuid user_id FK
    uuid transaction_id FK
    uuid bucket_id FK
    bigint amount_cents
    jsonb rule_snapshot "append-only"
  }
  bills {
    uuid id PK
    uuid user_id FK
    text name
    bigint amount_cents
    text currency
    date due_date
    text recurrence
  }
  savings_goals {
    uuid id PK
    uuid user_id FK
    text name
    bigint target_cents
    bigint drip_cents
    timestamptz started_at
  }
  savings_locks {
    uuid id PK
    uuid user_id FK
    date cycle_start "unique per user"
    bigint amount_cents "append-only cushion lock"
  }
  push_subscriptions {
    uuid id PK
    uuid user_id FK
    text endpoint "unique per user"
  }
  notifications_sent {
    uuid id PK
    uuid user_id FK
    text notification_type
    timestamptz sent_at "append-only"
  }
  label_buckets {
    text label PK "lowercased bank label"
    text bucket "essentials, bills, savings, fun"
  }
```

## Notes

- **`auth.users`** is managed by Supabase Auth (it lives in the `auth` schema, not
  `public`). Every person-owned table references it via `user_id`, and Row-Level
  Security uses `auth.uid()` so each person only ever sees their own rows.
- **Money** is stored as whole cents (`bigint`), never floating point.
- **Append-only tables** (`transactions`, `allocation_events`, `savings_locks`,
  `notifications_sent`) grant insert and select only, no update or delete, so history
  is never rewritten.
- **`label_buckets`** is shared reference data (bank spending label to bucket), not
  owned by any one person, so it has no `user_id`. Everyone can read it.
- Deleting a `bank_connection` cascades to its `accounts` and their `transactions`,
  which is how "disconnect bank" cleans up a person's synced data.
