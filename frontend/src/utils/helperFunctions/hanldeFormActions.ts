import type { AppDispatch } from "../../store/store";
import { useState } from "react";

import type {
  CategoryPropsType,
  CategoryPropsTypeDB,
  expenseTranscationTypes,
  IncomeTransactionTypes,
} from "../../types/transactionType";
import {
  addCategoryThunk,
  addExpense,
  renameCategory,
  deleteCategoryThunk,
  addIncomeThunk,
  Backend_Url
} from "../../store/features/transaction";
import { useDebounce } from "../../Hooks/useDebounce";


interface handleAddTransactionFormProps {
  amount: number | "";
  category: string;
  dispatch: AppDispatch;
  transaction: expenseTranscationTypes;
  e: React.SubmitEvent<HTMLFormElement>;
  success: () => void;
  failed: (val: string) => string;
  setAmount: (val: number | "") => void;
  setPayee: (val: string) => void;
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
  setCategory: (val: string) => void;
}

type DeleteCategoryCommonProps = Pick<
  HandleCategoryFormProps,
  "dispatch" | "success" | "failed"
>;
interface HandleDeleteCategoryProps extends DeleteCategoryCommonProps {
  category: CategoryPropsType;
}

export async function handleAddExpenseTransaction({
  e,
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
  if (typeof amount !== "number" || amount <= 0) {
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
  const transactionData: expenseTranscationTypes = {
    ...transaction,
    transactionId: tId,
  };

dispatch(addExpense(transactionData))
    .unwrap()
    .then(() => {
     success()
    })
    .catch((err) => {
     failed(err || "Failed to add Expense")
    })
    .finally(() => {
     setAmount(10)
     setPayee("")
    })
}

export async function handleAddIncomeTransaction({
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
  const incomeData: IncomeTransactionTypes = {
    id:1,
    amount: amount !== "" ? amount : 0,
    source: incomeSource,
    date: incomeDate,
    transactionId: crypto.randomUUID(),
    createdAt: Date.now(),
    type: "income",
  };
  
  useDebounce({func:addTxn,delay:400})
  function addTxn(){
    dispatch(addIncomeThunk(incomeData))
    .unwrap()
    .then(() => {
      success("income added successfully🎉")
    })
    .catch((err) => {
      failed(err ?? "Failed to add Income")
    })
    .finally(() => {
     setModalState("closed")
    })
  }
 
}

export async function handleAddCategoryDB({  
  e,
  category,
  success,
  failed,
  dispatch,
  setCategory,
  setModalState,}:HandleCategoryFormProps){

 e.preventDefault();
  if (category.trim() === "") return failed("kindly type category name");

   const name = category.trim().toLowerCase();

   function addCat(){
     dispatch(addCategoryThunk(name))
     .unwrap() //.unwrap() allows us to listen to success/error inside the component
     .then(() => {
       success("category added successfully🎉")
      })
      .catch((err) => {
        failed(err || "Failed to add Category😩")
      })
      .finally(() => {
        setCategory("")
        setModalState("closed")
      })
   }

   useDebounce({func:addCat,delay:400})
}
export function handleDeleteCategory({
  category,
  dispatch,
  success,
  failed,
}: HandleDeleteCategoryProps) {
  const confirmDelete = (val: string) => window.confirm(`Transcactions added in ${val} category will be deleted`);
 
  if(!confirmDelete(category.name)){
    return failed("action cancelled")
  }

  function deleteCat(){
    dispatch(deleteCategoryThunk(category))
    .unwrap()
    .then(() => {
      success(`${category.name} deleted successfully🎉`)
    })
    .catch((err) => {
      console.error(err)
      failed(err || "Failed to delete ")
    })
  }

  useDebounce({func:deleteCat,delay:200})
}
  
export function getCategories(){
  const [categories,setCategories] = useState<CategoryPropsTypeDB[]>([])

  async function getCat() {
    try {
     const result = await fetch(`${Backend_Url}/api/data/categories`)
     const res = await result.json()
     if(result.ok){
     const data:CategoryPropsTypeDB[] = res.data
     setCategories(data)
     }
     } catch (err) {
       if(err instanceof Error){
         console.error(err.message)
       }
       console.error(err)
     }
  
  }

  useDebounce({func:getCat,delay:400})
  return categories
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

export async function handleRenameCategory({
  e,
  category,
  nextCategoryName,
  success,
  fail,
  setIsLoading,
  dispatch,
  setModalState,
}: HandleRenameCategoryProps) {
  const categoryToRename = {
    name:nextCategoryName,
    id:category.id
  }
  e.preventDefault();
  dispatch(renameCategory(categoryToRename))
  .unwrap()
  .then(() => {
    success("renamed successfully🎉")
  })
  .catch((err) => {
    fail(err || "Failed to rename")
  })
  .finally(() => {
   setIsLoading(false)
   setModalState("closed")
  })
}

interface userExpenseTxns {
  setData:(val:expenseTranscationTypes[]) => void;
}
export async function getUserExpenseTransactions({setData}:userExpenseTxns){

  async function getExpense(){
    try {
    const result = await fetch(`${Backend_Url}/api/transaction/expenses`)
    let res = await result.json();
     res = res.data;
    setData(res)
    return;
    } catch (err) {
     console.error(err)
     setData([])
    }
  }

  useDebounce({func:getExpense,delay:400})
}