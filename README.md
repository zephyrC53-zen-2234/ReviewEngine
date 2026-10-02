# ReviewEngine

A work-in-progress application for discovering, comparing, rating, and reviewing competing apps and websites.

## Current status

This is an initial implementation checkpoint, not a verified production release. Dependencies have been installed locally, but the application build, database migrations, authentication, and end-to-end flows have not yet been verified. The installation reported five dependency vulnerabilities (four high and one critical), which still require investigation. Some dependency installation scripts also require review.

## Implementation included

- Next.js App Router, React, TypeScript, Tailwind CSS, Lucide icons, and Recharts.
- PostgreSQL schema with Prisma, credentials authentication through NextAuth, and role-based admin authorization.
- Discovery, category, product, search, rankings, comparison, profile, and admin pages.
- Rating and review mutations, review voting and reporting, and profile image uploads.
- Bayesian rankings, activity-based trending, and light/dark themes.
- Seed definitions covering 17 categories, with clearly labeled sample reviewers.

## Local setup

Use a supported modern Node.js release and npm. PostgreSQL can run through the included local database script or Docker Compose.

```bash
npm install
node scripts/setup-env.mjs
npm run db:start
```

Keep the database terminal open. In another terminal, from this project directory:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
npm run dev
```

Open http://localhost:3000. These setup steps have not yet been validated in this project.

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
npm run build
npm start
```

Automated tests and a committed initial migration remain to be added. The `test` script currently has no test files. Authentication, ownership checks, rating updates/deletions, moderation, search, comparisons, and responsive layouts still need runtime verification before deployment.

## Structure

- `app/`: pages, metadata, and HTTP API routes.
- `components/`: reusable UI and interactive forms.
- `lib/`: authentication, database access, validation, ranking, and request protection.
- `prisma/`: relational schema, seed catalog, and seeding script.
- `scripts/`: local database startup, environment setup, and administrator provisioning.
- `types/`: authentication type extensions.

Local uploads and database files are excluded from Git. A deployed instance needs persistent image storage, production database credentials, an HTTPS application URL, and a unique authentication secret. The included database credentials are for local development only.
