import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

// Integration tests for the REAL apply_spending function, the overspend cascade.
// Given a cycle's funded buckets and its total spending, it drains the spend in
// reverse priority (FUN MONEY first, then savings, then bills, then food & rent) and
// reports what is left plus any amount_overspent.
//
// Note (2026-11-14 change): fun money is now ONE number. The function still takes the
// fun floor as a separate input, but it drains the floor and the discretionary part
// together as one pot and returns a single safe_to_spend_left (= floor-left +
// discretionary-left). There is no separate fun_floor_left column any more.
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
    // The fun floor is still passed in, but there is no fun_floor_left in the result:
    // safe_to_spend_left already includes it.
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
        savingsLeft: Number(r.savings_left),
        safeToSpendLeft: Number(r.safe_to_spend_left), // fun floor + discretionary, combined
        amountOverspent: Number(r.amount_overspent),
      };
    }

    // WORKED EXAMPLE (written together).
    // Cycle funded: food & rent 800, bills 200, fun floor 100, savings 100,
    // safe-to-spend 300. Fun money is therefore 400 (floor 100 + discretionary 300).
    // The person spends 250, which is WITHIN fun money. So only fun money shrinks
    // (400 - 250 = 150); everything else is untouched, and nothing is overspent.
    test("a spend within fun money only shrinks fun money", async () => {
      const a = await callApplySpending(80000, 20000, 10000, 10000, 30000, 25000);
      assert.equal(a.safeToSpendLeft, 15000); // 400 - 250 = 150
      assert.equal(a.amountOverspent, 0);
      assert.equal(a.essentialsLeft, 80000); // food & rent untouched
      assert.equal(a.savingsLeft, 10000); // savings untouched
    });

    // YOUR TURN: your tests go below here.
  },
);
