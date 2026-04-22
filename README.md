# The Overflo' Trust

Food redistribution platform with civic reputation mechanics and weighted discoverability.

## Stack

- Next.js App Router + React
- TailwindCSS
- Prisma + PostgreSQL
- Role-based session auth

## Setup

1. Copy `.env.example` to `.env` and set values.
2. Run `npm install`.
3. Run `npx prisma migrate dev`.
4. Run `npm run prisma:seed`.
5. Run `npm run dev`.

## Test Accounts

- Steward: `steward1@overflo.trust` / `password123`
- Consumer: `consumer1@overflo.trust` / `password123`
