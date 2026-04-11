import type {
  CategoryPropsType,
  IncomeType,
  TransactionType,
} from "../types/transactionType";
import { safeParseArray } from "../utils/safeParseArray";

const useLocalstorage = () => {
  const localData = localStorage.getItem("userTransactions");
  const data = safeParseArray<TransactionType>(localData);
  const userIncomeData = safeParseArray<IncomeType>(
    localStorage.getItem("userIncomeData"),
  );
  const userCategories = safeParseArray<CategoryPropsType>(
    localStorage.getItem("userCategories"),
  );

  return { data, userIncomeData, userCategories };
};

export default useLocalstorage;
