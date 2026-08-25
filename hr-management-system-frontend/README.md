# BitcraftX HR — Frontend

React + Vite frontend for the Laravel HR Management System API.

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Make sure the Laravel backend is running
first (`php artisan serve`, at `http://127.0.0.1:8000`).

If you deploy the backend somewhere else, update `BASE_URL` in
`src/api/client.js`.

## Login

Uses the same seeded accounts as the backend:

| Role     | Email               | Password |
|----------|---------------------|----------|
| Admin    | admin@hrms.test     | password |
| HR       | hr@hrms.test        | password |
| Employee | employee@hrms.test  | password |

Admin/HR land on the full dashboard (departments, employees, attendance log,
leave approvals). Employees land on a self-service view (check-in/out,
submit and track leave).

## If requests fail with a CORS error

Laravel's default CORS config normally allows all origins in local dev. If
you see a CORS error in the browser console, open the backend's
`config/cors.php` and confirm `paths` includes `api/*` and `allowed_origins`
includes `*` (or specifically `http://localhost:5173`), then restart
`php artisan serve`.

## Structure

- `src/api/client.js` — axios instance, attaches the Sanctum bearer token
  from localStorage to every request
- `src/context/AuthContext.jsx` — login/logout state
- `src/components/` — shared UI (Layout with role-based sidebar nav, cards,
  modals, the ledger-style record rows)
- `src/pages/admin/` — dashboard, departments, employees, attendance log,
  leave approvals
- `src/pages/employee/` — check-in/out, my leave requests
