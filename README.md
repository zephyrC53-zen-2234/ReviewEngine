# ReviewEngine

A work-in-progress application for discovering, comparing, rating, and reviewing competing apps and websites.

## Current status

Automated verification passed on October 2, 2026: nine unit tests, TypeScript checks, Prisma generation, both PostgreSQL migrations, development seeding, the production Webpack build, and the HTTP/database integration suite. The seeded catalog contains 17 categories, 57 products, and 40 clearly labeled sample reviewers.

Next.js 16.3.8 and scoped overrides for `deepmerge-ts` 8.0.2 and `mysql2` 3.24.5 are installed and recorded in the lockfile. The fresh npm audit reported zero vulnerabilities. Prisma generation, migrations, and the application build passed with these dependency versions.

Visual browser verification remains outstanding because no browser is connected to the development agent. Desktop/mobile layout, theme behavior, uploads, and client-side interactions should be checked before deployment. Automated results are summarized in `VERIFICATION.md`.

## Implementation included

- Next.js App Router, React, TypeScript, Tailwind CSS, Lucide icons, and Recharts.
- PostgreSQL schema with Prisma, credentials authentication through NextAuth, and role-based admin authorization.
- Discovery, category, product, search, rankings, comparison, profile, and admin pages.
- Rating and review mutations, review voting and reporting, and profile image uploads.
- Bayesian rankings, activity-based trending, and light/dark themes.
- Seed definitions covering 17 categories, with clearly labeled sample reviewers.

## Local setup

For a single-command setup and verification from your Mac’s Terminal:

```bash
cd ~/Code/reviewengine
npm run verify:local
```

The helper installs the requested dependency fixes, checks the security audit, starts the local database when necessary, applies migrations, generates Prisma, seeds development data, runs unit tests, builds, starts the app, and runs the integration test. It records output in `.verification/latest.log` and leaves successful services running for browser testing. It will not stop an existing database or overwrite an occupied application port. If it fails, the log identifies the failed step.

Use Node.js 24 LTS and npm. PostgreSQL can run through the included local database script or Docker Compose. Run these commands in your Mac’s Terminal if an agent sandbox prevents binding ports or allocating shared memory.

```bash
npm install
node scripts/setup-env.mjs
npm run db:start
```

Keep the database terminal open. In another terminal, from this project directory:

```bash
npm run db:deploy
npx prisma generate
npm run db:seed
npm run dev
```

Open http://localhost:3000. The database terminal must stay open. The two committed migrations create the relational schema and enforce rating ranges in PostgreSQL.

For future schema changes, use `npm run db:migrate -- --name describe_your_change`, inspect the generated SQL, and commit the migration. On deployments, use `npm run db:deploy` to apply committed migrations without development reset prompts.

Alternatively, run `docker compose up -d db` instead of `npm run db:start`. Both use local port 54329; do not run both simultaneously.

The environment setup script creates `.env` with a unique authentication secret. See `.env.example` for the required variables. Never commit `.env`. `SEED_DEMO=true` explicitly enables sample data creation. Sample users have random passwords and cannot be used as demo login accounts.

Create your account through `/signup`, then assign the admin role locally:

```bash
npx tsx scripts/promote-admin.ts your-email@example.com
```

## Verification and build

```bash
npm audit
npm run typecheck
npm test
npm run build
npm start
```

With the database and web app running, use another terminal for the integration test:

```bash
npm run test:integration
```

The integration script creates temporary users and a temporary catalog category, exercises public pages, registration, login, logout, rating creation/editing/deletion, uniqueness and range constraints, dynamic averages, review ownership, votes, reports, moderation, search, sorting, comparisons, profiles, and role enforcement. It cleans up its own records afterward. It deliberately refuses non-local application URLs. Repeated runs may encounter the signup rate limit; wait for its one-hour window rather than disabling production protections.

Browser checks remain necessary for desktop/mobile layouts, theme persistence, image uploads, rating form interaction, search suggestions, and the sticky comparison tray.

The build script uses Webpack because Turbopack’s local worker port is unavailable in some restricted environments. Normal `npm run dev` uses Next.js’s default development bundler.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string; generated local setup uses port 54329. |
| `NEXTAUTH_URL` | Canonical app origin; `http://localhost:3000` locally, HTTPS in production. |
| `NEXTAUTH_SECRET` | Random server-only authentication secret; generated by the setup script. |
| `SEED_DEMO` | Must explicitly equal `true` to create development sample data. |
| `TRUST_PROXY_HEADERS` | Enable only behind a trusted reverse proxy that replaces incoming `X-Forwarded-For`. |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | Optional development admin provisioning; password must have at least 12 characters. Prefer signup plus the local promotion script. |

With proxy trust disabled, unauthenticated request limits share a conservative local bucket. Login also limits attempts per email. Production deployments must configure their trusted proxy correctly. Rate-limit windows are stored in PostgreSQL, so multiple app instances share counters; schedule `npm run db:cleanup` to remove expired windows.

## Ratings, reviews, and moderation

- A database unique constraint allows only one rating and one review per user/product pair. Updating a rating updates its optional review atomically. Removing the rating also removes its associated review and votes.
- Overall scores are unmodified averages. Default rankings use `(sum + 20 × 3.5) / (count + 20)` to balance quality with sample size.
- Trending combines new ratings, reviews, week-over-week rating growth, and logarithmically weighted daily unique visits.
- Comparison selections allow two to four unique products from one category; shareable routes validate that rule on the server.
- Text is rendered through React as plain text. Admin routes and mutations check the current database role; disabling a user invalidates access on subsequent session checks.
- New reviews are visible immediately. Admins can hide or approve them. Editing a hidden review does not reapprove it.
- Product graphics initially use colored text/symbol placeholders. Admins can add official image URLs or upload PNG/JPEG/WebP assets. Failed images fall back to the placeholder.

## API

Public reads: `/api/categories`, `/api/products`, `/api/search?q=...`, `/api/rankings`, `/api/comparisons`, and `/api/reviews?productId=...&sort=...&page=...`.

Authenticated writes: `/api/ratings` (PUT), `/api/ratings/[productId]` (DELETE), `/api/reviews/[reviewId]` (DELETE), `/api/votes/[reviewId]` (POST), `/api/reports/[reviewId]` (POST), `/api/profile` (PATCH), and `/api/upload` (POST multipart). Authentication uses `/api/auth/*`; registration uses `/api/signup`.

Administrator writes: `/api/admin/categories`, `/api/admin/products`, `/api/admin/reviews/[id]`, `/api/admin/users/[id]`, and `/api/admin/reports/[id]`. Writes require the canonical origin, valid input, and the appropriate account role.

## Structure

- `app/`: pages, metadata, and HTTP API routes.
- `components/`: reusable UI and interactive forms.
- `lib/`: authentication, database access, validation, ranking, and request protection.
- `prisma/`: relational schema, seed catalog, and seeding script.
- `scripts/`: local database startup, environment setup, and administrator provisioning.
- `types/`: authentication type extensions.
- `tests/`: ranking, comparison, and input-validation tests.

Local uploads in `data/uploads/` and database files in `.postgres/` are excluded from Git. A deployed instance needs persistent image storage, production database credentials, an HTTPS application URL, and a unique authentication secret. Uploads are served through a validated application route so newly uploaded images work without restarting the server. On serverless hosting, replace filesystem storage with an object-storage provider. The included database credentials are for local development only.

Before launch, complete runtime verification, remove sample data (not just its banner), configure backups and monitoring, and add account recovery/email verification if required by your deployment. Password-reset email delivery and OAuth providers are not included in this credentials-based MVP.
