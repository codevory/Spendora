import type { AppDispatch } from "../../store/store";
import { updateCategory } from "../../store/features/transaction";

import type {
  CategoryPropsType,
  IncomeType,
  TransactionType,
} from "../../types/transactionType";
import {
  setTransactionError,
  setTransactionStatus,
  addTransaction,
} from "../../store/features/transaction";
import {
  addIncomeTransaction,
  setIncomeTransactionError,
  setIncomeTransactionStatus,
} from "../../store/features/incomeTransaction";
import {
  addNewCategory,
  deleteCategory,
} from "../../store/features/transaction";
interface handleAddTransactionFormProps {
  amount: number | "";
  category: string;
  dispatch: AppDispatch;
  transaction: TransactionType;
  e: React.SubmitEvent<HTMLFormElement>;
  success: () => void;
  failed: (val: string) => string;
  setAmount: (val: number | "") => void;
  setPayee: (val: string) => void;
  setCategory: (val: string) => void;
}

type commonTypes = Pick<
  handleAddTransactionFormProps,
  "e" | "failed" | "dispatch"
>;
interface handleAddIncomeTransactionProps extends commonTypes {
  incomeSource: string;
  amount: number | "";
  incomeDate: string;
  success: (val: string) => string;
  setModalState: (val: "closed") => void;
}

type categoryFormCommontypes = Pick<
  handleAddIncomeTransactionProps,
  "dispatch" | "e" | "success" | "failed" | "setModalState"
>;
interface HandleCategoryFormProps extends categoryFormCommontypes {
  category: string;
  categories: CategoryPropsType[];
  setCategory: (val: string) => void;
}

type DeleteCategoryCommonProps = Pick<
  HandleCategoryFormProps,
  "dispatch" | "success" | "failed"
>;
interface HandleDeleteCategoryProps extends DeleteCategoryCommonProps {
  category: CategoryPropsType;
}
export function handleAddExpenseTransaction({
  e,
  setCategory,
  setAmount,
  setPayee,
  success,
  failed,
  amount,
  category,
  dispatch,
  transaction,
}: handleAddTransactionFormProps) {
  e.preventDefault();
  if (amount !== "" && amount <= 0) {
    failed("kindly add valid amount");
    return;
  }
  if (
    category === undefined ||
    category.trim() === "add new" ||
    category.trim() === "select" ||
    category.trim() === ""
  ) {
    return failed("Kindly select category");
  }

  const tId = `txn-${Date.now().toFixed(4)}-${new Date().getMilliseconds().toFixed(2)}`;
  const transactionData: TransactionType = {
    ...transaction,
    transactionId: tId,
  };

  try {
    dispatch(setTransactionStatus("pending"));
    dispatch(setTransactionError(null));
    dispatch(addTransaction(transactionData));
    dispatch(setTransactionStatus("success"));
    console.log(transactionData);
  } catch (err) {
    if (err instanceof Error) {
      dispatch(setTransactionError({ message: err.message, code: 500 }));
    } else {
      dispatch(setTransactionError({ message: "Error Unknown", code: 404 }));
      console.log(err);
    }
    dispatch(setTransactionStatus("failed"));
    //toast message
    failed("Failed to add Expense");
  } finally {
    success();
    setAmount("");
    setPayee("");
    setCategory("select");
  }
}

export function handleAddIncomeTransaction({
  e,
  failed,
  incomeDate,
  amount,
  dispatch,
  incomeSource,
  success,
  setModalState,
}: handleAddIncomeTransactionProps) {
  e.preventDefault();
  if (amount !== "" && amount < 0) return failed("Not valid income amount");
  if (incomeDate === "" || incomeSource === "")
    return failed("Fill all required details");
  const addIncome: IncomeType = {
    amount: amount !== "" ? amount : 0,
    source: incomeSource,
    date: incomeDate,
    transactionId: crypto.randomUUID(),
    createdAt: Date.now(),
    type: "income",
  };

  try {
    dispatch(setIncomeTransactionError(null));
    dispatch(setIncomeTransactionStatus("pending"));
    dispatch(addIncomeTransaction(addIncome));
  } catch (error) {
    if (error instanceof Error) {
      dispatch(
        setTransactionError({
          message: error.message,
          code: 201,
        }),
      );
      failed(error.message);
    }
    console.error(error);
  } finally {
    success("🎉 income added successfully");
  }
  console.log(addIncome);
  setModalState("closed");
}

export function handleAddCategory({
  e,
  categories,
  category,
  success,
  failed,
  dispatch,
  setCategory,
  setModalState,
}: HandleCategoryFormProps) {
  e.preventDefault();
  if (category.trim().length < 3) return failed("kindly type category name");

  const normalized = category.trim().toLowerCase();
  const exists = categories.some((c) => {
    const name = c?.name?.trim().toLowerCase();
    return name === normalized;
  });
  if (exists) {
    return failed("😩Category already exists");
  }
  const newCategory: CategoryPropsType = {
    name: category,
    id: Date.now().toFixed(6),
  };
  try {
    dispatch(addNewCategory(newCategory));
  } catch (error) {
    failed("Failed to add");
    if (error instanceof Error) {
      failed(error.message);
    }
    console.log(error);
  } finally {
    success(`${category} added Successfully`);
    setCategory("");
  }
  setModalState("closed");
}

export function handleDeleteCategory({
  category,
  dispatch,
  success,
  failed,
}: HandleDeleteCategoryProps) {
  const confirmDelete = (val: string) =>
    window.confirm(`Transcactions added in ${val} category will be deleted`);
  try {
    if (confirmDelete(category.name)) {
      dispatch(deleteCategory(category));
      success(`${category.name} category Deleted successfully🎉`);
    } else {
      return failed("cancelled the action");
    }
  } catch (error) {
    if (error instanceof Error) {
      failed(error.message);
    }
    console.error(error);
  }
}

export interface HandleRenameCategoryProps {
  e: React.SubmitEvent<HTMLFormElement>;
  category: CategoryPropsType;
  nextCategoryName: string;
  success: (val: string) => string;
  fail: (val: string) => string;
  setIsLoading: (val: boolean) => void;
  dispatch: AppDispatch;
  setModalState: (val: "income" | "category" | "closed") => void;
}
export function handleRenameCategory({
  e,
  category,
  nextCategoryName,
  success,
  fail,
  setIsLoading,
  dispatch,
  setModalState,
}: HandleRenameCategoryProps) {
  e.preventDefault();
  try {
    setIsLoading(true);
    const trimmedCategoryName = nextCategoryName.trim();

    if (!trimmedCategoryName || trimmedCategoryName.length < 3) {
      return fail("kindly type category name");
    }

    if (!category?.id) {
      return fail("Invalid category");
    }

    dispatch(updateCategory({ ...category, name: trimmedCategoryName }));
    success("Updated successfully");
    setModalState("closed");
  } catch (error) {
    error instanceof Error
      ? fail(error.message)
      : console.error("error : Failed to update category");
  } finally {
    setIsLoading(false);
  }
}
