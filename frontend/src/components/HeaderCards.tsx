import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../store/store";
import {
  getLargestTransactionInRange,
  getMonthOverMonthChange,
  getMonthlyExpenseTotal,
  getMonthlyIncomeTotal,
  getTopCategory,
} from "../utils/helperFunctions/transactionMetrics";
import { formatCurrency } from "../utils/currency";
import useThemeContext from "../Hooks/useThemeContext";
import { useUserData } from "../Hooks/useUserData";
import SingleSkeleton from "./SingleSkeleton";

interface HeaderCardsPropsType {
  setModalState: (val: "income") => void;
}

const HeaderCards = ({ setModalState }: HeaderCardsPropsType) => {
  const { expenses: selectedState, incomeTrans: userIncome } = useUserData();
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);
  const transactions = Array.isArray(selectedState) ? selectedState : [];
  const [showLoader, setShowLoader] = useState(true);
  const { isDark } = useThemeContext();

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const monthlyExpense = getMonthlyExpenseTotal(transactions, currentMonth, currentYear);
    const monthlyIncome = getMonthlyIncomeTotal(userIncome, currentMonth, currentYear);
    const monthlyIncomeChange = getMonthOverMonthChange(selectedState, currentMonth, currentYear);
    const monthlyExpenseChange = getMonthOverMonthChange(transactions, currentMonth, currentYear);
    const monthlyNet = monthlyIncome - monthlyExpense;

    const currentMonthTransactions = transactions.filter((txn) => {
      const d = new Date(txn.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const topCategory = getTopCategory(currentMonthTransactions);
    const topCategoryShare = monthlyExpense > 0 ? (topCategory.amount / monthlyExpense) * 100 : 0;
    const largestExpenseThisWeek = getLargestTransactionInRange(transactions, weekStart, now);
    const spendingProgress = monthlyIncome > 0 ? Math.min(100, (monthlyExpense / monthlyIncome) * 100) : 0;

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

  useEffect(() => {
    setShowLoader(true);
    let timer = setTimeout(() => {
      setShowLoader(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [transactions, userIncome]);

  // Dynamic Theme Classes
  const cardBg = isDark ? "bg-slate-900/80 border-slate-800 shadow-slate-950/40 text-slate-100" : "bg-white border-slate-200 shadow-slate-200/60 text-slate-800";
  const subText = isDark ? "text-slate-400" : "text-slate-600";
  const labelText = isDark ? "text-slate-500" : "text-slate-400";
  const borderMuted = isDark ? "border-slate-800/80" : "border-slate-100";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">

      <div className={`p-3.5 backdrop-blur-md rounded-xl border border-l-4 shadow-md flex flex-col justify-center gap-2 ${cardBg} ${
        metrics.monthlyNet >= 0 
          ? "border-l-emerald-500 shadow-emerald-500/5" 
          : "border-l-rose-500 shadow-rose-500/5"
      }`}>
        <div className="flex items-center justify-between">
          <p className={`${labelText} text-[10px] font-bold uppercase tracking-widest`}>Net Balance</p>
          {(showLoader ? <SingleSkeleton width={12} height={2} /> :
            <span className={`px-1 py-0.5 rounded text-[10px] font-bold ${
              metrics.monthlyIncomeChange <= 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
            }`}>
              {metrics.monthlyIncomeChange > 0 ? "+" : ""} {metrics.monthlyIncomeChange.toFixed(0)}% MoM
            </span>
          )}
        </div>

          {showLoader ?
            <SingleSkeleton width={20} height={4} />
           : (
            <div className={`text-xl font-black tracking-tight mr-10 ${metrics.monthlyNet >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {formatCurrency(metrics.monthlyNet, currencyKey)}
            </div>
          )}
          <button
            onClick={() => setModalState("income")}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap shadow-sm ${
              isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Add Income
          </button>
        
        <div className={`space-y-1 border-t pt-2 ${borderMuted}`}>
          <div className="text-[11px] flex items-center justify-between">
            <span className={labelText}>Income</span>
            {showLoader ? <SingleSkeleton width={12} height={2} /> : <span className={`font-semibold ${subText}`}>{formatCurrency(metrics.monthlyIncome, currencyKey)}</span>}
          </div>
          <div className="text-[11px] flex items-center justify-between">
            <span className={labelText}>Spent</span>
            {showLoader ? <SingleSkeleton width={12} height={2} /> : <span className={`font-semibold ${subText}`}>{formatCurrency(metrics.monthlyExpense, currencyKey)}</span>}
          </div>
        </div>
      </div>

      {/* CARD 2: MONTHLY SPENDING */}
      <div className={`p-3.5 backdrop-blur-md rounded-xl border border-l-4 border-l-indigo-500 shadow-md shadow-indigo-500/5 flex flex-col justify-center gap-2 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <p className={`${labelText} text-[10px] font-bold uppercase tracking-widest`}>Monthly Spending</p>
          {showLoader ? <SingleSkeleton width={10} height={3} /> : (
            <span className={`px-1 py-0.5 rounded text-[10px] font-bold ${
              metrics.monthlyExpenseChange > 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
            }`}>
              {metrics.monthlyExpenseChange > 0 ? "+" : ""}{metrics.monthlyExpenseChange.toFixed(0)}% MoM
            </span>
          )}
        </div>

          {showLoader ? (
            <SingleSkeleton width={20} height={6} />
          ) : (
            <h2 className="text-xl font-black tracking-tight">{formatCurrency(metrics.monthlyExpense, currencyKey)}</h2>
          )}

        <div className={`border-t pt-2 ${borderMuted}`}>
          <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase tracking-wide">
            <span className={labelText}>Budget Burn</span>
            <span className="text-indigo-500">{metrics.spendingProgress.toFixed(0)}%</span>
          </div>
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? "bg-slate-950" : "bg-slate-100"}`}>
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: showLoader ? "0%" : `${metrics.spendingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* CARD 3: TOP CATEGORY */}
      <div className={`p-3.5 backdrop-blur-md rounded-xl border border-l-4 border-l-orange-500 shadow-md shadow-orange-500/5 flex flex-col justify-center gap-2 sm:col-span-2 lg:col-span-1 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <p className={`${labelText} text-[10px] font-bold uppercase tracking-widest`}>Top Category</p>
          {showLoader ? <SingleSkeleton width={10} height={3} /> : (
            <span className="px-1 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] font-bold rounded">
              {metrics.topCategoryShare.toFixed(0)}% Share
            </span>
          )}
        </div>

        <div className="flex items-center h-7">
          {showLoader ? (
            <SingleSkeleton width={20} height={6} />
          ) : (
            <h2 className="text-xl font-black tracking-tight truncate capitalize">{metrics.topCategory.category ?? "No Data"}</h2>
          )}
        </div>
        
        <div className={`border-t pt-2 text-[11px] ${borderMuted} ${labelText}`}>
          {!showLoader && (
            <div className="flex justify-between items-center gap-2">
              <span className="whitespace-nowrap">Weekly Max:</span>
              <span className={`font-semibold truncate max-w-[65%] ${subText}`}>
                {metrics.largestExpenseThisWeek ? metrics.largestExpenseThisWeek.entity : "None"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderCards;