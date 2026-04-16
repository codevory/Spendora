import { useAppSelector } from "../store/store";
import { insightData } from "../utils/helperFunctions/insightData";
import { formatCurrency } from "../utils/currency";

const MonthlyInsights = () => {
  const incomeTransactions = useAppSelector(
    (state) => state.incomeTransaction.incomeTransactions,
  );
  const expenseTransactions = useAppSelector(
    (state) => state.transaction.transactions,
  );
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);

  const insights = insightData({
    incomeTransactions,
    transactions: expenseTransactions,
  });

  const hasData = insights.totalExpense > 0 || insights.totalIncome > 0;

  if (!hasData) {
    return (
      <div className="card h-full">
        <h2 className="text-xl font-semibold text-slate-100">
          Monthly Insights
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          Add transactions and income entries to unlock smart month-to-date
          insights.
        </p>
      </div>
    );
  }

  return (
    <div className="card h-full space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            Monthly Insights
          </h2>
          <p className="text-xs text-slate-400">{insights.monthTitle}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            insights.expenseDeltaPercent <= 0
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {insights.expenseDeltaPercent > 0 ? "+" : ""}
          {insights.expenseDeltaPercent.toFixed(1)}% vs last month
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="insight-tile rounded-xl p-3">
          <p className="text-xs text-slate-400">Spent this month</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">
            {formatCurrency(insights.totalExpense ?? 0, currencyKey)}
          </p>
        </div>

        <div className="insight-tile rounded-xl p-3">
          <p className="text-xs text-slate-400">Projected month-end spend</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">
            {formatCurrency(insights.projectedSpend ?? 0, currencyKey)}
          </p>
        </div>

        <div className="insight-tile rounded-xl p-3">
          <p className="text-xs text-slate-400">Average daily spend</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">
            {formatCurrency(insights.avgDailySpend ?? 0, currencyKey)}
          </p>
        </div>

        <div className="insight-tile rounded-xl p-3">
          <p className="text-xs text-slate-400">Savings rate</p>
          <p
            className={`mt-1 text-lg font-semibold ${
              insights.savingsRate >= 20 ? "text-emerald-300" : "text-amber-300"
            }`}
          >
            {insights.savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
          <span>Month progress</span>
          <span>{Math.round(insights.dailyRunRate * 100)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-700">
          <div
            className="h-2 rounded-full bg-indigo-400"
            style={{ width: `${Math.round(insights.dailyRunRate * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="insight-tile rounded-xl p-3">
          <p className="text-xs text-slate-400">Top category</p>
          {insights.topCategory ? (
            <>
              <p className="mt-1 text-base font-semibold text-slate-100">
                {insights.topCategory.name}
              </p>
              <p className="text-xs text-slate-400">
                {formatCurrency(insights.topCategory.amount ?? 0, currencyKey)} (
                {insights.topCategory.sharePercent.toFixed(1)}% of total)
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate-400">
              No category data available.
            </p>
          )}
        </div>

        <div className="insight-tile rounded-xl p-3">
          <p className="text-xs text-slate-400">Biggest expense</p>
          {insights.biggestExpense ? (
            <>
              <p className="mt-1 text-base font-semibold text-slate-100">
                {insights.biggestExpense.name}
              </p>
              <p className="text-xs text-slate-400">
                {formatCurrency(insights.biggestExpense.amount ?? 0, currencyKey)}{" "}
                on{" "}
                {new Date(insights.biggestExpense.date).toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "short",
                  },
                )}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate-400">
              No expense transactions yet.
            </p>
          )}
        </div>
      </div>

      <div className="insight-suggestion rounded-xl p-3 text-sm mb-15 lg:mb-3">
        <p className="font-medium">Suggestion</p>
        <p className="mt-1 text-xs leading-5">
          {insights.savingsRate < 20
            ? "Your savings rate is below 20%. Try trimming your top category this week to improve month-end balance."
            : "Strong momentum. Keep your average daily spend under control to protect your savings target."}
        </p>
      </div>
    </div>
  );
};

export default MonthlyInsights;
