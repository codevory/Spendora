import GraphSkeleton from "../components/GraphSkeleton";
import Layout from "../components/Layout";
import MonthlyInsights from "../components/MonthlyInsights";
import RecentTransactions from "../components/RecentTransactions";
import { useRecentTransactions, useUserData } from "../Hooks/useUserData";
import React, { Suspense,useState } from "react";
import PageNavigation from "../components/PageNavigation";

interface AnalyticsPropsType {
  onToggle: () => void;
  isOpen: boolean;
}
const DistributionGraph = React.lazy(() => import("../charts/DistributionGraph"));
const TrendGraph = React.lazy(() => import("../charts/TrendGraph"));

const AnalyticsPage = ({ onToggle, isOpen }: AnalyticsPropsType) => {
  const { analysisData } = useUserData();
  const PAGE_SIZE = 7;
   const [page, setPage] = useState<number>(1);
   const { data, isFetching, isError } = useRecentTransactions({page,PAGE_SIZE})
  
  return (
    <div className="bg-main">
      <Layout onToggle={onToggle} isOpen={isOpen}>
        <div className="container-main space-y-6">
          <section className="analytics-hero rounded-2xl p-4 md:p-6 shadow-lg">
            <p className="text-xs tracking-wider text-slate-400">
              SPENDORA ANALYTICS
            </p>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-100">
              Financial Pulse
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-300">
              Monitor income vs expense trends, category breakdown, and monthly
              performance insights in one place.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <div className="card xl:col-span-3">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-slate-100">
                  Income vs Expense Trend
                </h2>
                <p className="text-xs text-slate-400">
                  Current month movement compared over time
                </p>
              </div>
              <div className="overflow-x-auto">
                <Suspense fallback={<GraphSkeleton />}>
                  <TrendGraph data={analysisData} />
                </Suspense>
              </div>
            </div>


             <div className="rounded-2xl xl:col-span-2 border border-slate-700 bg-slate-800/70 p-4 md:p-5 shadow-lg">
                <h2 className="recent-transactions-title text-lg font-semibold mb-4">
                 Recent Transactions
                </h2>
            <div className="xl:col-span-2 mb-4 rounded-b-2xl  relative transaction-box">
              <RecentTransactions data={data} isError={isError} isFetching={isFetching} />
              <PageNavigation data={data?.transactions ?? []} isFetching={isFetching} page={page} setPage={setPage} marginFromBottom={0} />
            </div>

             </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <div className="card xl:col-span-2">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-slate-100">
                  Category Distribution
                </h2>
                <p className="text-xs text-slate-400">
                  How your spending is split this month
                </p>
              </div>
              <div className="flex items-center justify-center overflow-x-auto">
                <Suspense fallback={<GraphSkeleton />}>
                  <DistributionGraph />
                </Suspense>
              </div>
            </div>

            <div className="xl:col-span-3">
              <MonthlyInsights />
            </div>
          </section>
        </div>
      </Layout>
    </div>
  );
};

export default AnalyticsPage;
