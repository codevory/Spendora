import DistributionGraph from "../charts/DistributionGraph";
import TrendGraph from "../charts/TrendGraph";
import Layout from "../components/Layout";
import MonthlyInsights from "../components/MonthlyInsights";
import RecentTransactions from "../components/RecentTransactions";
import { useUserData } from "../Hooks/useUserData";

interface AnalyticsPropsType {
  onToggle: () => void;
  isOpen: boolean;
}
const AnalyticsPage = ({ onToggle, isOpen }: AnalyticsPropsType) => {
  const { analysisData } = useUserData();
  return (
    <div className="bg-main">
      <Layout onToggle={onToggle} isOpen={isOpen}>
        <div className="container-main space-y-6">
          <section className="rounded-2xl border border-slate-700 bg-linear-to-r from-slate-800 to-slate-900 p-4 md:p-6 shadow-lg">
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
                <TrendGraph data={analysisData} />
              </div>
            </div>

            <div className="max-h-130 overflow-y-auto xl:col-span-2">
              <RecentTransactions />
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
                <DistributionGraph />
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
