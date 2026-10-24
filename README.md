# CarCycle — Frontend

A CarCycle inventory app: the main page lists every car on the lot, and each car has a CarCycle
page — reachable by scanning a printed QR code — showing its current data plus a full change
history log (what changed, old → new value, who changed it, when).

This frontend is set up to run **standalone with mock data first**, then switch over to
**Firebase Firestore** once a project is configured — no code changes required, just an env flag.

## Stack

- **React 19** + **TypeScript**
- **Vite** — fast dev server and build tool
- **Tailwind CSS v4** — utility-first responsive styling
- **Redux Toolkit** — global state (cars, UI)
- **Firebase (Firestore)** — cars + change history storage
- **React Router** — client-side routing (`/`, `/cars/:carId`, `/about`)
- **qrcode.react** — client-side QR code rendering for each car's CarCycle link
- **useState** — local component state (search, filters, edit form)

## Project Structure

```
src/
├── app/                  # Redux store & typed hooks
│   ├── store.ts
│   └── hooks.ts
├── components/
│   ├── layout/           # Header, Footer, Layout
│   └── ui/               # Button, Card, Badge, QRCode, LoadingSpinner, ErrorMessage
├── features/
│   ├── cars/
│   │   ├── carsSlice.ts  # list, selected car, history, loading/error state
│   │   ├── carStatus.ts  # status labels/badge colors
│   │   ├── CarList.tsx   # main CarCycle page (search, status filter, grid)
│   │   └── CarCycle.tsx  # CarCycle page: info, QR code, edit form, history timeline
│   └── ui/
│       └── uiSlice.ts    # sidebar/theme UI state
├── pages/                # Route pages
├── services/
│   ├── firebaseClient.ts  # Firebase app + Firestore instance
│   ├── firestoreData.ts   # Firestore reads/writes (cars, per-car history subcollection)
│   ├── mockData.ts        # seed cars/history + mock async functions
│   └── endpoints.ts       # carsApi — switches between mock and Firestore
├── types/                # Shared TypeScript types (Car, CarHistoryEntry, ...)
├── App.tsx
├── main.tsx
└── index.css

scripts/
└── seed-firebase.mjs      # one-time: writes a single example car into Firestore
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install & Run

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start dev server (http://localhost:3000)
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Branching & deployment

- Git flow: `feature/*` → PR into `dev` → PR `dev` into `main`. The `Branch policy` workflow
  (`source-branch` check) fails PRs into `dev` that aren't from `feature/*` and PRs into `main`
  that aren't from `dev`. Both branches are protected: no direct pushes, CI must pass, and the
  repo owner merges.
- `CI` (`npm run lint`, `npm run build`) runs on every PR to `dev`/`main` and on pushes to `dev`.
- `Deploy to Netlify` runs on push to `main`: builds in GitHub Actions and uploads `dist/` with
  `netlify-cli`. Production reads/writes Firestore. It needs:
  - repo secrets `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `VITE_ADMIN_PASSWORD`, `VITE_FIREBASE_API_KEY`
  - repo variables `VITE_DATA_SOURCE=firestore`, `VITE_FIREBASE_AUTH_DOMAIN`,
    `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
    `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
    (`VITE_API_BASE_URL` only if switching to `api`)
- `netlify.toml` / `public/_redirects` serve `index.html` for all routes so deep links work.

## Data source: mock, Firestore, or API

`src/services/endpoints.ts` exports one `carsApi` object. Which implementation it points to is
controlled entirely by `.env`:

```
VITE_DATA_SOURCE=mock     # mock (default) | firestore | api
VITE_API_BASE_URL=http://localhost:8080/api   # used when VITE_DATA_SOURCE=api (CarCycleService)
```

`VITE_USE_MOCK_DATA=false` still selects Firestore when `VITE_DATA_SOURCE` is unset.

Leave `VITE_DATA_SOURCE=mock` while developing UI — the app runs fully functional against
seeded sample cars and history, including simulated "update" calls that append a history entry
in memory (resets on page reload).

### Switching to Firestore

1. Create a Firebase project (or use an existing one) at
   [console.firebase.google.com](https://console.firebase.google.com), then enable **Firestore
   Database** (Build > Firestore Database > Create database).
2. In **Project settings > General > Your apps**, add a Web app and copy its config values into
   `.env`:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

3. In the Firestore console, open the **Rules** tab and paste:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /cars/{carId} {
         allow read, write: if true;
         match /history/{historyId} {
           allow read, write: if true;
         }
       }
     }
   }
   ```

   This matches the app's current FE-only admin gate (see **Admin Login** below) — anyone with
   the project config can read/write. Tighten this once real Firebase Authentication is added.
4. Seed one example car so there's something to view/edit: `npm run seed:firebase`.
5. Set `VITE_USE_MOCK_DATA=false` in `.env` and restart the dev server.

Data model: a `cars/{carId}` document per car (fields match the `Car` type), with a
`cars/{carId}/history` subcollection of change-log entries. No component, slice, or page needs to
change — only `src/services/endpoints.ts` cares about the switch.

## Car Photos

The `imageUrl` field on a car (edit form on its CarCycle page) is just a plain URL — no file
upload/storage wired up. To use a Google Drive photo:

1. Set `VITE_GOOGLE_DRIVE_FOLDER_URL` in `.env` to a Drive folder link — this shows an "Open
   Google Drive" button next to the image field.
2. Upload the photo there, right-click it → Share → set to "Anyone with the link" → Copy link.
3. Paste that link into the image field. `src/utils/googleDrive.ts` auto-converts Drive's share-link
   formats (`/file/d/ID/view`, `?id=ID`) into `drive.google.com/thumbnail?id=ID&sz=w1000` on blur,
   since the plain share link returns an HTML page, not image bytes, when used as an `<img src>`.

Any other public image URL (Imgur, etc.) works as-is, unconverted.

## QR Codes

Each car's CarCycle page renders a QR code (via `qrcode.react`) encoding its own URL
(`/cars/:carId`). Print it from the CarCycle page and stick it on/near the car — scanning it opens
that car's page directly, no app, account, or login needed just to view it. The "Print QR label"
button uses CSS (`print:hidden` / `print:*` utility classes) to print only the QR block, not the
rest of the page.

## Admin Login

Viewing cars (CarCycle list, CarCycle page, history, QR code) needs no login at all. **Editing**
a car's data is gated behind an admin login:

```
VITE_ADMIN_PASSWORD=admin123   # change this before sharing the app with anyone
```

Click "เข้าสู่ระบบผู้ดูแล" (Admin Login) in the header and enter this password to unlock the
"แก้ไขข้อมูล" (edit) button on a car's CarCycle page; a plain visitor never sees it. The logged-in
role is stored in `localStorage` (`src/features/auth/authSlice.ts`) until "ออกจากระบบ" (logout).

**This is a convenience gate, not real security** — `VITE_ADMIN_PASSWORD` is bundled into the
client-side JS, `localStorage` can be edited via devtools, and the Firestore rules above allow
writes from anyone, so a motivated user could bypass it. Add Firebase Authentication and rewrite
the Firestore rules to check `request.auth` before relying on this for anything sensitive.

## State Management

| Layer | Use Case | Example |
|-------|----------|---------|
| **Redux** | Server data, shared UI | Car list, selected car, history, admin role, mobile sidebar |
| **useState** | Local UI state | Search input, edit-form fields, login password field |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run seed:firebase` | Write one example car into Firestore |

## License

MIT
