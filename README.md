# Doctor Tracker – Frontend

## Live Demo

- **Frontend:** https://kaushik-doctor-tracker.vercel.app
- **Backend:** https://doctor-tracker-backend-ws6t.onrender.com

## Description

Doctor Tracker is a secure admin portal for hospitals and clinics to manage doctors and their patients in one place. Authenticated admins can create and edit doctors, add or remove patients under a specific doctor, search, filter and paginate large lists, and watch live analytics (totals, patients per doctor, registrations over time, condition and specialization breakdowns) on a clean, responsive dashboard. This repository is the **Next.js client**; it talks to the standalone Express + MongoDB API (`doctor-tracker-backend`) over REST.

**Features:** JWT login with silent token refresh · dashboard charts · doctors CRUD · patients CRUD · doctor → patients view · debounced search, filters (specialization, hospital, condition, gender, doctor, date range), sorting, server-side pagination · admin profile and password update · responsive layout with mobile drawer navigation.

## Setup Guide

**Requirements:** Node.js 18+, and the backend API running (see `doctor-tracker-backend/README.md`).

1. Start the backend first (default `http://localhost:5000`) and run its seed script so the demo admin exists.
2. Install dependencies
   ```bash
   cd doctor-tracker-frontend
   npm install
   ```
3. Create your environment file from the template (`.env.example` is included)
   ```bash
   cp .env.example .env.local
   ```
   | Variable | Purpose |
   |---|---|
   | `BACKEND_URL` | Express API URL used by the Next.js `/api/*` proxy |
   | `NEXT_PUBLIC_DEMO_LOGIN` | `true` shows the "Use demo credentials" button on the login page |
   | `NEXT_PUBLIC_DEMO_EMAIL` / `NEXT_PUBLIC_DEMO_PASSWORD` | credentials the demo button fills in (`admin@gmail.com` / `Admin@123456`) |

   > `NEXT_PUBLIC_*` values are bundled into the browser, so use throwaway demo credentials only and set `NEXT_PUBLIC_DEMO_LOGIN=false` for real production use.
4. Run
   ```bash
   npm run dev           
   # production
   npm run build && npm start
   ```
5. Open http://localhost:3000, click **Use demo credentials**, then **Sign in**.

## System Architecture

```
┌────────────┐   /api/*    ┌──────────────────┐  rewrite   ┌───────────────┐   Mongoose   ┌─────────┐
│  Browser   │────────────▶│ Next.js (client) │───────────▶│ Express API   │─────────────▶│ MongoDB │
│ React UI   │◀────────────│ UI + proxy       │◀───────────│ JWT, REST     │◀─────────────│         │
└────────────┘ httpOnly    └──────────────────┘            └───────────────┘              └─────────┘
               cookies

```

## Technical Decisions

### 1. Next.js Proxy & Secure Authentication
- Next.js rewrites `/api/*` requests to the Express API.
- JWT access and refresh tokens are stored in httpOnly cookies instead of localStorage.
- Axios automatically refreshes expired access tokens and retries failed requests.
- Next.js middleware uses a session cookie for page-level redirects.
- Actual authentication and authorization are enforced by the Express API.

### 2. TanStack Query for Server State
- TanStack Query handles API data, caching, loading and error states.
- Automatic request de duplication and cache invalidation after mutations.
- `keepPreviousData` provides smooth pagination.
- AuthContext manages global authentication state.
- Custom `useListState` hook manages filters and pagination.
- Search is debounced by 400ms, and filter changes reset pagination to page 1.

## Visual Evidence

Screenshots were generated with sample data (14 doctors, 220 patients).

### Desktop (1440 px)

| Login (demo credentials + password eye) | Dashboard |
|---|---|
| ![Login](docs/screenshots/desktop-01-login.png) | ![Dashboard](docs/screenshots/desktop-02-dashboard.png) |

| Doctors | Doctor detail + patients |
|---|---|
| ![Doctors](docs/screenshots/desktop-03-doctors.png) | ![Doctor detail](docs/screenshots/desktop-04-doctor-detail.png) |

| Patients | My profile |
|---|---|
| ![Patients](docs/screenshots/desktop-05-patients.png) | ![Profile](docs/screenshots/desktop-06-profile.png) |

### Mobile (390 px)

| Login | Dashboard | Doctors | Doctor detail |
|---|---|---|---|
| <img src="docs/screenshots/mobile-01-login.png" width="190"> | <img src="docs/screenshots/mobile-02-dashboard.png" width="190"> | <img src="docs/screenshots/mobile-03-doctors.png" width="190"> | <img src="docs/screenshots/mobile-04-doctor-detail.png" width="190"> |

| Patients | Profile | Navigation drawer |
|---|---|---|
| <img src="docs/screenshots/mobile-05-patients.png" width="190"> | <img src="docs/screenshots/mobile-06-profile.png" width="190"> | <img src="docs/screenshots/mobile-07-menu.png" width="190"> |
