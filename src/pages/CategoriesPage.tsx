import DisplayAvailableCategories from "../components/DisplayAvailableCategories";
import Layout from "../components/Layout";
import { useAppSelector } from "../store/store";

interface CategoriesPagePropsType {
  onToggle: () => void;
  isOpen: boolean;
}
const CategoriesPage = ({ onToggle, isOpen }: CategoriesPagePropsType) => {
  const data = useAppSelector((state) => state.transaction.transactions);
  const categoryCount = useAppSelector(
    (state) => state.transaction.categories.length,
  );
  const totalTransactions = data.length;

  return (
    <Layout onToggle={onToggle} isOpen={isOpen} isLoggedin={true}>
      <div className="bg-main min-h-[calc(100vh-4rem)] p-4 md:p-6">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-700 bg-linear-to-r from-slate-800 to-slate-900 p-4 md:p-6 shadow-lg">
            <p className="text-xs tracking-[0.3em] text-slate-400">
              CATEGORIES
            </p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
                  Manage spending categories
                </h1>
                <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-300">
                  Review the categories used in your transactions and clean up
                  anything you no longer need.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Categories
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">
                    {categoryCount}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Transactions
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">
                    {totalTransactions}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 col-span-2 sm:col-span-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Action
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-100">
                    Delete unused labels
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 md:p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">
                    Available categories
                  </h2>
                  <p className="text-sm text-slate-400">
                    Categories linked to your current transaction data.
                  </p>
                </div>
              </div>

              <DisplayAvailableCategories data={data} />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 md:p-5 shadow-lg">
                <h2 className="text-lg font-semibold text-slate-100">
                  Category tips
                </h2>
                <div className="mt-3 space-y-3 text-sm text-slate-300">
                  <p className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                    Keep only categories you actively use so your charts stay
                    readable.
                  </p>
                  <p className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                    Rename or regroup spending patterns in your entry forms
                    before they spread across reports.
                  </p>
                  <p className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                    Remove stale categories to keep monthly insights focused and
                    easier to scan.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
