import { useMemo, useState } from "react";
import AddTransactionForm from "../components/AddTransactionForm";
import RecentTransactions from "../components/RecentTransactions";
import { useUserData } from "../Hooks/useUserData";
import { useAppSelector } from "../store/store";
import HeaderCards from "./HeaderCards";
import TrendGraph from "../charts/TrendGraph";
import DistributionGraph from "../charts/DistributionGraph";
import OverviewGraph from "../charts/OverviewGraph";

interface MainContentPropsType {
  setModalState: (val: "income" | "category") => void;
}

const MainContent = ({ setModalState }: MainContentPropsType) => {
  const [activeGraph, setActiveGraph] = useState<"bar" | "pie" | "line">("bar");
  const transactions = useAppSelector(
    (state) => state.transaction.transactions,
  );
  const { lineData } = useUserData();

  const weeklySnapshot = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const weekTxns = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= start && txnDate <= now;
    });

    const totalSpent = weekTxns.reduce((acc, txn) => acc + txn.amount, 0);
    const topCategoryMap = weekTxns.reduce<Record<string, number>>(
      (acc, txn) => {
        acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
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

  const activeGraphTitle =
    activeGraph === "bar"
      ? "Overview by Category"
      : activeGraph === "pie"
        ? "Distribution Breakdown"
        : "Trend Comparison";

  const activeGraphDescription =
    activeGraph === "bar"
      ? "Compare current month category-wise spending in a single view."
      : activeGraph === "pie"
        ? "See how your total monthly expenses are split across categories."
        : "Track month-over-month movement to detect spending spikes early.";

  return (
      <div className="bg-main">
        <div className="container-main space-y-6">
          <HeaderCards setModalState={setModalState} />

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.9fr_0.7fr]">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 md:p-5 shadow-lg xl:col-span-2">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    {activeGraphTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {activeGraphDescription}
                  </p>
                </div>

                <div className="flex h-auto flex-wrap justify-start gap-2 p-0 lg:justify-end">
                  <button
                    onClick={() => setActiveGraph("bar")}
                    className={`${activeGraph === "bar" ? "active-graphTab" : ""} graph-buttons h-9 w-28 rounded-lg text-sm`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveGraph("pie")}
                    className={`${activeGraph === "pie" ? "active-graphTab" : ""} graph-buttons h-9 w-28 rounded-lg text-sm`}
                  >
                    Distribution
                  </button>
                  <button
                    onClick={() => setActiveGraph("line")}
                    className={`${activeGraph === "line" ? "active-graphTab" : ""} graph-buttons h-9 w-24 rounded-lg text-sm`}
                  >
                    Trend
                  </button>
                </div>
              </div>

              <div className="analysis-container m-0 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/60 p-2">
                {activeGraph === "pie" ? (
                  <DistributionGraph />
                ) : activeGraph === "bar" ? (
                  <OverviewGraph />
                ) : (
                  <TrendGraph data={lineData} />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-auto min-w-0 w-full rounded-2xl border border-slate-700 bg-slate-800/70 p-4 shadow-lg md:p-5">
                <h2 className="mb-3 text-lg font-semibold text-slate-100">
                  Add transaction
                </h2>
                <AddTransactionForm setModalState={setModalState} />
              </div>

              <div className="rounded-2xl border border-slate-700 bg-linear-to-br from-slate-800 to-slate-900 p-4 shadow-lg">
                <p className="text-xs tracking-[0.22em] text-slate-400">
                  7 DAY SNAPSHOT
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-100">
                  Weekly spending pulse
                </h3>

                <div className="mt-3 grid grid-cols-1 gap-3">
                  <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3">
                    <p className="text-xs text-slate-400">Total spent</p>
                    <p className="mt-1 text-xl font-bold text-rose-300">
                      ₹ {weeklySnapshot.totalSpent.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3">
                    <p className="text-xs text-slate-400">Transactions</p>
                    <p className="mt-1 text-xl font-bold text-slate-100">
                      {weeklySnapshot.count}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3">
                    <p className="text-xs text-slate-400">Top category</p>
                    <p className="mt-1 text-base font-semibold text-indigo-300">
                      {weeklySnapshot.topCategory
                        ? weeklySnapshot.topCategory[0]
                        : "No data yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 md:p-5 shadow-lg">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-slate-100">
                Recent activity
              </h2>
              <p className="text-sm text-slate-400">
                Latest debits and credits in chronological order.
              </p>
            </div>
            <div className="transactions-box h-72 overflow-y-auto">
              <RecentTransactions />
            </div>
          </section>
        </div>
      </div>
  );
};

export default MainContent;
