# Spendora

Spendora is a personal finance tracker built around a dashboard-first workflow for expenses, income, categories, and analytics.

![Spendora system design](spendora_syst_design_1.png)

_System Architecture: the frontend sends API requests to the backend, the backend talks to the database, and responses flow back to the frontend for rendering._

## Highlights

Spendora is tuned for a clean product story and a reliable full-stack developer experience:

- Session-based authentication with protected dashboard routes
- Transaction, income, and category management in one flow
- Client-side schema validation using **Zod** for robust form handling
- Server-side **inputData sanitizer middleware** to purify client payloads before DB operations
- Analytics views for trends, distributions, and monthly insights
- Responsive layout with sidebar, mobile menu, and modal-driven forms
- API documentation and health endpoints on the backend
- SPA deployment support through Vercel rewrites

## What It Does

- Track expenses with list, detail, edit, and delete flows
- Add and review income entries alongside expense data
- Organize spending with custom categories
- Explore dashboard insights such as income vs expense trends, category distribution, and monthly summaries
- View recent activity and account details from a dedicated profile screen
- Sign in, sign up, and access protected pages through session-aware routing

## Current Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, Redux Toolkit, React Redux, Zod
- **UI & Charts:** Tailwind CSS 4, Chart.js, react-chartjs-2, react-hot-toast
- **Backend:** Node.js, Express 5, PostgreSQL, express-session, bcryptjs, CSRF protection, Input Sanitizer Middleware
- **Deployment:** Vercel frontend rewrites with a hosted backend API

## Updated Achievements

The project reflects a complete implementation-focused set of wins:

- Protected dashboard architecture with route-level session gating
- Schema-driven client-side validation using **Zod** to prevent invalid submissions early
- Server-side input sanitization middleware (`sanitizeInput`) to cleanse incoming requests before database execution
- Dedicated transaction, category, and analytics screens instead of a single monolithic page
- Backend API docs exposed at : `/api/v1/docs`
- Health check endpoint at `/api/v1/status`
- Vercel rewrites configured for SPA navigation and API proxying
- CORS, CSRF, and rate limiting wired into the backend for safer request handling

## Routes

Frontend routes:

- `/welcome` - landing page
- `/signin` - sign-in page
- `/signup` - registration page
- `/` - protected dashboard shell
- `/transactions` - transaction management
- `/transactions/tnx-details/:id` - transaction detail view
- `/categories` - category management
- `/analytics` - charts and insights
- `/me` - account page
- `*` - fallback empty state

Backend routes:

- `/api/v1/auth` - login, register, logout, session, and CSRF helpers
- `/api/v1/auth/me` - current user lookup
- `/api/v1/auth/sid` - current session id
- `/api/v1/auth/csrf` - CSRF token retrieval
- `/api/v1/transactions` - transaction feeds and summaries
- `/api/v1/transactions/financial-summary` - Financial overview with monthly transactions report over last 1 year
- `/api/v1/transactions/expenses` - expense operations
- `/api/v1/transactions/incomes` - income operations
- `/api/v1/categories` - category CRUD
- `/api/v1/status` - server health
- `/api/v1/docs` - Swagger UI documentation

## Setup

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL for the backend

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

## Note for running locally

### Database - psql

For running locally or for development purposes, use a local environment (e.g., Ubuntu/WSL/macOS), then:

1. Install PostgreSQL on your machine.
2. Create DB tables (queries located in `/backend/db/dbQueries.sql`) one by one.
3. Start the backend, then the frontend using your code editor or terminal.

### Production Build

```bash
cd frontend
npm run build
```

### Lint

```bash
cd frontend
npm run lint
```

## Environment

The backend expects environment values for session and database configuration, loaded from the appropriate `.env` file for the target environment. The frontend relies on the API proxy and deployment configuration defined in `frontend/vercel.json`.

## Project Layout

- `frontend/src/pages` - routed screens and layout containers
- `frontend/src/components` - reusable UI, navigation, forms, and state guards
- `frontend/src/charts` - analytics chart wrappers
- `frontend/src/store` - Redux store and API state
- `frontend/src/utils` - auth and helper utilities
- `backend/controllers` - request handlers for auth, categories, transactions, and health
- `backend/routes` - API route registration
- `backend/middleware` - CSRF, auth guards, and `inputData` sanitizer middleware
- `backend/db` - database connection helpers and SQL references

## Deployment Notes

- Frontend rewrites send `/api/*` traffic to the hosted backend and route all other paths to `index.html`
- The backend is configured for CORS with local development origins and the production Vercel origin
- The API is served under `/api/v1`

## License

This project is licensed under MIT. See [LICENSE](LICENSE).
