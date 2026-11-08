# Architecture Decision Records

Each file records one big decision: the context, the decision, the alternatives
considered, and the consequences. Read these before making changes to the app, so
past decisions are respected rather than quietly undone.

- [0001](0001-nextjs-with-material-ui.md) Next.js with Material UI for the screens
- [0002](0002-vercel-for-hosting.md) Vercel for hosting
- [0003](0003-supabase-for-database-and-auth.md) Supabase for database and auth
- [0004](0004-money-logic-in-supabase.md) Money logic runs in Supabase (SQL)
- [0005](0005-safe-to-spend-computed-on-read.md) Safe-to-spend computed on read over an append-only ledger
- [0006](0006-append-only-allocation.md) Allocation recorded as append-only events
- [0007](0007-row-level-security-privacy-wall.md) Row-Level Security as the privacy wall
- [0008](0008-open-banking-sandbox.md) Open-banking sandbox for bank data
- [0009](0009-alerts-in-app-plus-push.md) Alerts as in-app plus push in the MVP
- [0010](0010-cycle-based-allocation-and-spend-waterfall.md) Cycle-based allocation and the spend waterfall
- [0011](0011-savings-cushion-cycle-locking.md) Savings cushion as append-only cycle locking
