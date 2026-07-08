import { useMemo, useState } from "react";
import { useAppSelector } from "../store/store";
import { formatCurrency } from "../utils/currency";
import { useGetRecentTransactionsQuery } from "../store/features/transactionApi.ts";
import type { Transaction } from "../types/recentTransactions";
import RecentTransactionsSkeleton from "./RecentTransactionsSkeleton.tsx";

type DisplayTransaction = Transaction & {
  name: string;
  dateTimestamp: number;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  day: "2-digit",
  month: "long",
});

const PAGE_SIZE = 5;

const RecentTransactions = () => {
  const [page, setPage] = useState<number>(1);
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);

  const { data, isFetching, isLoading, error } = useGetRecentTransactionsQuery({
    page,
    size: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const recentTxns = data?.transactions || [];

  const canGoPrev = page > 1;
  const canGoNext = recentTxns.length === PAGE_SIZE;

  const sortedTransactions = useMemo<DisplayTransaction[]>(() => {
    return [...recentTxns]
      .map((txn) => ({
        ...txn,
        name: txn.entity,
        dateTimestamp: new Date(txn.date).getTime(),
      }))
      .sort((a, b) => b.dateTimestamp - a.dateTimestamp);
  }, [recentTxns]);

  if (isLoading || isFetching) {
    return <RecentTransactionsSkeleton />;
  }

  if (error) {
    return <div className="card text-center p-4">Failed to load transactions.</div>;
  }

  return (
    <div className="card recent-transactions mt-1 relative max-h-150 overflow-hidden">
      <h2 className="recent-transactions-title text-lg font-semibold mb-4">
        Recent Transactions
      </h2>

      {/* Add a subtle visual indicator like opacity lowering when fetching a subsequent page */}
      <div className={`max-h-110 transition-opacity duration-200 ${isFetching ? "opacity-40" : "opacity-100"}`}>
        {sortedTransactions.map((item) => {
          return (
            <div
              key={item.id.toString() + item.transactionId}
              className="transaction-item recent-transaction-item border-b border-slate-700 last:border-none mb-1"
            >
              <div>
                <p className="font-medium recent-transaction-name">{item.name}</p>
                <p className="text-sm text-muted">
                  {dateFormatter.format(new Date(item.date))} •{" "}
                  {getDayName(item.date.toString())}
                </p>
              </div>

              <div
                className={`${
                  item.type === "expense"
                    ? "recent-transaction-amount-expense"
                    : "recent-transaction-amount-income"
                }`}
              >
                <span className="font-semibold flex items-center">
                  {`${item.type === "expense" ? "-" : "+"}`}
                  {formatCurrency(Number(item.amount), currencyKey)}
                </span>
              </div>
            </div>
          );
        })}
        <span className="card glass transaction-item mb-4"></span>
        {sortedTransactions.length === 0 && !isFetching && (
          <p className="text-center text-muted py-6">No transactions found.</p>
        )}
      </div>

      <div className="glass w-full flex justify-between items-center absolute bottom-0 left-0 bg-amber-700">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!canGoPrev || isFetching}
          className="primary-button w-16 h-10 rounded-lg bg-blue-900 disabled:opacity-50"
        >
          prev
        </button>
        <p>{page}</p>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!canGoNext || isFetching}
          className="primary-button w-16 h-10 rounded-lg bg-blue-900 disabled:opacity-50"
        >
          next
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;

function getDayName(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-us", {
    weekday: "short",
  });
}