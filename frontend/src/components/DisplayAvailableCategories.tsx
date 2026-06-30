import type {
  CategoryPropsType,
  expenseTranscationTypes
} from "../types/transactionType";
import { useState } from "react";
import { createPortal } from "react-dom";
import EmptyState from "./EmptyState";
import { useAppDispatch, useAppSelector } from "../store/store";
import toast from "react-hot-toast";
import {handleDeleteCategory } from "../utils/helperFunctions/hanldeFormActions";
import ModalBox from "./ModalBox";
import AddNewCategoryForm from "./AddCategoryForm";
import { handleRenameCategory } from "../utils/helperFunctions/hanldeFormActions";
import useThemeContext from "../Hooks/useThemeContext";
import { NavIcon } from "./icons/UseIcon";

type expenseDataType = {
  data:expenseTranscationTypes[]
}
const DisplayAvailableCategories = ({ data }:expenseDataType) => {
  const [modalState, setModalState] = useState<"income" | "category" | "closed">("closed");
  const [category, setCategory] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryPropsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState<boolean>(false)

  console.log(isLoading)
  
  const dispatch = useAppDispatch();
  const { expenseTransactions, categories,incomeTransactions } = useAppSelector((state) => state.transaction)
  console.log(expenseTransactions)
  const status = useAppSelector((state) => state.transaction.status)

  const success = (mesg: string) => toast.success(mesg);
  const fail = (msg: string) => toast.error(msg);
console.log(status)


  const { isDark } = useThemeContext();
  const onDelete = handleDeleteCategory;

  
  if (!data || !categories) return <EmptyState content={"No data available"} />;
console.log(categories.length)
console.log(data)
console.log(incomeTransactions)
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat) => {
          const usageCount = data.filter(
            (item) => item.categoryId === cat.id,
          ).length;
          return (
            <article
              key={cat.id}
              className="category-card rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow-md transition hover:border-slate-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Category
                  </p>
                  <div className="flex gap-2 items-center">
                    <h3 className="mt-1 text-lg font-semibold text-slate-200">
                      {cat.name}
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategory(cat.name);
                        setModalState("category");
                      }}
                      className="active:scale-95 cursor-pointer"
                    >
                      {
                     <NavIcon name="pencil" isDarkMode={isDark}  size={25}/>
                      }
                    </button>
                  </div>
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
                  className="category-delete rounded-xl px-4 py-2 text-sm font-semibold text-rose-300 transition active:scale-95"
                  onClick={() =>
                    onDelete({
                      category: cat,
                      success: success,
                      failed: fail,
                      dispatch: dispatch,
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
                  buttonContent={isSubmitting ? "Saving.." : "Save"}
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
                      dispatch: dispatch,
                      setIsLoading: setIsLoading,
                      success: success,
                      fail: fail,
                      setModalState: setModalState,
                      setIsSubmitting:setIsSubmitting
                    })
                  }
                />
              }
            />,
            document.body,
          )
        : null}
      {/* {isLoading ? <Loader /> : null} */}
    </div>
  );
};

export default DisplayAvailableCategories;
