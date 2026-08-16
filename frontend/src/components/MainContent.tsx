import React, { Suspense, useEffect, useMemo, useState } from "react";
import AddTransactionForm from "../components/AddTransactionForm";
import RecentTransactions from "../components/RecentTransactions";
import { useRecentTransactions, useUserData } from "../Hooks/useUserData";
import { useAppSelector } from "../store/store";
import HeaderCards from "./HeaderCards";
import { formatCurrency } from "../utils/currency";
import GraphSkeleton from "./GraphSkeleton";
import PageNavigation, { PAGE_SIZE } from "./PageNavigation";
import SingleSkeleton from "./SingleSkeleton";
import useThemeContext from "../Hooks/useThemeContext";

interface MainContentPropsType {
  setModalState: (val: "income" | "category") => void;
}

const TrendGraph = React.lazy(() => import("../charts/TrendGraph"));
const DistributionGraph = React.lazy(
  () => import("../charts/DistributionGraph"),
);
const OverviewGraph = React.lazy(() => import("../charts/OverviewGraph"));

// --- Extracted Reusable Theme Generators ---
const getThemeStyles = (isDark: boolean) => ({
  pageWrapper: isDark ? "bg-slate-950" : "bg-slate-50/50",
  cardContainer: isDark
    ? "bg-slate-900 border-slate-800 shadow-slate-950/50 text-slate-100"
    : "bg-white border-slate-200 shadow-slate-200/50 text-slate-800",
  graphCanvasBg: isDark
    ? "bg-slate-950/60 border-slate-800/80"
    : "bg-slate-50/80 border-slate-200/60",
  snapshotBoxBg: isDark
    ? "bg-slate-950/50 border-slate-800"
    : "bg-slate-50 border-slate-100",
  titleColor: isDark ? "text-slate-100" : "text-slate-800",
  labelMuted: isDark ? "text-slate-400" : "text-slate-500",
  borderUtility: isDark ? "border-slate-800" : "border-slate-100",
});

const GRAPH_TYPES = [
  { id: "bar", label: "Overview" },
  { id: "pie", label: "Distribution" },
  { id: "line", label: "Trend" },
] as const;

