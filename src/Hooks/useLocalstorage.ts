import type { TransactionType } from "../types/transactionType";

const useLocalstorage = () => {
  const localData:string | null = localStorage.getItem("userTransactions");
    const validData = localData !== null ? localData : "";
    const data:TransactionType[] = JSON.parse(validData) || [];
  return {data}
}

export default useLocalstorage
