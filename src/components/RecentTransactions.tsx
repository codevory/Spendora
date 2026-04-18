import { useMemo } from "react";
import { useAppSelector } from "../store/store";
import { formatCurrency } from "../utils/currency";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  day: "2-digit",
  month: "long",
});

const RecentTransactions = () => {
  const userExpenseTxns = useAppSelector(
    (state) => state.transaction.transactions,
  );
  const userIncomeTxns = useAppSelector(
    (state) => state.incomeTransaction.incomeTransactions,
  );
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);

  const sortedTransactions = useMemo(() => {
    const normalizedIncomeData = userIncomeTxns.map((txn) => {
      return {
        amount: txn.amount,
        transactionId: txn.transactionId,
        name: txn.source,
        date: txn.date,
        dateTimestamp: new Date(txn.date).getTime(),
        type: txn.type ?? "income",
      };
    });

    const normalizedExpenseData = userExpenseTxns.map((txn) => {
      return {
        amount: txn.amount,
        transactionId: txn.transactionId,
        name: txn.name,
        date: txn.date,
        dateTimestamp: new Date(txn.date).getTime(),
        type: txn.type ?? "expense",
      };
    });

    const combined = [...normalizedExpenseData, ...normalizedIncomeData];
    return combined.sort((a, b) => b.dateTimestamp - a.dateTimestamp);
  }, [userExpenseTxns, userIncomeTxns]);

  return (
    <div className="card recent-transactions mt-6">
      <h2 className="recent-transactions-title text-lg font-semibold mb-4">
        Recent Transactions
      </h2>

      {sortedTransactions
        .map((item) => {
          return (
            <div
              key={item.transactionId}
              className="transaction-item recent-transaction-item border-b border-slate-700 last:border-none"
            >
              <div>
                <p className="font-medium recent-transaction-name">{item.name}</p>
                <p className="text-sm text-muted">
                  {dateFormatter.format(new Date(item.date))} •{" "}
                  {getDayName(item.date)}
                </p>
              </div>

              <div
                className={`${item.type === "expense" ? "recent-transaction-amount-expense" : "recent-transaction-amount-income"}`}
              >
                <span className="font-semibold flex items-center">
                  {`${item.type === "expense" ? "-" : "+"}`}{formatCurrency(Number(item.amount.toString().replace("-",'')), currencyKey)}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default RecentTransactions;

function getDayName(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-us", {
    weekday: "short",
  });
}
