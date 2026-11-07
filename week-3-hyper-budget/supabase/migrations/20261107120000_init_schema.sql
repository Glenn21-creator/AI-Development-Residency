-- Hyper Budget: initial database schema
-- Migration 20261107120000_init_schema
--
-- Creates the core tables, turns on Row-Level Security (RLS) for every one of
-- them, and adds policies so each person can only ever touch their own rows.
-- Money is stored as whole cents (bigint), never floating point. Append-only
-- tables (transactions, allocation_events, notifications_sent) allow insert and
-- select only; history is never edited or deleted.
--
-- Apply this once, in order. Do not edit it after it has run; make later
-- changes in a new migration file.

create extension if not exists pgcrypto;

-- Reusable trigger to keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- profiles: one row per person, holding settings. Keyed to the Supabase Auth user.
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  currency text not null default 'EUR',
  hide_balances_default boolean not null default false,
  notification_prefs jsonb not null default '{}'::jsonb,
  quiet_hours_start time,
  quiet_hours_end time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
create policy profiles_select_own on public.profiles for select using (id = auth.uid());
create policy profiles_insert_own on public.profiles for insert with check (id = auth.uid());
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_delete_own on public.profiles for delete using (id = auth.uid());
grant select, insert, update, delete on public.profiles to authenticated;

-- ----------------------------------------------------------------------------
-- consents: what the person agreed to and when (GDPR). Provable and withdrawable.
-- ----------------------------------------------------------------------------
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  consent_type text not null,
  granted boolean not null,
  granted_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  details text
);
create index consents_user_id_idx on public.consents (user_id);

alter table public.consents enable row level security;
create policy consents_select_own on public.consents for select using (user_id = auth.uid());
create policy consents_insert_own on public.consents for insert with check (user_id = auth.uid());
create policy consents_update_own on public.consents for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy consents_delete_own on public.consents for delete using (user_id = auth.uid());
grant select, insert, update, delete on public.consents to authenticated;

-- ----------------------------------------------------------------------------
-- bank_connections: one row per linked bank. The access token is NOT stored
-- here; vault_secret_id references the token held in Supabase Vault.
-- ----------------------------------------------------------------------------
create table public.bank_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null,
  status text not null default 'healthy',
  is_sandbox boolean not null default true,
  vault_secret_id uuid,
  consent_id uuid references public.consents (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bank_connections_user_id_idx on public.bank_connections (user_id);
create trigger bank_connections_set_updated_at before update on public.bank_connections
  for each row execute function public.set_updated_at();

alter table public.bank_connections enable row level security;
create policy bank_connections_select_own on public.bank_connections for select using (user_id = auth.uid());
create policy bank_connections_insert_own on public.bank_connections for insert with check (user_id = auth.uid());
create policy bank_connections_update_own on public.bank_connections for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy bank_connections_delete_own on public.bank_connections for delete using (user_id = auth.uid());
grant select, insert, update, delete on public.bank_connections to authenticated;

-- ----------------------------------------------------------------------------
-- accounts: accounts pulled from a connection (or entered by hand).
-- ----------------------------------------------------------------------------
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  connection_id uuid references public.bank_connections (id) on delete cascade,
  name text not null,
  type text,
  balance_cents bigint not null default 0,
  currency text not null default 'EUR',
  is_manual boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index accounts_user_id_idx on public.accounts (user_id);
create trigger accounts_set_updated_at before update on public.accounts
  for each row execute function public.set_updated_at();

alter table public.accounts enable row level security;
create policy accounts_select_own on public.accounts for select using (user_id = auth.uid());
create policy accounts_insert_own on public.accounts for insert with check (user_id = auth.uid());
create policy accounts_update_own on public.accounts for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy accounts_delete_own on public.accounts for delete using (user_id = auth.uid());
grant select, insert, update, delete on public.accounts to authenticated;

-- ----------------------------------------------------------------------------
-- transactions: the append-only ledger. Signed amount_cents (positive = money
-- in, negative = money out). Deduped per account via provider_txn_id.
-- Append-only: insert and select only.
-- ----------------------------------------------------------------------------
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid references public.accounts (id) on delete cascade,
  provider_txn_id text,
  amount_cents bigint not null,
  currency text not null default 'EUR',
  description text,
  category text,
  occurred_at timestamptz not null,
  status text not null default 'settled',
  source text not null default 'synced',
  created_at timestamptz not null default now()
);
create index transactions_user_occurred_idx on public.transactions (user_id, occurred_at desc);
create unique index transactions_dedupe_idx on public.transactions (account_id, provider_txn_id)
  where provider_txn_id is not null;

alter table public.transactions enable row level security;
create policy transactions_select_own on public.transactions for select using (user_id = auth.uid());
create policy transactions_insert_own on public.transactions for insert with check (user_id = auth.uid());
grant select, insert on public.transactions to authenticated;

