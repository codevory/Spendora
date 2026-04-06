# Spendora

Spendora is a personal finance dashboard for tracking expenses, income, and spending categories in one place. It is built with React, TypeScript, Vite, Redux Toolkit, Tailwind CSS, and Chart.js.

The app focuses on three things:

- Recording transactions quickly.
- Showing a clear snapshot of spending habits.
- Keeping data in the browser so it remains available after refresh.

## What You Can Do

- Add and review expense transactions.
- Add income entries.
- Create and manage spending categories.
- Filter transactions by category and date range.
- Compare monthly spending with charts and summary cards.
- Open detailed views for individual transactions.

## Main Screens

- Dashboard: summary cards, recent transactions, quick add form, and spending charts.
- Transactions: browse transaction history, filter by category, and search by date range.
- Categories: create categories and view the categories already in use.
- Add Income: record income entries in a dedicated form.

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS 4
- Chart.js and react-chartjs-2
- react-hot-toast for notifications

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Vite will start a local server and print the address in the terminal.

### Create a Production Build

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

### Run Linting

```bash
npm run lint
```

## Project Structure

- src/pages: route-level screens and page layouts.
- src/components: reusable UI blocks and forms.
- src/charts: chart components used on the dashboard and transaction views.
- src/store: Redux store and feature slices.
- src/Hooks: shared hooks, including local storage bootstrapping.
- src/types: TypeScript types for transactions, income, and categories.
- src/utils: helper utilities used across the app.

## Data Persistence

Spendora stores user data in browser local storage so the app can restore existing entries after a reload.

The current storage keys are:

- userTransactions
- userIncomeData
- userCategories

If you want to reset the app state, clear the site data in your browser.

## Routing Overview

- /: dashboard
- /transactions: transaction list and filters
- /transactions/tnx-details/:id: transaction detail view
- /categories: category management
- /add-income: income entry form

## Notes

- Chart data is derived from the stored transaction list.
- The UI is designed for finance tracking rather than general-purpose task management.
- Some dashboard values are computed from the current transaction data and monthly totals.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.
