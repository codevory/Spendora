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
import { incomeFormSchema,entitySchema, expenseFormSchema } from "../zodSchema";

interface commonPropsType {
  success: (val: string) => string;
  failed: (val:string) => void
  setModalState: (val: "closed" | "category" | "income") => void;
  setIsSubmitting:(val:boolean) => void
  setIsLoading:(val:boolean) => void
  setError:(val:string | null) => void
  e:React.SubmitEvent<HTMLFormElement>
}
interface handleAddIncomeTransactionProps extends commonPropsType {
  incomeSource: string;
  amount: number | "";
  incomeDate: string;
  addIncomeTxn: AddIncomeTriggerFn;
}

interface categoryFormCommontypes extends commonPropsType {}
interface HandleCategoryFormProps extends categoryFormCommontypes {
  category: string;
  setCategory: (val: string) => void;
  addCategoryTxn: AddCategoryTriggerFn;
}

type DeleteCategoryCommonProps = Pick<HandleCategoryFormProps, "success" | "failed" >;
interface HandleDeleteCategoryProps extends DeleteCategoryCommonProps {
  category: CategoryPropsType;
  deleteCategoryTxn: DeleteCategoryTriggerFn;
  setIsSubmitting: (val:boolean) => void;
};

let Timer: ReturnType<typeof setTimeout> | null = null;

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
  addTxn,
  setError
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

   const result = expenseFormSchema.safeParse({
    amount:Number(transaction.amount),
    entity:transaction.entity,
    date:transaction.date,
    category:transaction.categoryName
   })

   if(!result.success){
    const errorMessage = result.error.format()._errors[0]  ?? "Only letters & spaces allowed!";
    setError(errorMessage)
    return failed("Only letters & spaces allowed!")
   }

   setError(null)
  const tId = `txn-${Date.now().toFixed(4)}-${new Date().getMilliseconds().toFixed(2)}`;
  const transactionData: expenseTranscationTypes = {
    ...transaction,
    transactionId: tId,
  };

  try{
    setIsSubmitting(true)
    await addTxn({
      transactionData,
      
    })
    .unwrap()
     .then(() => {
      success()
     }).catch((err) => {
      if(err instanceof Error){
        failed(err.message ?? "Failed to add expense")
      }
      else{
        failed("Oops! Failed to add expense")
      }
     })
  }
    catch(err){
     failed("Internal server error ")
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
  setError
}: handleAddIncomeTransactionProps) {
  e.preventDefault();
  if (amount !== "" && amount < 0) return failed("Not valid income amount");
  if (incomeDate === "" || incomeSource === "") return failed("Fill all required details");

   const result = incomeFormSchema.safeParse({
    amount:Number(amount),
    source:incomeSource,
    date:incomeDate.toString()
  })

   if(!result.success){
    const errorMessage = result.error.format()._errors[0]  ?? "Only letters & spaces allowed!";
    setError(errorMessage)
    return failed(errorMessage)
   }

  const incomeData: IncomeTransactionTypes = {
    id:1,
    amount: amount !== "" ? amount : 0,
    entity: incomeSource,
    date: incomeDate,
    transactionId: crypto.randomUUID(),
    createdAt: Date.now().toString(),
    type: "income",
    categoryId:null,
    categoryName:null
  };

  try{
    setIsSubmitting(true)
    await addIncomeTxn({ incomeData:incomeData })
    .unwrap()
    .then(() => {
      return success("income added successfully🎉")
    })
    .catch((err) => {
      failed("network error")
      console.error(err)
    })
  }catch(err){
    console.error(err)
    failed("Failed to add, internal server error")
    return 

  }finally{
    setIsSubmitting(false)
    setModalState('closed')
  }
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
  setError
}:HandleCategoryFormProps){

 e.preventDefault();
  const result = entitySchema.safeParse(category)
   if(!result.success){
    const errorMessage = result.error.format()._errors[0]  ?? "Only letters & spaces allowed!";
     setError(errorMessage)
     return failed(errorMessage)
   }

   const name = category.trim().toLowerCase();
   setError(null)
   if(Timer !== null){
    clearTimeout(Timer)
   }
     setIsSubmitting(true)
     Timer = setTimeout(async () => {
       await addCategoryTxn({ name,   })
       .unwrap()
       .then(() => {
         return success("category added successfully🎉")
        })
        .catch((err:any) => {
          failed(err.data.error  ?? "Internal server error to add Category")
          console.error(err.data.error)
          return ;
        })
        .finally(() => {
          setCategory("")
          setIsSubmitting(false)
          setModalState("closed")
          Timer = null
        })
     }, 900);

}
export function handleDeleteCategory({
  category,
  deleteCategoryTxn,
  success,
  failed,
  setIsSubmitting,
}: HandleDeleteCategoryProps) {
  const confirmDelete = (val: string) => window.confirm(`Transcactions added in ${val} category will be deleted`);
 
    if(!confirmDelete(category.name)){
       return failed("action cancelled")
    }

    if(Timer !== null){
      clearTimeout(Timer)
    }

    setIsSubmitting(true)

 Timer = setTimeout(() => {
   deleteCategoryTxn({ category,  })
   .unwrap()
   .then(() => {
     return success(`${category.name} deleted successfully🎉`)
   })
   .catch((err:any) => {
     console.error(err)
     return failed("Internal server error to delete category")
   }).finally(() => {
     setIsSubmitting(false)
    Timer = null
   })
  
 }, 900);
}
export interface HandleRenameCategoryProps extends commonPropsType {
  category: CategoryPropsType;
  nextCategoryName: string;
  renameCategoryTxn: RenameCategoryTriggerFn;
}

export function handleRenameCategory({
  e,
  category,
  nextCategoryName,
  success,
  failed,
  setIsLoading,
  renameCategoryTxn,
  setIsSubmitting,
  setModalState,
  setError,
}: HandleRenameCategoryProps) {
  const categoryToRename = {
    name:nextCategoryName,
    id:category.id
  }

  const result = entitySchema.safeParse(categoryToRename.name)
  if(!result.success){
    const errorMessage = result.error.format()._errors[0]  ?? "Only letters & spaces allowed!";
    setError(errorMessage)
    return failed(errorMessage)
  }
  e.preventDefault();
  setError(null)
  if (Timer) {
    clearTimeout(Timer);
  }
  setIsSubmitting(true);

  Timer = setTimeout(() => {
    renameCategoryTxn({name:categoryToRename.name,id:categoryToRename.id   })
      .unwrap()
      .then(() => {
        success("renamed successfully🎉");
      })
      .catch((err:any) => {
        failed("Internal server error to rename");
        console.error(err)
        return ;
      })
      .finally(() => {
        setIsLoading(false);
        setIsSubmitting(false);
        setModalState("closed");
        Timer = null;
      });
  }, 300);
}