const MainContent = ({ setModalState }: MainContentPropsType) => {
  const [activeGraph, setActiveGraph] = useState<"bar" | "pie" | "line">("bar");
  const [page, setPage] = useState(1);
  const [showLoader, setShowLoader] = useState(false);

  const { isDark } = useThemeContext();
  const theme = getThemeStyles(isDark);

  const {
    expenses: transactions,
    lineData,
    expenseError,
    expenseLoading,
  } = useUserData();

  const { data, isFetching, isError } = useRecentTransactions({
    page,
    PAGE_SIZE,
  });

  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);

  const weeklySnapshot = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const weekTxns = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= start && txnDate <= now;
    });

    const totalSpent = weekTxns.reduce(
      (acc, txn) => acc + Number(txn.amount),
      0,
    );

    const topCategoryMap = weekTxns.reduce<Record<string, number>>(
      (acc, txn) => {
        const category = txn.categoryName ?? "uncategorized";
        acc[category] = (acc[category] || 0) + Number(txn.amount);
        return acc;
      },
      {},
    );

    const topCategory = Object.entries(topCategoryMap).reduce<
      [string, number] | null
    >((top, current) => (!top || current[1] > top[1] ? current : top), null);

    return {
      totalSpent,
      count: weekTxns.length,
      topCategory,
    };
  }, [transactions]);

  useEffect(() => {
    if (expenseError) {
      setShowLoader(false);
      return;
    }

    let timer: NodeJS.Timeout;
    if (expenseLoading) {
      setShowLoader(true);
      timer = setTimeout(() => setShowLoader(false), 200);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [expenseLoading, expenseError]);

  const activeGraphTitle =
    activeGraph === "bar"
      ? "Analyse Spending"
      : activeGraph === "pie"
        ? "Expense Distribution"
        : "Expense Trend";

  const activeGraphDescription =
    activeGraph === "bar"
      ? "Compare current month category-wise spending."
      : activeGraph === "pie"
        ? "See how your monthly expenses split up."
        : "Track monthly movement to detect spikes early.";

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${theme.pageWrapper}`}
    >
      <div className="max-w-8xl mx-auto px-4 py-6 space-y-4">
        {/* KPI Top Cards Row */}
        <HeaderCards setModalState={setModalState} />

        {/* Dynamic Analytics Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Graphical Container Block */}
          <div
            className={`p-4 rounded-xl border shadow-sm lg:col-span-2 flex flex-col justify-between ${theme.cardContainer}`}
          >
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <h2
                    className={`text-lg font-bold tracking-tight ${theme.titleColor}`}
                  >
                    {activeGraphTitle}
                  </h2>
                  <p className={`mt-0.5 text-xs ${theme.labelMuted}`}>
                    {activeGraphDescription}
                  </p>
                </div>

                {/* Graph Switcher Tab */}
                <div className="flex gap-1 bg-slate-950/20 p-1 rounded-lg border border-slate-700/10 self-start sm:self-auto">
                  {GRAPH_TYPES.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveGraph(id)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all active:scale-95 cursor-pointer capitalize ${
                        activeGraph === id
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                          : `${theme.labelMuted} hover:bg-slate-500/10`
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graph Render Box */}
              <div
                className={`p-2 rounded-xl border overflow-hidden ${theme.graphCanvasBg}`}
              >
                <Suspense fallback={<GraphSkeleton />}>
                  {activeGraph === "bar" && <OverviewGraph />}
                  {activeGraph === "pie" && <DistributionGraph />}
                  {activeGraph === "line" && <TrendGraph data={lineData} />}
                </Suspense>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Add Transaction Section */}
            <div
              className={`p-4 rounded-xl border shadow-sm flex-1 flex flex-col justify-center ${theme.cardContainer}`}
            >
              <h2
                className={`mb-2.5 text-xs font-bold uppercase tracking-wider ${theme.labelMuted}`}
              >
                Add transaction
              </h2>
              <AddTransactionForm setModalState={setModalState} />
            </div>

            {/* 7-Day Pulse Summary Card */}
            <div
              className={`p-4 rounded-xl border border-l-4 border-l-blue-500 shadow-sm flex-1 flex flex-col justify-center gap-2 ${theme.cardContainer}`}
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest ${theme.labelMuted}`}
                >
                  7-Day Snapshot
                </p>
                <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded">
                  Live Pulse
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-1">
                {/* Total Spent Box */}
                <div
                  className={`p-2 rounded-lg text-center ${theme.snapshotBoxBg}`}
                >
                  <p className={`text-[10px] font-medium ${theme.labelMuted}`}>
                    Spent
                  </p>
                  {showLoader ? (
                    <SingleSkeleton width={12} height={4} />
                  ) : (
                    <p className="mt-0.5 text-xs font-black text-rose-400 truncate">
                      {formatCurrency(weeklySnapshot.totalSpent, currencyKey) ??
                        0}
                    </p>
                  )}
                </div>

                {/* Total Count Box */}
                <div
                  className={`p-2 rounded-lg text-center ${theme.snapshotBoxBg}`}
                >
                  <p className={`text-[10px] font-medium ${theme.labelMuted}`}>
                    Txns
                  </p>
                  {showLoader ? (
                    <SingleSkeleton width={12} height={4} />
                  ) : (
                    <p
                      className={`mt-0.5 text-xs font-black truncate ${theme.titleColor}`}
                    >
                      {weeklySnapshot.count ?? 0}
                    </p>
                  )}
                </div>

                {/* Top Category Box */}
                <div
                  className={`p-2 rounded-lg text-center ${theme.snapshotBoxBg}`}
                >
                  <p className={`text-[10px] font-medium ${theme.labelMuted}`}>
                    Top Type
                  </p>
                  {showLoader ? (
                    <SingleSkeleton width={12} height={4} />
                  ) : (
                    <p className="mt-0.5 text-xs font-black text-indigo-400 truncate capitalize">
                      {weeklySnapshot.topCategory
                        ? weeklySnapshot.topCategory[0]
                        : "None"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ledger Activity Section */}
        <section
          className={`p-4 rounded-xl border shadow-sm ${theme.cardContainer}`}
        >
          <div className="mb-4">
            <h2
              className={`text-lg font-bold tracking-tight ${theme.titleColor}`}
            >
              Recent activity
            </h2>
            <p className={`text-xs ${theme.labelMuted}`}>
              Latest debits and credits in chronological order.
            </p>
          </div>
          <div className="relative pb-2">
            <RecentTransactions
              data={data}
              isFetching={isFetching}
              isError={isError}
            />
            <div className={`mt-3 pt-3 border-t ${theme.borderUtility}`}>
              <PageNavigation
                data={data?.transactions || []}
                isFetching={isFetching}
                page={page}
                setPage={setPage}
                marginFromBottom={0}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainContent;
