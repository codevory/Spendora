import type {
  CategoryPropsType,
  AddCategoryTriggerFn,
  AddIncomeTriggerFn,
  DeleteCategoryTriggerFn,
  expenseTranscationTypes,
  handleAddExpenseTransactionProps,
  RenameCategoryTriggerFn,
  IncomeTransactionTypes,
} from "../../types/transactionType";
import {
  Backend_Url
} from "../../store/features/transaction";

type commonTypes = Pick<
  handleAddExpenseTransactionProps,
  "e" | "failed"
>;
interface handleAddIncomeTransactionProps extends commonTypes {
  incomeSource: string;
  amount: number | "";
  incomeDate: string;
  success: (val: string) => string;
  setModalState: (val: "closed") => void;
  setIsSubmitting:(val:boolean) => void;
  addIncomeTxn: AddIncomeTriggerFn;
}

type categoryFormCommontypes = Pick<
  handleAddIncomeTransactionProps,
  "e" | "success" | "failed" | "setModalState"
>;
interface HandleCategoryFormProps extends categoryFormCommontypes {
  category: string;
  setCategory: (val: string) => void;
  setIsSubmitting:(val:boolean) => void
  addCategoryTxn: AddCategoryTriggerFn;
}

type DeleteCategoryCommonProps = Pick<
  HandleCategoryFormProps,
  "success" | "failed"
>;
interface HandleDeleteCategoryProps extends DeleteCategoryCommonProps {
  category: CategoryPropsType;
  deleteCategoryTxn: DeleteCategoryTriggerFn;
}

let renameCategoryTimer: ReturnType<typeof setTimeout> | null = null;

export async function handleAddExpenseTransaction({
  e,
  setAmount,
  setPayee,
  setIsSubmitting,
  success,
  failed,
  amount,
  category,
  transaction,
  addTxn
}: handleAddExpenseTransactionProps) {
  e.preventDefault();
  if (typeof amount !== "number" || amount <= 0) {
    failed("kindly add valid amount");
    return;
  }
  if (
    category === undefined ||
    category.trim().toLowerCase() === "add new" ||
    category.trim().toLowerCase() === "select" ||
    category.trim() === ""
  ) {
    return failed("Kindly select category");
  }

  const tId = `txn-${Date.now().toFixed(4)}-${new Date().getMilliseconds().toFixed(2)}`;
  const transactionData: expenseTranscationTypes = {
    ...transaction,
    transactionId: tId,
  };


  // setIsSubmitting(true);

  // dispatch(addExpense(transactionData))
  //   .unwrap()
  //   .then(() => {
  //     success();
  //   })
  //   .catch((err) => {
  //     failed(err || "Failed to add Expense");
  //   })
  //   .finally(() => {
  //     setAmount(1);
  //     setPayee("");
  //     setIsSubmitting(false);
  //   });

  try{
    setIsSubmitting(true)
    await addTxn({
      transactionData
    })
    .unwrap()
    .then(() => {
      success()
    })
  }
    catch(err){
     failed("Failed to add Expense")
     console.error(err)
    }
    finally{
      setAmount(0)
      setPayee("")
      setIsSubmitting(false)
    }
}

export async function handleAddIncomeTransaction({
  e,
  failed,
  incomeDate,
  amount,
  incomeSource,
  success,
  setModalState,
  setIsSubmitting,
  addIncomeTxn,
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

    setIsSubmitting(true)
    await addIncomeTxn({ incomeData })
    .unwrap()
    .then(() => {
      success("income added successfully🎉")
    })
    .catch((err) => {
      failed(err ?? "Failed to add Income")
    })
    .finally(() => {
      setIsSubmitting(false)
      setModalState("closed")
    })
  }


export async function handleAddCategoryDB({  
  e,
  category,
  success,
  failed,
  setCategory,
  setIsSubmitting,
  setModalState,
  addCategoryTxn,
}:HandleCategoryFormProps){

 e.preventDefault();
  if (category.trim() === "") return failed("kindly type category name");

   const name = category.trim().toLowerCase();

     setIsSubmitting(true)
     await addCategoryTxn({ name })
     .unwrap() //.unwrap() allows us to listen to success/error inside the component
     .then(() => {
       success("category added successfully🎉")
      })
      .catch((err) => {
        failed(err || "Failed to add Category😩")
      })
      .finally(() => {
        setCategory("")
        setIsSubmitting(false)
        setModalState("closed")
      })

}
export function handleDeleteCategory({
  category,
  deleteCategoryTxn,
  success,
  failed,
}: HandleDeleteCategoryProps) {
  const confirmDelete = (val: string) => window.confirm(`Transcactions added in ${val} category will be deleted`);
 
  if(!confirmDelete(category.name)){
    return failed("action cancelled")
  }

  function deleteCat(){
    deleteCategoryTxn({ category })
    .unwrap()
    .then(() => {
      success(`${category.name} deleted successfully🎉`)
    })
    .catch((err) => {
      console.error(err)
      failed(err || "Failed to delete ")
    })
  }

  deleteCat();
}
  
export async function getCategories(): Promise<CategoryPropsType[]> {
    try {
     const result = await fetch(`${Backend_Url}/api/data/categories`,{
      credentials:'include'
     })

     const res = await result.json()

     if(!result.ok){
      console.error("Failed to get categories")
     }
      const categories = res.categories ?? []

      console.log("got categories from api : ",categories) //log here

      return categories
     
     } catch (err) {
       if(err instanceof Error){
         console.error(err.message)
       }
       console.error(err)
     }
  
  return []
  }


export interface HandleRenameCategoryProps {
  e: React.SubmitEvent<HTMLFormElement>;
  category: CategoryPropsType;
  nextCategoryName: string;
  success: (val: string) => string;
  fail: (val: string) => string;
  setIsLoading: (val: boolean) => void;
  renameCategoryTxn: RenameCategoryTriggerFn;
  setModalState: (val: "income" | "category" | "closed") => void;
  setIsSubmitting:(val:boolean) => void
}

export function handleRenameCategory({
  e,
  category,
  nextCategoryName,
  success,
  fail,
  setIsLoading,
  renameCategoryTxn,
  setIsSubmitting,
  setModalState,
}: HandleRenameCategoryProps) {
  const categoryToRename = {
    name:nextCategoryName,
    id:category.id
  }
  e.preventDefault();

  if (renameCategoryTimer) {
    clearTimeout(renameCategoryTimer);
  }

  setIsSubmitting(true);

  renameCategoryTimer = setTimeout(() => {
    renameCategoryTxn({ category: categoryToRename })
      .unwrap()
      .then(() => {
        success("renamed successfully🎉");
      })
      .catch((err) => {
        fail(err || "Failed to rename");
      })
      .finally(() => {
        setIsLoading(false);
        setIsSubmitting(false);
        setModalState("closed");
        renameCategoryTimer = null;
      });
  }, 300);
}
