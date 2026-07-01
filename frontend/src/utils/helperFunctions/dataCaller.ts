import { Backend_Url } from "../../store/features/transaction";
import type { expenseTranscationTypes } from "../../types/transactionType";

interface userExpenseTxns {
  setData:(val:expenseTranscationTypes[]) => void;
}
export async function getUserExpenseTransactions({setData}:userExpenseTxns){

    try {
    const result = await fetch(`${Backend_Url}/api/transaction/expenses`,{
      credentials:'include'
    })
    let res = await result.json();
     res = res.data;
    setData(res)
    return;
    } catch (err) {
     console.error(err)
     setData([])
    }
  }