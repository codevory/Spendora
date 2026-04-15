import { useAppSelector } from "../store/store";

const RecentTransactions = () => {
  const userExpenseTxns = useAppSelector(
    (state) => state.transaction.transactions,
  );
  const userIncomeTxns = useAppSelector(
    (state) => state.incomeTransaction.incomeTransactions,
  );

  const normalizedIncomeData = userIncomeTxns.map((txn) => {
    return {
      amount: txn.amount.toString().replace("-",''),
      transactionId: txn.transactionId,
      name: txn.source,
      date: txn.date,
      createdAt: txn.createdAt,
      type: txn.type ?? "income",
    };
  });

  const normalizedExpenseData = userExpenseTxns.map((txn) => {
    return {
      amount: txn.amount,
      transactionId: txn.transactionId,
      name: txn.name,
      date: txn.date,
      createdAt: txn.createdAt,
      type: txn.type ?? "expense",
    };
  });
  const copy = [...normalizedIncomeData, ...normalizedExpenseData];
  return (
    <div className="card recent-transactions mt-6">
      <h2 className="recent-transactions-title text-lg font-semibold mb-4">
        Recent Transactions
      </h2>

      {copy
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((item) => {
          return (
            <div
              key={item.transactionId}
              className="transaction-item recent-transaction-item border-b border-slate-700 last:border-none"
            >
              <div>
                <p className="font-medium recent-transaction-name">{item.name}</p>
                <p className="text-sm text-muted">
                  {formateDate().format(new Date(item.date))} •{" "}
                  {getDayName(item.date)}
                </p>
              </div>

              <div
                className={`${item.type === "expense" ? "recent-transaction-amount-expense" : "recent-transaction-amount-income"}`}
              >
                <span className="font-semibold flex items-center">
                  {`${item.type === "expense" ? "-" : "+"}`}₹{item.amount}
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

function formateDate() {
  return new Intl.DateTimeFormat("en-Us", {
    year: "numeric",
    day: "2-digit",
    month: "long",
  });
}
