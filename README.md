# Spendora

Spendora is a personal finance tracker that helps users manage expenses, income, and categories with a modern analytics-first dashboard.

The project is built with React, TypeScript, Vite, Redux Toolkit, Tailwind CSS, Chart.js, and Firebase Authentication.

## Features

- Expense transaction management (add, edit, delete, and detail view)
- Income tracking with monthly analysis integration
- Category management for custom spending buckets
- Analytics dashboard with:
  - income vs expense trend
  - spending distribution chart
  - monthly insight cards (savings rate, top category, biggest expense, projected spend)
- Recent transactions panel and responsive dashboard layout
- Email/password authentication and Google sign-in (Firebase)
- Toast notifications for user feedback
- Local persistence through browser localStorage

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS 4
- Chart.js + react-chartjs-2
- Firebase (Auth + Firestore Lite)
- react-hot-toast

## Routing

- `/` - main dashboard layout
- `/transactions` - transaction listing and management
- `/transactions/tnx-details/:id` - transaction detail page
- `/categories` - category management
- `/analytics` - analytics and monthly insights
- `/signin` - sign-in page
- `/signup` - registration page
- `/me` - user account page

## Data Persistence

Redux state is synchronized with localStorage for offline-friendly persistence.

Storage keys used by the app:

- `userTransactions`
- `userIncomeData`
- `userCategories`

To reset local app data, clear browser site storage for the app origin.

## Firebase Setup

Create a `.env` file in the project root and add:

```env
VITE_FIREBASE_API_KEY=your_value
VITE_Auth_Domain=your_value
VITE_Project_Id=your_value
VITE_storage_Bucket=your_value
VITE_messagingSender_Id=your_value
VITE_app_Id=your_value
VITE_measurement_Id=your_value
```

Note: environment variable names must match exactly.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

- `src/pages` - route-level screens and composed layouts
- `src/components` - reusable UI and forms
- `src/charts` - chart wrappers and graph modules
- `src/store` - Redux store and feature slices
- `src/Hooks` - shared hooks and analytics data shaping
- `src/backend` - Firebase setup and auth helpers
- `src/utils` - business helpers and utility logic

## License

This project is licensed under MIT. See [LICENSE](LICENSE).
