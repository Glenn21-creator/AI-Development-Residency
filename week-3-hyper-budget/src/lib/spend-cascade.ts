// Shared spend-cascade logic, used by the Home screen (the pre-spend heads-up and
// the confirmation), the log-spend action (to record the real source), and the
// Recent activity screen (to show it). One source of truth so all three agree.
//
// The cascade follows ADR 0010: a spend draws down the chosen bucket first, then the
// rest in fixed order, Fun money -> Savings -> Bills -> Food & rent (food & rent is
// protected the longest). This mirrors the SQL apply_spending function, so what the
// screen shows matches what the engine does. Money is whole cents.

export const CASCADE_ORDER = ["fun", "savings", "bills", "essentials"] as const;
const VALID_KEYS = ["essentials", "bills", "savings", "fun"];

export type SpendSource = { key: string; cents: number };

export function bucketDisplayName(key: string): string {
  if (key === "essentials") return "Food & rent";
  if (key === "bills") return "Bills";
  if (key === "savings") return "Savings";
  return "Fun money";
}

// Join phrases into a readable list: "Bills", "Bills and Food & rent",
// "Savings, Bills and Food & rent". De-dupes while keeping order.
export function joinNames(names: string[]): string {
  const uniq = names.filter((n, i) => names.indexOf(n) === i);
  if (uniq.length <= 1) return uniq[0] ?? "";
  return `${uniq.slice(0, -1).join(", ")} and ${uniq[uniq.length - 1]}`;
}

// Work out which buckets a spend actually draws from, in order, and how much from
// each, given how much is left in each. The chosen bucket pays first (up to what it
// holds); the overflow cascades through the rest in CASCADE_ORDER. `overspent` is any
// amount beyond every bucket (the person would be over budget this cycle).
export function resolveSpendSources(
  selected: string,
  cents: number,
  remaining: Record<string, number>,
): { sources: SpendSource[]; overspent: number } {
  const order = [selected, ...CASCADE_ORDER.filter((k) => k !== selected)];
  const sources: SpendSource[] = [];
  let left = cents;
  for (const k of order) {
    if (left <= 0) break;
    const take = Math.min(left, Math.max(0, remaining[k] ?? 0));
    if (take > 0) {
      sources.push({ key: k, cents: take });
      left -= take;
    }
  }
  return { sources, overspent: Math.max(0, left) };
}

// Store the split compactly as "key:cents" pairs, e.g. "bills:14000,essentials:16000".
export function encodeSources(sources: SpendSource[]): string {
  return sources
    .filter((s) => VALID_KEYS.includes(s.key) && s.cents > 0)
    .map((s) => `${s.key}:${Math.round(s.cents)}`)
    .join(",");
}

// Read that back into {key, cents} pairs. Ignores anything malformed. Older rows that
// stored plain keys with no amounts parse to [] here (handled by callers).
export function parseSources(value: string | null | undefined): SpendSource[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => {
      const [key, cents] = part.split(":");
      return { key: (key ?? "").trim(), cents: Math.round(Number(cents)) };
    })
    .filter(
      (s) => VALID_KEYS.includes(s.key) && Number.isFinite(s.cents) && s.cents > 0,
    );
}

// A names-only phrase from a stored value, e.g. "Bills and Food & rent". Falls back to
// the old plain-keys format for rows written before amounts were stored.
export function chargedFromLabel(value: string | null | undefined): string {
  const sources = parseSources(value);
  if (sources.length > 0) {
    return joinNames(sources.map((s) => bucketDisplayName(s.key)));
  }
  if (value) {
    const keys = value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => VALID_KEYS.includes(k));
    if (keys.length > 0) return joinNames(keys.map(bucketDisplayName));
  }
  return "";
}
