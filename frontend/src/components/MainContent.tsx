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

// Fixed: Moved lazy imports outside the component body to prevent full recreation on every render cycle
const TrendGraph = React.lazy(() => import("../charts/TrendGraph"));
const DistributionGraph = React.lazy(() => import("../charts/DistributionGraph"));
const OverviewGraph = React.lazy(() => import("../charts/OverviewGraph"));

const MainContent = ({ setModalState }: MainContentPropsType) => {
  const [activeGraph, setActiveGraph] = useState<"bar" | "pie" | "line">("bar");
  const { expenses: transactions, lineData } = useUserData();
  const [page, setPage] = useState(1);
  const { data, isFetching, isError } = useRecentTransactions({ page, PAGE_SIZE });
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);
  const [showLoader, setShowLoader] = useState(false);
  const { isDark } = useThemeContext();

  const weeklySnapshot = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const weekTxns = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= start && txnDate <= now;
    });

    const totalSpent = weekTxns.reduce((acc, txn) => acc + Number(txn.amount), 0);
    const topCategoryMap = weekTxns.reduce<Record<string, number>>((acc, txn) => {
      acc[txn.categoryName ?? "uncategorized"] = (acc[txn.categoryName ?? "uncategorized"] || 0) + Number(txn.amount);
      return acc;
    }, {});

    const topCategory = Object.entries(topCategoryMap).reduce<[string, number] | null>(
      (top, current) => (!top || current[1] > top[1] ? current : top),
      null
    );

    return {
      totalSpent,
      count: weekTxns.length,
      topCategory,
    };
  }, [transactions]);

  useEffect(() => {
    setShowLoader(true);
    let timer = setTimeout(() => {
      setShowLoader(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [transactions]);

  const activeGraphTitle =
    activeGraph === "bar"
      ? "Overview by Category"
      : activeGraph === "pie"
      ? "Distribution Breakdown"
      : "Trend Comparison";

  const activeGraphDescription =
    activeGraph === "bar"
      ? "Compare current month category-wise spending."
      : activeGraph === "pie"
      ? "See how your monthly expenses split up."
      : "Track monthly movement to detect spikes early.";

  // Dynamic Theme Utility Class Mappings
  const containerBg = isDark ? "bg-slate-900/60 border-slate-800 shadow-slate-950/40 text-slate-100" : "bg-white border-slate-200 shadow-slate-200/50 text-slate-800";
  const labelMuted = isDark ? "text-slate-400" : "text-slate-500";
  const titleColor = isDark ? "text-slate-100" : "text-slate-800";
  const borderUtility = isDark ? "border-slate-800" : "border-slate-100";
  const snapshotBoxBg = isDark ? "bg-slate-950/40 border border-slate-800" : "bg-slate-50 border border-slate-100";

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-slate-950" : "bg-slate-50/50"}`}>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        
        {/* KPI Top Cards Row */}
        <HeaderCards setModalState={setModalState} />

        {/* Dynamic Analytics Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Main Graphical Container Block */}
          <div className={`p-4 rounded-xl border shadow-sm lg:col-span-2 flex flex-col justify-between ${containerBg}`}>
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <h2 className={`text-lg font-bold tracking-tight ${titleColor}`}>
                    {activeGraphTitle}
                  </h2>
                  <p className={`mt-0.5 text-xs ${labelMuted}`}>
                    {activeGraphDescription}
                  </p>
                </div>

                {/* Graph Tab Switcher Button Groups */}
                <div className="flex gap-1 bg-slate-950/20 p-1 rounded-lg border border-slate-700/10 self-start sm:self-auto">
                  {(["bar", "pie", "line"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveGraph(type)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all active:scale-95 cursor-pointer capitalize ${
                        activeGraph === type
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                          : `${labelMuted} hover:bg-slate-500/10`
                      }`}
                    >
                      {type === "bar" ? "Overview" : type === "pie" ? "Distribution" : "Trend"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphical Render Output Target */}
              <div className={`p-2 rounded-xl border overflow-hidden ${isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200/40"}`}>
                <Suspense fallback={<GraphSkeleton />}>
                  {activeGraph === "bar" && <OverviewGraph />}
                  {activeGraph === "pie" && <DistributionGraph />}
                  {activeGraph === "line" && <TrendGraph data={lineData} />}
                </Suspense>
              </div>
            </div>
          </div>

          {/* Quick Transaction Action & Summary Sidebar Column */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Quick Add Section */}
            <div className={`p-4 rounded-xl border shadow-sm flex-1 flex flex-col justify-center ${containerBg}`}>
              <h2 className={`mb-2.5 text-sm font-bold uppercase tracking-wider ${labelMuted}`}>
                Add transaction
              </h2>
              <AddTransactionForm setModalState={setModalState} />
            </div>

            {/* Ultra-Compact 7-Day Pulse Summary Card Block */}
            <div className={`p-4 rounded-xl border border-l-4 border-l-purple-500 shadow-sm flex-1 flex flex-col justify-center gap-2 ${containerBg}`}>
              <div className="flex items-center justify-between">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${labelMuted}`}>
                  7-Day Snapshot
                </p>
                <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded">
                  Live Pulse
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className={`p-2 rounded-lg text-center ${snapshotBoxBg}`}>
                  <p className={`text-[10px] font-medium ${labelMuted}`}>Spent</p>
                  <p className="mt-0.5 text-xs font-black text-rose-400 truncate">
                    {showLoader ? <SingleSkeleton width={14} height={4} /> : formatCurrency(weeklySnapshot.totalSpent, currencyKey)}
                  </p>
                </div>
                <div className={`p-2 rounded-lg text-center ${snapshotBoxBg}`}>
                  <p className={`text-[10px] font-medium ${labelMuted}`}>Txns</p>
                  <p className={`mt-0.5 text-xs font-black truncate ${titleColor}`}>
                    {showLoader ? <SingleSkeleton width={8} height={4} /> : weeklySnapshot.count}
                  </p>
                </div>
                <div className={`p-2 rounded-lg text-center ${snapshotBoxBg}`}>
                  <p className={`text-[10px] font-medium ${labelMuted}`}>Top Type</p>
                  <p className="mt-0.5 text-xs font-black text-indigo-400 truncate capitalize">
                    {weeklySnapshot.topCategory ? weeklySnapshot.topCategory[0] : "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Ledger Activity Section Block */}
        <section className={`p-4 rounded-xl border shadow-sm ${containerBg}`}>
          <div className="mb-4">
            <h2 className={`text-lg font-bold tracking-tight ${titleColor}`}>
              Recent activity
            </h2>
            <p className={`text-xs ${labelMuted}`}>
              Latest debits and credits in chronological order.
            </p>
          </div>
          <div className="relative pb-2 mb-19">
            <RecentTransactions data={data} isFetching={isFetching} isError={isError} />
            <div className={`mt-3 pt-3 border-t ${borderUtility}`}>
              <PageNavigation data={data?.transactions || []} isFetching={isFetching} page={page} setPage={setPage} marginFromBottom={0} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainContent;