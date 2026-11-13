import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

// Integration tests for the REAL allocation function, allocate_cycle, which lives in
// your Supabase/Postgres migration. Unlike a unit test, this connects to a real
// Postgres database, loads the actual function, calls it, and checks the numbers it
// returns. That proves the function your live app runs is correct, not a copy.
//
// It only runs when DATABASE_URL is set (GitHub Actions sets it to a throwaway
// Postgres). With no DATABASE_URL, for example on a plain local machine with no
// database, the whole block is skipped, so `npm test` still passes locally.

const DATABASE_URL = process.env.DATABASE_URL;

describe(
  "allocate_cycle (the real SQL money waterfall)",
  { skip: DATABASE_URL ? false : "Set DATABASE_URL to run the database tests" },
  () => {
    let pool: pg.Pool;

    before(async () => {
      pool = new pg.Pool({ connectionString: DATABASE_URL });

      // The migration grants EXECUTE to the "authenticated" role. A throwaway test
      // database does not have that Supabase role, so create it first or the grant
      // would fail.
      await pool.query(`
        do $$
        begin
          if not exists (select from pg_roles where rolname = 'authenticated') then
            create role authenticated;
          end if;
        end
        $$;
      `);

      // Load the real function from its migration file, so the function under test is
      // exactly the one your app uses.
      const migrationPath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "../../supabase/migrations/20261108130000_allocate_cycle.sql",
      );
      await pool.query(readFileSync(migrationPath, "utf8"));
    });

    after(async () => {
      await pool?.end();
    });

    // Helper: call the real SQL function and return its result as plain numbers.
    // Postgres returns bigint columns as strings, so we convert them with Number.
    // All amounts are in whole cents (800 euro is 80000).
    async function callAllocateCycle(
      incomeCents: number,
      essentialsCents: number,
      billsCents: number,
      funFloorCents: number,
      savingsCents: number,
    ) {
      const { rows } = await pool.query(
        "select * from allocate_cycle($1, $2, $3, $4, $5)",
        [incomeCents, essentialsCents, billsCents, funFloorCents, savingsCents],
      );
      const r = rows[0];
      return {
        essentialsFunded: Number(r.essentials_funded),
        billsFunded: Number(r.bills_funded),
        funFloorFunded: Number(r.fun_floor_funded),
        savingsFunded: Number(r.savings_funded),
        safeToSpend: Number(r.safe_to_spend),
      };
    }

    // The headline "Safe to spend" number on Home folds the fun floor into the
    // leftover, because the floor is fun money, not a separate bucket.
    const safeToSpendDisplay = (a: { safeToSpend: number; funFloorFunded: number }) =>
      a.safeToSpend + a.funFloorFunded;

    // WORKED EXAMPLE (written together).
    // BDD: Given buckets food & rent 800, bills 200, savings 100, fun floor 100,
    // When income of 3000 lands,
    // Then food & rent is 800, bills 200, savings 100, and safe-to-spend shows 1900.
    test("leaves 1900 safe-to-spend on 3000 income", async () => {
      const a = await callAllocateCycle(300000, 80000, 20000, 10000, 10000);
      assert.equal(a.essentialsFunded, 80000);
      assert.equal(a.billsFunded, 20000);
      assert.equal(a.savingsFunded, 10000);
      assert.equal(safeToSpendDisplay(a), 190000);
    });

    // Written by Glenn.
    // BDD: Given buckets food & rent 800, bills 200, savings 100, fun floor 100,
    // When income of 1500 lands, Then the headline safe-to-spend shows 400.
    test("leaves 400 safe-to-spend on 1500 income", async () => {
      const a = await callAllocateCycle(150000, 80000, 20000, 10000, 10000);
      assert.equal(safeToSpendDisplay(a), 40000);
    });

    // YOUR TURN: your next tests go below here.
  },
);
