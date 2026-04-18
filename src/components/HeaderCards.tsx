import { useMemo } from "react";
import { useAppSelector } from "../store/store";
import {
  getLargestTransactionInRange,
  getMonthOverMonthChange,
  getMonthlyTotal,
  getTopCategory,
} from "../utils/helperFunctions/transactionMetrics";
import { formatCurrency } from "../utils/currency";

interface HeaderCardsPropsType {
  setModalState: (val: "income") => void;
}

const HeaderCards = ({ setModalState }: HeaderCardsPropsType) => {
  const selectedState = useAppSelector(
    (state) => state.transaction.transactions,
  );
  const userIncome = useAppSelector(
    (state) => state.incomeTransaction.incomeTransactions,
  );
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);
  const transactions = Array.isArray(selectedState) ? selectedState : [];

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const monthlyExpense = getMonthlyTotal(
      transactions,
      currentMonth,
      currentYear,
    );
    const monthlyIncome = getMonthlyTotal(
      userIncome,
      currentMonth,
      currentYear,
    );
    const monthlyIncomeChange = getMonthOverMonthChange(
      userIncome,
      currentMonth,
      currentYear,
    );
    const monthlyExpenseChange = getMonthOverMonthChange(
      transactions,
      currentMonth,
      currentYear,
    );
    const monthlyNet = monthlyIncome - monthlyExpense;

    const currentMonthTransactions = transactions.filter((txn) => {
      const d = new Date(txn.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const topCategory = getTopCategory(currentMonthTransactions);
    const topCategoryShare =
      monthlyExpense > 0 ? (topCategory.amount / monthlyExpense) * 100 : 0;

    const largestExpenseThisWeek = getLargestTransactionInRange(
      transactions,
      weekStart,
      now,
    );

    const spendingProgress =
      monthlyIncome > 0
        ? Math.min(100, (monthlyExpense / monthlyIncome) * 100)
        : 0;

    return {
      monthlyExpense,
      monthlyIncome,
      monthlyIncomeChange,
      monthlyExpenseChange,
      monthlyNet,
      topCategory,
      topCategoryShare,
      largestExpenseThisWeek,
      spendingProgress,
    };
  }, [transactions, userIncome]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="p-3 md:p-6 bg-slate-800 rounded-2xl border glass border-slate-700 shadow-lg">
        <p className="text-slate-400 text-sm font-medium">
          Monthly Net Balance
        </p>
        <div className="mt-2 flex justify-between items-center">
          <h2
            className={`text-md lg:text-3xl font-bold mt-1 ${metrics.monthlyNet >= 0 ? "text-emerald-300" : "text-rose-300"}`}
          >
            {formatCurrency(metrics.monthlyNet, currencyKey)}
          </h2>
          <button
            onClick={() => setModalState("income")}
            className="px-1 lg:px-2 mx-2 font-sm lg:font-semibold w-30 bg-blue-900 h-10 lg:h-12 rounded-xl active:scale-95 cursor-pointer"
          >
            Add Income
          </button>
        </div>
        <div className="mt-1 lg:mt-3 space-y-1">
          <p className="text-xs text-slate-400">
            Income: {formatCurrency(metrics.monthlyIncome, currencyKey)}
          </p>
          <p className="text-xs text-slate-400">
            Spent: {formatCurrency(metrics.monthlyExpense, currencyKey)}
          </p>
        </div>
        <div
          className={`mt-2 md:mt-4 text-xs font-medium ${metrics.monthlyIncomeChange <= 0 ? "text-red-400" : "text-green-400"}`}
        >
          {metrics.monthlyIncomeChange > 0 ? "+" : ""}
          {metrics.monthlyIncomeChange.toFixed(2)}% income vs last month
        </div>
      </div>

      <div className="p-3 md:p-6 bg-slate-800 rounded-2xl border glass border-slate-700 shadow-lg">
        <p className="text-slate-400 text-sm font-medium">Monthly Spending</p>
        <h2 className="text-xl md:text-3xl font-bold text-slate-100 mt-1">
          {formatCurrency(metrics.monthlyExpense, currencyKey)}
        </h2>
        <div className="mt-4 h-1 w-full bg-slate-700 rounded-full">
          <div
            className="h-1 bg-indigo-500 rounded-full"
            style={{ width: `${metrics.spendingProgress}%` }}
          ></div>
        </div>
        <div
          className={`mt-3 text-xs font-medium ${metrics.monthlyExpenseChange > 0 ? "text-rose-300" : "text-emerald-300"}`}
        >
          {metrics.monthlyExpenseChange > 0 ? "+" : ""}
          {metrics.monthlyExpenseChange.toFixed(2)}% expense vs last month
        </div>
      </div>

      <div className="p-3 md:p-6 bg-slate-800 rounded-2xl border glass border-slate-700 shadow-lg">
        <p className="text-slate-400 text-sm font-medium">Top Category</p>
        <h2 className="text-xl md:text-3xl font-bold text-slate-100 mt-1">{`${metrics.topCategory.category ?? "Top Category"}`}</h2>
        <div className="mt-2 md:mt-4 flex items-center gap-2">
          <span className="p-1 bg-orange-500/20 text-orange-500 rounded">
            {metrics.topCategoryShare.toFixed(0)}%
          </span>
          <span className="text-xs text-slate-400">
            Share of this month spend
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Largest this week:{" "}
          {metrics.largestExpenseThisWeek
            ? `${metrics.largestExpenseThisWeek.name} (${formatCurrency(metrics.largestExpenseThisWeek.amount, currencyKey)})`
            : "No weekly expense"}
        </div>
      </div>
    </div>
  );
};

export default HeaderCards;