-- ----------------------------------------------------------------------------
-- buckets: the jar definitions and rules (not stored balances). Balances are
-- computed on read from transactions and allocation_events.
-- ----------------------------------------------------------------------------
create table public.buckets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  name text not null,
  target_cents bigint,
  drip_cents bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index buckets_user_id_idx on public.buckets (user_id);
create trigger buckets_set_updated_at before update on public.buckets
  for each row execute function public.set_updated_at();

alter table public.buckets enable row level security;
create policy buckets_select_own on public.buckets for select using (user_id = auth.uid());
create policy buckets_insert_own on public.buckets for insert with check (user_id = auth.uid());
create policy buckets_update_own on public.buckets for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy buckets_delete_own on public.buckets for delete using (user_id = auth.uid());
grant select, insert, update, delete on public.buckets to authenticated;

-- ----------------------------------------------------------------------------
-- allocation_events: append-only record of how each deposit was split, with the
-- rule in force at the time. Append-only: insert and select only.
-- ----------------------------------------------------------------------------
create table public.allocation_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  transaction_id uuid references public.transactions (id) on delete cascade,
  bucket_id uuid references public.buckets (id) on delete set null,
  amount_cents bigint not null,
  rule_snapshot jsonb,
  created_at timestamptz not null default now()
);
create index allocation_events_user_id_idx on public.allocation_events (user_id);
create index allocation_events_txn_idx on public.allocation_events (transaction_id);

alter table public.allocation_events enable row level security;
create policy allocation_events_select_own on public.allocation_events for select using (user_id = auth.uid());
create policy allocation_events_insert_own on public.allocation_events for insert with check (user_id = auth.uid());
grant select, insert on public.allocation_events to authenticated;

-- ----------------------------------------------------------------------------
-- bills: upcoming bills. Covered-or-not is computed, not stored.
-- ----------------------------------------------------------------------------
create table public.bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  amount_cents bigint not null,
  currency text not null default 'EUR',
  due_date date not null,
  recurrence text not null default 'none',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bills_user_id_idx on public.bills (user_id);
create trigger bills_set_updated_at before update on public.bills
  for each row execute function public.set_updated_at();

alter table public.bills enable row level security;
create policy bills_select_own on public.bills for select using (user_id = auth.uid());
create policy bills_insert_own on public.bills for insert with check (user_id = auth.uid());
create policy bills_update_own on public.bills for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy bills_delete_own on public.bills for delete using (user_id = auth.uid());
grant select, insert, update, delete on public.bills to authenticated;

-- ----------------------------------------------------------------------------
-- savings_goals: the cushion goal (MVP uses one per person). Progress computed.
-- ----------------------------------------------------------------------------
create table public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text,
  target_cents bigint not null,
  drip_cents bigint not null default 0,
  currency text not null default 'EUR',
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index savings_goals_user_id_idx on public.savings_goals (user_id);
create trigger savings_goals_set_updated_at before update on public.savings_goals
  for each row execute function public.set_updated_at();

alter table public.savings_goals enable row level security;
create policy savings_goals_select_own on public.savings_goals for select using (user_id = auth.uid());
create policy savings_goals_insert_own on public.savings_goals for insert with check (user_id = auth.uid());
create policy savings_goals_update_own on public.savings_goals for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy savings_goals_delete_own on public.savings_goals for delete using (user_id = auth.uid());
grant select, insert, update, delete on public.savings_goals to authenticated;

-- ----------------------------------------------------------------------------
-- push_subscriptions: one row per person per device, for web push.
-- ----------------------------------------------------------------------------
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);
create index push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;
create policy push_subscriptions_select_own on public.push_subscriptions for select using (user_id = auth.uid());
create policy push_subscriptions_insert_own on public.push_subscriptions for insert with check (user_id = auth.uid());
create policy push_subscriptions_delete_own on public.push_subscriptions for delete using (user_id = auth.uid());
grant select, insert, delete on public.push_subscriptions to authenticated;

-- ----------------------------------------------------------------------------
-- notifications_sent: append-only log so the same nudge never nags twice.
-- Append-only: insert and select only.
-- ----------------------------------------------------------------------------
create table public.notifications_sent (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  notification_type text not null,
  reference text,
  sent_at timestamptz not null default now()
);
create index notifications_sent_user_id_idx on public.notifications_sent (user_id);

alter table public.notifications_sent enable row level security;
create policy notifications_sent_select_own on public.notifications_sent for select using (user_id = auth.uid());
create policy notifications_sent_insert_own on public.notifications_sent for insert with check (user_id = auth.uid());
grant select, insert on public.notifications_sent to authenticated;
