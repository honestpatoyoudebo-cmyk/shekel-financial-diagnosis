# Shekɛl — Financial Diagnosis Frontend

A React + Vite frontend for the Shekɛl Financial Diagnosis capstone.

## Important data rule
This build does **not** seed sample financial amounts, sample goals, sample debts, sample alerts, or sample dashboard figures into a user's account.

All displayed financial values come from:
- the user's financial snapshot;
- expenses the user adds;
- savings goals the user creates; or
- debts the user enters.

Starter demo goals/debts from earlier development builds are automatically removed once when the app starts.

## Run

```bash
npm install
npm run dev
```

Create `.env` from `.env.example` if backend integration is being tested.

## Current frontend functionality

- Registration and local login
- User name/email shown across the app
- Profile picture upload, change and removal
- Editable personal information
- Financial profile summary
- Notification toggle
- Theme selection
- Biometrics preference toggle
- Accountability preference
- Help/FAQ modal
- Manual financial snapshot
- Local diagnosis fallback based only on user-entered numbers
- Budget calculated from entered financial values plus logged expenses
- Add/delete expenses
- Receipt upload, preview, remove and change
- Savings goals: create/delete
- Debts: create/delete
- Dashboard calculations from the user's numbers
- Backend diagnosis/alerts support when a valid backend snapshot ID/token is available

## Backend scope note
The project information supplied so far contains complete details for the financial diagnosis/perception/alerts endpoints, but not complete contracts for every possible expense, savings, debt, profile, or authentication operation. Therefore the unsupported sections use browser local storage rather than invented backend endpoints.

The product PRD also defines V1 primarily around Financial Snapshot → Perception → Analysis → Gap Check → Priority → Action. Budgeting, history/trends, notifications, savings challenges and similar features should be treated as additional prototype functionality unless the product team confirms them for the current MVP.

## Real backend integration

This version connects the frontend to the supplied Financial Diagnosis API.

Configured API base URL: `https://financial-diagnois-api.onrender.com` (override with `VITE_API_BASE_URL`).

Connected contracts:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile`
- POST `/api/financial-snapshot`
- GET `/api/financial-snapshot`
- PATCH `/api/financial-snapshot/:snapshotId/perception`
- GET `/api/financial-snapshot/:snapshotId/diagnosis`
- GET `/api/financial-snapshot/:snapshotId/alerts`

Authentication uses the JWT returned by login and sends it as `Authorization: Bearer <token>` on protected requests.

Multiple accounts remain supported on one browser. Each locally remembered account stores its own cached UI data and server token, while the financial snapshot/diagnosis/alerts are loaded from the backend when available.

The supplied Postman collection does not define a delete-account endpoint or a logout endpoint. Therefore the Profile page's account removal currently removes the account from this device only; it does not claim to delete the server-side user. A real server-side delete requires a backend endpoint.


## Stage 2D — UI/UX polish
This version adds responsive mobile behavior, clearer loading/error/success states, disabled/loading button styling, stronger form validation feedback, keyboard focus states, improved navigation touch targets, consistent spacing/cards, and professional empty states. The existing warm-sand/green visual direction remains aligned with the supplied prototype direction.

## Stage 2E — Production deployment

This project is prepared for Vercel as a Vite single-page application.

- Build command: `npm run build`
- Output directory: `dist`
- Production API: `https://financial-diagnois-api.onrender.com`
- Vercel SPA rewrite: `vercel.json`

Set the Vercel environment variable:

`VITE_API_BASE_URL=https://financial-diagnois-api.onrender.com`

Vite exposes client-side environment variables only when they use the `VITE_` prefix. Do not place secrets in `VITE_` variables.
