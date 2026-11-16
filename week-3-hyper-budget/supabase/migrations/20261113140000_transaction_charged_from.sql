-- charged_from on transactions: the bucket(s) a logged spend actually drew from,
-- worked out from the overspend cascade at the moment it was logged (chosen bucket
-- first, then Fun money -> Savings -> Bills -> Food & rent, per ADR 0010).
--
-- Why store it: a spend can come from a different bucket than the one it was filed
-- under (for example, filed as Fun money but drawn from Food & rent because fun was
-- empty). Recording the real source keeps Recent activity honest: the log never says
-- the money came from an empty bucket. It is a comma-separated list of bucket keys
-- (essentials, bills, savings, fun), newest-first in the cascade. Null for bank-synced
-- transactions and for income, which have no app-computed source.

alter table public.transactions
  add column if not exists charged_from text;
