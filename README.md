# The Overflo' Trust

The Overflo' Trust is a civic food-redistribution platform where establishments ("Stewards") can publish surplus meal donations, build public credibility through measurable outcomes, and improve discovery through a transparent **Republic Score** system.

---

## Table of Contents

- [What This Project Does](#what-this-project-does)
- [Core Features](#core-features)
- [Application Pages](#application-pages)
- [Architecture and Tech Stack](#architecture-and-tech-stack)
- [Republic Score and Ranking Logic](#republic-score-and-ranking-logic)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database, Migrations, and Seeding](#database-migrations-and-seeding)
- [Available Scripts](#available-scripts)
- [Typical User Flows](#typical-user-flows)
- [Known Notes](#known-notes)

---

## What This Project Does

The platform is designed to:

- Help stewards publish and track surplus meal donations.
- Surface reliable contributors using measurable service data.
- Give community users a feed (pun intended) and profile pages for discovery and trust.
- Encourage quality and consistency with transparent score mechanics.
- Balance visibility for top performers and rising stewards.

---

## Core Features

### 1) Role-Based Accounts

- **Steward** users can manage profile data and log donation entries.
- **Consumer** users can browse stewards, rate profiles, and post comments.
- Authenticated sessions are stored with secure, HTTP-only cookies.

### 2) Steward Command Deck

Stewards get a dashboard to:

- View key metrics (Republic Score, profile views, meals donated, consistency).
- Update public profile settings.
- Log new donation entries with:
  - title and description
  - meal quantity
  - pickup window
  - freshness level (`PRIME`, `FRESH`, `STANDARD`)
  - pickup success status
  - response time
  - optional proof and image links
- Review recent donation records.

### 3) Discovery Feed

- Shows steward cards with category, story snippet, city, and Republic Score.
- Feed ordering combines score weighting with rotation/randomness to avoid static exposure.
- Includes a "Live Pulse" spotlight for rotating discovery highlights.

### 4) Provider (Steward) Profile Pages

Each steward profile shows:

- rank and performance summary
- donation history
- community ratings and comments
- metrics
- forms for posting ratings/comments 

### 5) Leaderboard

- Ranked by Republic Score (with tie support via total meals donated sorting).
- Filter
- Presents rank, score, meals, average rating, streak, location, and profile link.

### 6) "I'm Feeling Lucky" Discovery

- Randomized-but-weighted jump to a steward profile.
- Designed to surface "hidden gems" and rising contributors.
- Tracks lucky exposure stats (appearances, clicks, popularity gain, rating growth).

### 7) About / Narrative Pages

- Explains the civic model and score philosophy.
- Includes visual, animated sections for user education and onboarding context.

---

## Application Pages

- `/` - Home: mission, key metrics, spotlight, and "how it works" explainer.
- `/about` - Platform rationale and process narrative.
- `/feed` - Discover stewards (Pun Intended).
- `/leaderboard` - Ranked steward performance board with filters.
- `/lucky` - Weighted random steward discovery.
- `/providers/[slug]` - Individual steward public profile.
- `/signup` - Account creation.
- `/login` - User login.
- `/dashboard` - Steward-only command deck.

---

## Architecture and Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** React + Tailwind CSS
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** Cookie-based session model using JWT token envelope + session table
- **Validation:** Zod

---

## Data Model Overview

---

## Republic Score and Ranking Logic

Republic Score is computed from weighted components in `src/lib/score.ts`:

- meal volume component
- consistency contribution cadence
- freshness quality
- response-time performance
- pickup reliability (success ratio)
- average rating

Badges are mapped from score thresholds:

- `Civic Vanguard`
- `Trusted Steward`
- `Reliable Partner`
- `Rising Contributor`

Leaderboard rows are ordered primarily by `republicScore`, then by `totalMealsDonated`.

---

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm
- PostgreSQL instance

### Local Setup

1. Clone and enter the project:

```bash
git clone <your-repo-url>
cd decagon/the-overflo-trust
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment:

```bash
cp .env.example .env
```

4. Update `.env` with your local credentials.

5. Run migrations:

```bash
npm run prisma:migrate
```

6. Seed sample data:

```bash
npm run prisma:seed
```

7. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

From `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/overflo_trust?schema=public"
AUTH_SECRET="replace-with-secret"
```

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `AUTH_SECRET`: used to sign and verify session JWTs.

---

## Database, Migrations, and Seeding

### Migrations

- Create/apply local migration: `npm run prisma:migrate`
- Deploy migrations (CI/prod): `npm run prisma:migrate:deploy`

### Seed Data

`prisma/seed.ts` generates:

- 16 steward accounts and profiles
- consumer accounts
- donation history
- ratings and comments
- lucky exposure metrics
- computed scores + badges

Default seeded credentials include:

- Steward: `steward1@overflo.trust` / `password123`
- Consumer: `consumer1@overflo.trust` / `password123`

---

## Available Scripts

- `npm run dev` - start local Next.js dev server
- `npm run build` - generate Prisma client and build app
- `npm run start` - run production build
- `npm run lint` - run ESLint
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run Prisma migrate dev
- `npm run prisma:migrate:deploy` - run deploy migrations
- `npm run prisma:seed` - seed database

---

## Typical User Flows

### Steward Flow

1. Sign up as `STEWARD`.
2. Land on Command Deck.
3. Complete public profile fields.
4. Log donation entries consistently.
5. Improve Republic Score over time and climb leaderboard.

### Consumer Flow

1. Browse `/feed` (pun intended) and `/leaderboard`.
2. Open steward profile.
3. Post ratings/comments.
4. Use `/lucky` to discover rising operators.

---

## Known Notes

- Fully responive design.
- Middleware protects private routes by cookie presence, while server code validates sessions and roles.
- Feed ordering intentionally includes randomization to prevent rigid ranking lock-in.

---

Built with Next.js, Prisma, and a civic-trust-first product model for equitable food redistribution.
