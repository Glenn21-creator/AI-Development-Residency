-- Pay frequency (Stage 1 of the allocation engine).
--
-- Each person's budget runs in cycles the length of their pay frequency. A weekly
-- earner's buckets and savings reset weekly; a monthly earner's reset monthly.
-- The default is monthly. The check keeps the value to the two we support.
--
-- The fun floor needs no column: it is just another bucket row (type 'fun') in the
-- existing buckets table, so only this one setting is new.

alter table public.profiles
  add column pay_frequency text not null default 'monthly'
  check (pay_frequency in ('weekly', 'monthly'));
