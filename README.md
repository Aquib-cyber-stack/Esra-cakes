# Esra Cakes — Full-Stack Website & Admin Dashboard

A premium, production-ready website for a custom cake business: a React/TypeScript storefront (home, gallery,
custom order form, about, contact) plus a protected admin dashboard (orders, cakes, reviews, messages), backed
by an Express + Prisma + PostgreSQL REST API.

```
React (Vite + TS + Tailwind)
        │  REST (axios, cookie-based auth)
        ▼
Express API (Node.js + TypeScript)
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL
```

## 1. Project structure

```
esra-cakes/
├── backend/                 Express + Prisma REST API
│   ├── prisma/
│   │   ├── schema.prisma    Data models
│   │   └── seed.ts          Seeds an admin account, sample cakes & reviews
│   ├── src/
│   │   ├── controllers/     Route handlers
│   │   ├── routes/          Express routers
│   │   ├── middleware/      auth, upload, validation, error handling
│   │   ├── lib/              prisma client, jwt, reference-number generator
│   │   ├── utils/schemas.ts Zod validation schemas (shared shape for all forms)
│   │   ├── app.ts           Express app assembly
│   │   └── index.ts         Server entrypoint
│   ├── uploads/             Uploaded images (served at /uploads)
│   └── .env.example
└── frontend/                 React + Vite + TypeScript + Tailwind
    ├── src/
    │   ├── components/       Navbar, Footer, CakeCard, CakeGrid, FilterBar, ReviewCard,
    │   │                      ImageUploader, AdminSidebar, StatCard, OrderTable, StatusBadge…
    │   ├── pages/             Home, Gallery, CakeDetails, Order, About, Contact, NotFound
    │   ├── pages/admin/       AdminLogin, Dashboard, AdminOrders, AdminOrderDetail,
    │   │                      AdminCakes, AdminReviews, AdminMessages
    │   ├── context/           AuthContext, SiteConfigContext (drives the WhatsApp number)
    │   ├── lib/                api client, currency/date formatting helpers
    │   └── types/             Shared TypeScript types
    └── .env.example
```

## 2. Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ running locally, or a hosted instance (Supabase, Railway, Neon, etc.)

## 3. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env — set DATABASE_URL, JWT_SECRET, WHATSAPP_NUMBER, and the seed admin credentials
npm install
npx prisma migrate dev --name init   # creates tables from prisma/schema.prisma
npm run seed                         # creates the admin account + sample cakes & reviews
npm run dev                          # starts the API at http://localhost:4000
```

Key `.env` variables (see `backend/.env.example` for the full list):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Signs admin session tokens — use a long random string |
| `CLIENT_ORIGIN` | Frontend origin allowed by CORS |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credentials created by `npm run seed` |
| `WHATSAPP_NUMBER` | Business WhatsApp number (digits only, country code first) — read by the frontend via `/api/config` so it's never hard-coded in the UI |
| `UPLOAD_DIR` / `MAX_UPLOAD_MB` | Where cake/order images are stored and the per-file size limit |

## 4. Frontend setup

```bash
cd frontend
cp .env.example .env
# VITE_API_URL defaults to http://localhost:4000/api
npm install
npm run dev     # starts the site at http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to the backend, so the two can be developed together without
CORS friction.

## 5. Logging in as admin

Visit `http://localhost:5173/admin/login` and sign in with the `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set
in `backend/.env` before seeding. **Change this password** (or create a new admin and remove the seed one) before
deploying anywhere public — `prisma studio` (`npm run prisma:studio` in `backend/`) is the quickest way to manage
admin accounts directly.

## 6. Database migrations & seeding, day to day

```bash
# after changing prisma/schema.prisma
npx prisma migrate dev --name <describe-the-change>

# re-seed (safe to re-run — cakes/admin are upserted by unique fields; reviews append)
npm run seed

# inspect data visually
npm run prisma:studio
```

For production deploys, use `npm run prisma:deploy` (`prisma migrate deploy`) instead of `migrate dev`.

## 7. Building for production

```bash
# backend
cd backend && npm run build && npm start

# frontend
cd frontend && npm run build && npm run preview   # or serve dist/ with any static host
```

Point `VITE_API_URL` (frontend) and `CLIENT_ORIGIN` (backend) at your real domains before deploying, and put the
Express server behind HTTPS (a reverse proxy like Nginx or a platform such as Render/Railway/Fly.io works well)
since the admin auth cookie is marked `secure` in production.

## 8. What's implemented

**Public site** — Home (hero, process, flavours, occasions, reviews, CTA — visually ported from the original
design), Gallery with category filters + search backed by the database, cake detail pages, a full custom-order
form with image upload and a confirmation screen showing a generated request ID, About, and Contact (with a
database-backed message form, WhatsApp/email/hours, and an embedded map).

**Admin dashboard** (`/admin/*`, JWT + httpOnly cookie protected) — stats overview with recent/upcoming orders,
order management with status flow (`Pending → Reviewing → Quote Sent → Confirmed → Baking → Ready → Completed`),
quotes and internal notes, cake CRUD with multi-image upload, review moderation (approve/reject/feature/delete),
and contact message triage.

**UX details** — loading skeletons, empty/error states, toast notifications, client- and server-side form
validation (Zod), image previews before upload, confirmation dialogs for destructive actions, a 404 page, and a
configurable WhatsApp number used throughout (including a pre-filled message containing the order reference).

## 9. Notes on the WhatsApp number

The number lives in `backend/.env` (`WHATSAPP_NUMBER`) and is served publicly (non-sensitive) via `GET /api/config`.
The frontend reads it through `SiteConfigContext` — nothing in the UI hard-codes it, so updating the `.env` value
and restarting the API is enough to change it everywhere.
