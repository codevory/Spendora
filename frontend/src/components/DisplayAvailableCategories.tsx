import type {
  CategoryPropsType,
} from "../types/transactionType";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import EmptyState from "./EmptyState";
import toast from "react-hot-toast";
import { handleDeleteCategory } from "../utils/helperFunctions/handleFormActions";
import ModalBox from "./ModalBox";
import AddNewCategoryForm from "./AddCategoryForm";
import { handleRenameCategory } from "../utils/helperFunctions/handleFormActions";
import useThemeContext from "../Hooks/useThemeContext";
import { NavIcon } from "./icons/UseIcon";
import { useDeleteCategoryMutation, useRenameCategoryMutation } from "../store/features/transactionApi";
import Loader from "./Loader";
import SingleSkeleton from "./SingleSkeleton";
import { useGetCategories } from "../Hooks/useUserData";

const DisplayAvailableCategories = () => {
  const [modalState, setModalState] = useState<"income" | "category" | "closed">("closed");
  const [category, setCategory] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryPropsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // const { data: categoryResponse, isFetching, isLoading: loadingResp } = useGetCategoriesQuery();
  const { data, isError, isFetching} = useGetCategories()
  const [deleteCategoryTxn, { isLoading: isLoadingDelete }] = useDeleteCategoryMutation();
  const [renameCategoryTxn] = useRenameCategoryMutation();

  const success = (mesg: string) => toast.success(mesg);
  const fail = (msg: string) => toast.error(msg);
  const { isDark } = useThemeContext();
  const onDelete = handleDeleteCategory;

  const categories = useMemo(() => {
    const categoryData = data?.categories ?? []
    return categoryData
  },[data])

  // Dynamic Theme Styling Utilities
  const cardBg = isDark 
    ? "bg-slate-900/60 backdrop-blur-md border-slate-800 shadow-xl shadow-slate-950/20 text-slate-100" 
    : "bg-white border-slate-200/80 shadow-md shadow-slate-200/50 text-slate-800";
  const labelMuted = isDark ? "text-slate-500" : "text-slate-400";
  const descText = isDark ? "text-slate-400" : "text-slate-500";
  const titleColor = isDark ? "text-slate-200" : "text-slate-800";
  const pillBg = isDark ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10" : "bg-indigo-50 text-indigo-600";
  const actionBorder = isDark ? "border-slate-800/80" : "border-slate-100";

  if (isLoadingDelete || isSubmitting || isFetching || isLoading) {
    return <Loader />;
  }
  
  if (!isFetching && (!data || data.categories.length === 0)) {
    return <EmptyState content={"No data available"} />;
  }

  if(isError){
    fail("Failed to get categories")
    return <EmptyState content="oops! an error occured, we are working on it" />
  }
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isFetching
          ? // Render a clean micro-grid skeleton matrix during query loads
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border border-l-4 border-l-slate-600 flex flex-col gap-3 ${cardBg}`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <SingleSkeleton width={16} height={3} />
                    <SingleSkeleton width={28} height={5} />
                  </div>
                  <SingleSkeleton width={14} height={5} />
                </div>
                <div className="flex justify-between items-center mt-1 pt-2 border-t border-transparent">
                  <SingleSkeleton width={36} height={4} />
                  <SingleSkeleton width={16} height={6} />
                </div>
              </div>
            ))
          : categories.map((cat) => {              
              return (
                <article
                  key={cat.id}
                  className={`p-3.5 rounded-xl border border-l-4 border-l-indigo-500 flex flex-col justify-between gap-2.5 transition-all duration-300 hover:scale-[1.005] hover:border-indigo-500 ${cardBg}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${labelMuted}`}>
                          Category
                        </p>
                        <div className="flex gap-1.5 items-center mt-0.5">
                          <h3 className={`text-base font-black tracking-tight max-w-35 truncate capitalize ${titleColor}`}>
                            {cat.name}
                          </h3>
                          <button
                            onClick={() => {
                              setSelectedCategory(cat);
                              setCategory(cat.name);
                              setModalState("category");
                            }}
                            className="active:scale-95 cursor-pointer opacity-70 hover:opacity-100 transition-opacity p-0.5"
                          >
                            <NavIcon name="pencil" isDarkMode={isDark} size={18} />
                          </button>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold shadow-sm whitespace-nowrap ${pillBg}`}>
                        {cat.transactionCount} {cat.transactionCount === 1 ? 'txn' : 'txns'}
                      </span>
                    </div>

                    <p className={`text-[11px] font-medium mt-1 ${descText}`}>
                      Used in your transaction ledger
                    </p>
                  </div>

                  <div className={`flex items-center justify-end border-t pt-2 mt-1 ${actionBorder}`}>
                    <button
                      className="rounded-lg px-3 py-1 text-xs font-bold text-rose-400 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition active:scale-95 cursor-pointer shadow-sm"
                      onClick={() =>
                        onDelete({
                          category: cat,
                          success: success,
                          failed: fail,
                          deleteCategoryTxn,
                          setIsSubmitting: setIsSubmitting
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
      </div>

      {modalState === "category" && selectedCategory
        ? createPortal(
            <ModalBox
              onClose={() => {
                setModalState("closed");
                setSelectedCategory(null);
                setCategory("");
              }}
              form={
                <AddNewCategoryForm
                  setModalState={() => setModalState("closed")}
                  buttonContent={"Rename"}
                  formHeading="Rename Category"
                  categoryState={category}
                  setIsSubmitting={setIsSubmitting}
                  isSubmitting={isSubmitting}
                  handleCategoryState={setCategory}
                  handleFormSubmit={(e, categoryName) =>
                    handleRenameCategory({
                      e,
                      category: selectedCategory,
                      nextCategoryName: categoryName,
                      setIsLoading: setIsLoading,
                      success: success,
                      fail: fail,
                      setModalState: setModalState,
                      setIsSubmitting: setIsSubmitting,
                      renameCategoryTxn,
                    })
                  }
                />
              }
            />,
            document.body
          )
        : null}
    </div>
  );
};

export default DisplayAvailableCategories;