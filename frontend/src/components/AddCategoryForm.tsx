import toast from "react-hot-toast";
import { useState } from "react";
import { handleAddCategoryDB } from "../utils/helperFunctions/handleFormActions";
import { useAddCategoryMutation } from "../store/features/transactionApi";

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
  setIsSubmitting: (val: boolean) => void;
  isSubmitting: boolean;
};

const AddNewCategoryForm = ({
  setModalState,
  buttonContent,
  formHeading,
  categoryState,
  handleCategoryState,
  handleFormSubmit,
  setIsSubmitting,
  isSubmitting
}: CategoryFormProps) => {
  const [category, setCategory] = useState<string>("");

  const success = (message: string) => toast.success(message);
  const failed = (message: string) => toast.error(message);

  const onSubmit = handleAddCategoryDB;
  const categoryValue = categoryState !== undefined ? categoryState : category;
  const [addCategoryTxn] = useAddCategoryMutation();

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
            success: success,
            failed: failed,
            setCategory: setCategory,
            setModalState: setModalState,
            category: categoryValue,
            setIsSubmitting: setIsSubmitting
            ,
            addCategoryTxn,
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
          disabled={isSubmitting}
        >
          {isSubmitting ? buttonContent ?? "Add" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddNewCategoryForm;
