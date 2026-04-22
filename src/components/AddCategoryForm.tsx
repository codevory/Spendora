import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useState } from "react";
import { handleAddCategory } from "../utils/helperFunctions/hanldeFormActions";

type CategoryFormProps = {
  setModalState: (val: "closed") => void;
  buttonContent?: string;
  formHeading?: string;
  categoryState?: string;
  handleCategoryState?: (val: string) => void;
  handleFormSubmit?: (
    e: React.SubmitEvent<HTMLFormElement>,
    categoryName: string,
  ) => void;
};

const AddNewCategoryForm = ({
  setModalState,
  buttonContent,
  formHeading,
  categoryState,
  handleCategoryState,
  handleFormSubmit,
}: CategoryFormProps) => {
  const [category, setCategory] = useState<string>("");
  const categories = useAppSelector((state) => state.transaction.categories);

  const dispatch = useAppDispatch();
  const success = (message: string) => toast.success(message);
  const failed = (message: string) => toast.error(message);

  const onSubmit = handleAddCategory;
  const categoryValue = categoryState !== undefined ? categoryState : category;

  return (
    <div className="flex flex-col gap-2 text-slate-100">
      <h2 className="text-lg font-semibold">
        {formHeading ?? "Add New Category"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (handleFormSubmit) {
            handleFormSubmit(e, categoryValue);
            return;
          }

          onSubmit({
            e: e,
            dispatch: dispatch,
            success: success,
            failed: failed,
            setCategory: setCategory,
            setModalState: setModalState,
            categories: categories,
            category: categoryValue,
          });
        }}
        className="form flex flex-col gap-2 "
      >
        <div className=" flex flex-col">
          <label className="text-accent label text-sm font-medium">
            category
          </label>
          <input
            className="input"
            type="text"
            value={categoryValue}
            onChange={(e) =>
              handleCategoryState !== undefined
                ? handleCategoryState(e.target.value)
                : setCategory(e.target.value)
            }
            required
          />
        </div>

        <button
          className="btn-primary w-20 h-11 font-semibold active:scale-95"
          type="submit"
        >
          {buttonContent ?? "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddNewCategoryForm;
