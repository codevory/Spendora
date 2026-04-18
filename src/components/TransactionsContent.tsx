import { Link } from "react-router-dom";
import { useMemo } from "react";
import type { TransactionType } from "../types/transactionType";
import EmptyState from "./EmptyState";
import { useAppSelector } from "../store/store";
import { formatCurrency } from "../utils/currency";

interface TransactionsContentPropsType {
  query?: TransactionType["category"];
  data: TransactionType[];
}

const TransactionsContent = ({ query, data }: TransactionsContentPropsType) => {
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);
  const visibleData = useMemo(() => {
    const filtered =
      query === undefined ? data : data.filter((txn) => txn.category === query);

    const normalized = filtered.map((t) => {
      return { amount : t.amount,
        category : t.category,
        date : t.date,
        type : t.type ?? "expense",
        transactionId : t.transactionId,
        name : t.name,
        timeStamp : new Date(t.date).getTime()}
      })

      return normalized.sort((a,b) => b.timeStamp - a.timeStamp)
  }, [query, data]);

  const noData = (
    <div className="card glass flex min-h-80 flex-col items-center justify-center gap-4 border border-slate-700 text-center">
      <div className="rounded-full bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300">
        No transactions found
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-100">
          Nothing matches the current filters
        </h2>
        <p className="text-sm text-slate-400">
          Try a different category or expand the date range to reveal more
          results.
        </p>
      </div>
    </div>
  );

  if (!visibleData.length) {
    return <EmptyState content={noData} />;
  }
  return (
    <div className="transaction-container max-h-dvh overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900/70 p-3 shadow-lg">
      <div className="mb-3 flex items-center justify-between px-1">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Transactions</h3>
          <p className="text-xs text-slate-400">
            Showing {visibleData.length} records
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          {query ?? "All categories"}
        </span>
      </div>

      <div className="sticky top-0 z-10 grid grid-cols-[0.45fr_1.45fr_0.7fr] gap-3 border-b border-slate-700 bg-slate-900/95 px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 backdrop-blur">
        <span>#</span>
        <span>Transaction</span>
        <span className="text-right">Amount</span>
      </div>

      <div className="space-y-2 pt-3">
        {visibleData.map((txn, idx) => (
          <Link
            key={txn.transactionId}
            to={`/transactions/tnx-details/${txn.transactionId}`}
            className="block rounded-xl border border-slate-700 bg-slate-800/70 transition hover:border-slate-500 hover:bg-slate-800"
          >
            <div className="grid grid-cols-[0.45fr_1.45fr_0.7fr] items-center gap-3 px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-300">
                {idx + 1}
              </div>

              <div className="min-w-0">
                <p className="truncate font-medium text-slate-100">
                  {txn.name}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {txn.transactionId.slice(0, 12)} •{" "}
                  {formatTransactionDate(txn.date)}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex rounded-full bg-rose-500/15 px-3 py-1 text-sm font-semibold text-rose-300">
                  {formatCurrency(txn.amount, currencyKey)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TransactionsContent;

function formatTransactionDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}
