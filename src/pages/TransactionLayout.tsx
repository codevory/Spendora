import React, { useMemo, useState, Suspense } from "react";
import TransactionsContent from "../components/TransactionsContent";
import ViewTransactionDetails from "../components/ViewTransactionDetails";
import { useAppSelector } from "../store/store";
import type { TransactionType } from "../types/transactionType";
import { useUserData } from "../Hooks/useUserData";
import Layout from "../components/Layout";
import Loader from "../components/Loader";

interface TransactionLayoutProps {
  onToggle: () => void;
  isOpen: boolean;
}

const TransactionLayout = ({ onToggle, isOpen }: TransactionLayoutProps) => {
  const TrendGraph = React.lazy(() => import("../charts/TrendGraph"));
  const [query, setQuery] = useState<TransactionType["category"] | undefined>();
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const data = useAppSelector((state) => state.transaction.transactions);
  const categoriesData = useAppSelector(
    (state) => state.transaction.categories,
  );
  const categories = useMemo(
    () =>
      [
        ...new Set(categoriesData.map((c) => c.name)),
      ] as TransactionType["category"][],
    [data],
  );

  const filteredData = useMemo(() => {
    return data.filter((txn) => {
      const matchesCategory = query ? txn.category === query : true;

      const txnDate = new Date(txn.date);
      const matchesStart = dateFrom ? txnDate >= new Date(dateFrom) : true;
      const matchesEnd = dateTo ? txnDate <= new Date(dateTo) : true;

      return matchesCategory && matchesStart && matchesEnd;
    });
  }, [data, dateFrom, dateTo, query]);

  const resetFilters = () => {
    setQuery(undefined);
    setDateFrom("");
    setDateTo("");
  };

  const { lineData } = useUserData();
  const selectedCount = filteredData.length;

  return (
    <Suspense fallback={<Loader />}>
      <>
        <Layout onToggle={onToggle} isOpen={isOpen} isLoggedin={false}>
          <div className="container-main space-y-6">
            <section className="rounded-2xl border border-slate-700 bg-linear-to-r from-slate-800 to-slate-900 p-4 md:p-6 shadow-lg">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs tracking-wider text-slate-400">
                    TRANSACTIONS
                  </p>
                  <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-100">
                    Browse and inspect spending
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-300">
                    Filter by category or date range to quickly find a
                    transaction, then compare it against your broader spending
                    trend.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Visible
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-100">
                      {selectedCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Categories
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-100">
                      {categories.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Date filter
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-100">
                      {dateFrom || "Start"} → {dateTo || "End"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Focus
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-100">
                      {query ?? "All categories"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-800/70 p-4 md:p-5 shadow-lg">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">
                      Transaction list
                    </h2>
                    <p className="text-sm text-slate-400">
                      Use the filter bar to narrow down the records below.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={query ?? ""}
                      onChange={(e) =>
                        setQuery(
                          e.target.value
                            ? (e.target.value as TransactionType["category"])
                            : undefined,
                        )
                      }
                      className="input min-w-44"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-xl border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600 active:scale-95"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <TransactionsContent query={query} data={filteredData} />
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 md:p-5 shadow-lg">
                  <ViewTransactionDetails
                    data={filteredData}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                    handleSearchTxns={() => undefined}
                  />
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 md:p-5 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">
                        Spending trend
                      </h2>
                      <p className="text-sm text-slate-400">
                        Monthly comparison of your recorded expenses.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="min-w-140 min-h-110">
                      <TrendGraph data={lineData} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Layout>
      </>
    </Suspense>
  );
};

export default TransactionLayout;
