import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

// Integration tests for the REAL apply_spending function, the overspend cascade.
// Given a cycle's funded buckets and its total spending, it drains the spend in
// reverse priority (safe-to-spend, then fun floor, then savings, then bills, then
// food & rent) and reports what is left plus any amount_overspent.
//
// Runs only when DATABASE_URL is set (GitHub Actions provides a throwaway Postgres);
// otherwise the whole block is skipped so local `npm test` still passes.

const DATABASE_URL = process.env.DATABASE_URL;

describe(
  "apply_spending (the real overspend cascade)",
  { skip: DATABASE_URL ? false : "Set DATABASE_URL to run the database tests" },
  () => {
    let pool: pg.Pool;

    before(async () => {
      pool = new pg.Pool({ connectionString: DATABASE_URL });

      // The migration grants EXECUTE to the "authenticated" role, which a throwaway
      // database does not have, so create it first.
      await pool.query(`
        do $$
        begin
          if not exists (select from pg_roles where rolname = 'authenticated') then
            create role authenticated;
          end if;
        end
        $$;
      `);

      // Load the real function from its migration file.
      const migrationPath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "../../supabase/migrations/20261109130000_apply_spending.sql",
      );
      await pool.query(readFileSync(migrationPath, "utf8"));
    });

    after(async () => {
      await pool?.end();
    });

    // Helper: call the real function and return its result as plain numbers.
    // Inputs are the five funded bucket amounts plus the total spend, all in cents.
    async function callApplySpending(
      essentialsCents: number,
      billsCents: number,
      funFloorCents: number,
      savingsCents: number,
      safeToSpendCents: number,
      spendCents: number,
    ) {
      const { rows } = await pool.query(
        "select * from apply_spending($1, $2, $3, $4, $5, $6)",
        [essentialsCents, billsCents, funFloorCents, savingsCents, safeToSpendCents, spendCents],
      );
      const r = rows[0];
      return {
        essentialsLeft: Number(r.essentials_left),
        billsLeft: Number(r.bills_left),
        funFloorLeft: Number(r.fun_floor_left),
        savingsLeft: Number(r.savings_left),
        safeToSpendLeft: Number(r.safe_to_spend_left),
        amountOverspent: Number(r.amount_overspent),
      };
    }

    // WORKED EXAMPLE (written together).
    // Cycle funded: food & rent 800, bills 200, fun floor 100, savings 100,
    // safe-to-spend 300. The person spends 250, which is WITHIN safe-to-spend.
    // So only safe-to-spend shrinks (300 - 250 = 50); everything else is untouched,
    // and nothing is overspent.
    test("a spend within safe-to-spend only touches safe-to-spend", async () => {
      const a = await callApplySpending(80000, 20000, 10000, 10000, 30000, 25000);
      assert.equal(a.safeToSpendLeft, 5000); // 300 - 250 = 50
      assert.equal(a.amountOverspent, 0);
      assert.equal(a.essentialsLeft, 80000); // food & rent untouched
      assert.equal(a.savingsLeft, 10000); // savings untouched
    });

    // YOUR TURN: your tests go below here.
  },
);
