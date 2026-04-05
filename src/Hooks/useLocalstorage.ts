import type { IncomeType, TransactionType } from "../types/transactionType";
import { safeParseArray } from "../utils/safeParseArray";

const useLocalstorage = () => {
  const localData = localStorage.getItem("userTransactions");
  const data = safeParseArray<TransactionType>(localData);
  const userIncomeData = safeParseArray<IncomeType>(localStorage.getItem("userIncomeData"))

  return {data,userIncomeData}
}

export default useLocalstorage
