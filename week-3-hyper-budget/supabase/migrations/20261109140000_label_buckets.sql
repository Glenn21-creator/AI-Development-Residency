-- Label-to-bucket mapping (Stage 2: attribute spending by the bank's own label).
--
-- Banks label transactions (groceries, rent, utilities, ...), and different banks
-- and languages use different words for the same thing (rent, Miete, housing). So
-- the mapping is a data-driven table, not hardcoded: many labels point to one of
-- our four buckets. Labels are stored lowercase and matched case-insensitively.
-- Anything not listed here defaults to 'fun' in the app logic, so a new or missing
-- label is always safe. Extend by adding rows as new banks are met.
--
-- This is shared reference data: every signed-in user may read it, nobody writes it
-- from the app (we seed and maintain it).

create table public.label_buckets (
  label text primary key,
  bucket text not null check (bucket in ('essentials', 'bills', 'savings', 'fun'))
);

alter table public.label_buckets enable row level security;
create policy label_buckets_read on public.label_buckets
  for select using (true);
grant select on public.label_buckets to authenticated;

-- Seed with common labels and synonyms, English and German. These are spending
-- labels; income (money in) is detected separately by a positive amount.
insert into public.label_buckets (label, bucket) values
  -- Food & rent (essentials)
  ('groceries', 'essentials'),
  ('food', 'essentials'),
  ('food and drink', 'essentials'),
  ('supermarket', 'essentials'),
  ('lebensmittel', 'essentials'),
  ('rent', 'essentials'),
  ('miete', 'essentials'),
  ('mortgage', 'essentials'),
  ('housing', 'essentials'),
  ('wohnen', 'essentials'),
  -- Bills (recurring obligations)
  ('bill_payment', 'bills'),
  ('bills', 'bills'),
  ('bills and utilities', 'bills'),
  ('utilities', 'bills'),
  ('insurance', 'bills'),
  ('versicherung', 'bills'),
  ('phone', 'bills'),
  ('mobile', 'bills'),
  ('internet', 'bills'),
  ('energy', 'bills'),
  ('strom', 'bills'),
  ('gas', 'bills'),
  ('subscription', 'bills'),
  ('abo', 'bills'),
  -- Savings (money moved into a cushion)
  ('savings', 'savings'),
  ('sparen', 'savings');
  -- Everything else (purchase, shopping, dining, entertainment, cash, ...) is
  -- treated as fun by default in the logic, so it is intentionally not listed.
