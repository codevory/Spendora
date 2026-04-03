import type { TransactionType } from "../types/transactionType";
import { safeParseArray } from "../utils/safeParseArray";

const useLocalstorage = () => {
  const localData = localStorage.getItem("userTransactions");
  const data = safeParseArray<TransactionType>(localData);

  return {data}
}

export default useLocalstorage
