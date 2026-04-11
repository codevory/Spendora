import type {
  CategoryPropsType,
  TransactionType,
} from "../types/transactionType";
import EmptyState from "./EmptyState";
import { useAppDispatch, useAppSelector } from "../store/store";
import { deleteCategory } from "../store/features/transaction";
import toast from "react-hot-toast";
interface DisplayCategoriesPropsType {
  data: TransactionType[];
}
const DisplayAvailableCategories = ({ data }: DisplayCategoriesPropsType) => {
  if (!data.length) return <EmptyState content={"No data available"} />;
  const categories = useAppSelector((state) => state.transaction.categories);
  const dispatch = useAppDispatch();
  const confirmDelete = (val: string) =>
    window.confirm(`are you sure to delete ${val} category`);
  const success = (mesg: string) => toast.success(mesg);
  const fail = (msg: string) => toast.error(msg);
  function handleDelete(category: CategoryPropsType) {
    try {
      if (confirmDelete(category.name)) {
        dispatch(deleteCategory(category));
        success(`${category.name} category Deleted successfully🎉`);
      } else {
        return fail("cancelled the action");
      }
    } catch (error) {
      if (error instanceof Error) {
        fail(error.message);
      }
      console.error(error);
    }
  }
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((txn) => {
          const usageCount = data.filter(
            (item) => item.category === txn.name,
          ).length;

          return (
            <article
              key={txn.id}
              className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow-md transition hover:border-slate-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Category
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-100">
                    {txn.name}
                  </h3>
                </div>

                <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
                  {usageCount} txns
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">
                  Used in your transaction history
                </p>
                <button
                  className="rounded-xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/25 active:scale-95"
                  onClick={() => handleDelete(txn)}
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default DisplayAvailableCategories;
