import type {
  CategoryPropsType,
  IncomeType,
  TransactionType,
} from "../types/transactionType";
import { safeParseArray } from "../utils/safeParseArray";
import type { UserOriginItem } from "./useUserData";

const defaultUserOrigin: UserOriginItem = {
  currencySymbol: "$",
  key: "US",
  country: "USA",
};

function getStoredUserOrigin() {
  const rawUserOrigin = localStorage.getItem("userOrigin");

  if (!rawUserOrigin) {
    localStorage.setItem("userOrigin", JSON.stringify(defaultUserOrigin));
    return defaultUserOrigin;
  }

  try {
    return JSON.parse(rawUserOrigin) as UserOriginItem;
  } catch {
    localStorage.setItem("userOrigin", JSON.stringify(defaultUserOrigin));
    return defaultUserOrigin;
  }
}

const useLocalstorage = () => {
  const localData = localStorage.getItem("userTransactions");
  const data = safeParseArray<TransactionType>(localData);
  const userIncomeData = safeParseArray<IncomeType>(
    localStorage.getItem("userIncomeData"),
  );
  const userCategories = safeParseArray<CategoryPropsType>(
    localStorage.getItem("userCategories"),
  );
  const userOriginDetails = getStoredUserOrigin();

  return { data, userIncomeData, userCategories, userOriginDetails };
};

export default useLocalstorage;
