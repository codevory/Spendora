import toast from "react-hot-toast";
import { useState } from "react";
import { handleAddCategoryDB } from "../utils/helperFunctions/handleFormActions";
import { useAddCategoryMutation } from "../store/features/transactionApi";

type CategoryFormProps = {
  setModalState: (val: "closed" | "income" | "category") => void;
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
  isSubmitting,
}: CategoryFormProps) => {
  const [category, setCategoryName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const success = (message: string) => toast.success(message);
  const failed = (message: string) => toast.error(message);

  const onSubmit = handleAddCategoryDB;
  const categoryValue = categoryState !== undefined ? categoryState : category;
  const [addCategoryTxn] = useAddCategoryMutation();

  const buttonText = buttonContent ?? "Create";
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
            setCategory: setCategoryName,
            setModalState: setModalState,
            category: categoryValue,
            setIsSubmitting: setIsSubmitting,
            addCategoryTxn: addCategoryTxn,
            setError,
            setIsLoading: setIsLoading,
          });
        }}
        className="form flex flex-col gap-2 "
      >
        <div className=" flex flex-col">
          <label className="text-accent label text-sm font-medium mb-1">
            name
          </label>
          <input
            className="input"
            type="text"
            value={categoryValue.trimStart()}
            onChange={(e) =>
              handleCategoryState !== undefined
                ? handleCategoryState(e.target.value)
                : setCategoryName(e.target.value)
            }
            required
          />
        </div>

        <div className="flex gap-5 items-center">
          <button
            className="btn-primary w-30 h-10 font-bold active:scale-95"
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Creating.." : buttonText}
          </button>

          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default AddNewCategoryForm;
