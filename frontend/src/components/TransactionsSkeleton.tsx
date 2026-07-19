const TransactionsSkeleton = () => {
  return (
    <div className="card recent-transactions mt-1 relative max-h-150 overflow-hidden">
      <h2 className="recent-transactions-title mb-4 text-lg font-semibold">
        Recent Transactions
      </h2>

      <div className="max-h-110 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div

          key={index}
            className="transaction-item recent-transaction-item flex items-center justify-between border-b border-slate-700 last:border-none"
          >
            <div className="flex flex-1 flex-col gap-2 pr-4">
              <span className="h-4 w-32 animate-pulse rounded bg-slate-700/80" />
              <span className="h-3 w-40 animate-pulse rounded bg-slate-700/60" />
            </div>

            <span className="h-4 w-20 animate-pulse rounded bg-slate-700/80" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsSkeleton;