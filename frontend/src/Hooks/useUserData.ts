import type { ChartData } from "chart.js";
import type { IncomeTransactionTypes, expenseTranscationTypes } from "../types/transactionType";
import { getUserOriginList } from "../utils/currency";
import {
  useGetIncomeTransactionsQuery,
  useGetExpenseTransactionsQuery,
  useGetFilteredExpenseTransactionsQuery,
  useGetRecentTransactionsQuery,
  useGetCategoriesQuery
} from "../store/features/transactionApi";
import { useSimpleDebounce } from "./useSimpleDebounce";
import { useEffect, useRef,useState } from "react";

interface MonthlyDataTypes {
  expenses: expenseTranscationTypes[];
  month: number;
}

export interface UserOriginItem {
  key: string;
  country: string;
  currencySymbol: string;
}

const now = new Date();
const targetDate = (month: number) => new Date(now.getFullYear(), month, 1);

export const useUserData = () => {

  const { data } = useGetExpenseTransactionsQuery()
  const { data: incomeResponse } = useGetIncomeTransactionsQuery();

  const expenses = data?.expenses ?? [];
  const incomeTrans = incomeResponse?.incomes ?? [];

  const normalizedCurrentDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const currMonthData = getMonthlyData({
   expenses,
    month: normalizedCurrentDate.getMonth(),
  });
  const prevMonthData = getMonthlyData({
    expenses,
    month: normalizedCurrentDate.getMonth() - 1,
  });
  const currMonthIncome = getMonthlyIncome({ transactions: incomeTrans });

  const currentLabels = Object.keys(currMonthData);
  const currentMonthAmounts = currentLabels.map(
    (label) => currMonthData[label] ?? 0,
  );
  const currentMonthExpense = getMonthlyExpense({
    expenses:expenses,
    month: normalizedCurrentDate.getMonth(),
  });

  const trendLabels = Array.from(
    new Set([...Object.keys(currMonthData), ...Object.keys(prevMonthData)]),
  );

  const incomeVsExpenseLabels = Array.from(
    new Set([
      ...Object.keys(currMonthIncome),
      ...Object.keys(currentMonthExpense),
    ]),
  );

  const currMonthIncomeAmounts = incomeVsExpenseLabels.map(
    (label) => currMonthIncome[label] ?? 0,
  );
  const currMonthExpenseAmounts = incomeVsExpenseLabels.map(
    (label) => currentMonthExpense[label] ?? 0,
  );

  const currMonthAmounts = trendLabels.map(
    (label) => currMonthData[label] ?? 0,
  );
  const prevMonthAmounts = trendLabels.map(
    (label) => prevMonthData[label] ?? 0,
  );

  const pieData: ChartData<"pie"> = {
    labels: currentLabels,
    datasets: [
      {
        label: "Expense distribution",
        data: currentMonthAmounts,
        backgroundColor: ["blue", "green", "orange", "purple", "yellow", "red"],
        borderWidth: 1,
        borderColor: "black",
        borderAlign: "inner",
        hoverOffset: 14,
      },
    ],
  };

  const barData: ChartData<"bar"> = {
    labels: currentLabels,
    datasets: [
      {
        label: "Expense",
        data: currentMonthAmounts,
        backgroundColor: ["blue", "green", "orange", "purple", "yellow", "red"],
        borderColor: "pink",
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const lineData: ChartData<"line"> = {
    labels: trendLabels,
    datasets: [
      {
        label: "Prev Month Analysis",
        data: prevMonthAmounts,
        borderColor: "red",
        borderWidth: 2,
        backgroundColor: "red",
      },
      {
        label: "This Month Analysis",
        data: currMonthAmounts,
        borderColor: "rgb(75,192,192)",
        borderWidth: 2,
        backgroundColor: "rgb(75,192,192)",
      },
    ],
  };

  const analysisData: ChartData<"line"> = {
    labels: incomeVsExpenseLabels,
    datasets: [
      {
        label: "This Month income Analysis",
        data: currMonthIncomeAmounts,
        borderColor: "green",
        borderWidth: 2,
        backgroundColor: "red",
      },
      {
        label: "This Month expense Analysis",
        data: currMonthExpenseAmounts,
        borderColor: "red",
        borderWidth: 2,
        backgroundColor: "rgb(75,192,192)",
      },
    ],
  };

  const userOriginsList = getUserOriginList();

  return {
    pieData,
    barData,
    lineData,
    analysisData,
    userOriginsList,
    expenses,
    incomeTrans,
  };
};

function getMonthlyData({ expenses, month }: MonthlyDataTypes) {
  const targetMonth = targetDate(month).getMonth();
  const targetYear = targetDate(month).getFullYear();

  return expenses
    .filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === targetMonth && date.getFullYear() === targetYear
      ); 
    })
    .reduce<Record<string, number>>((acc, curr) => {
      if (!acc[curr.categoryName ?? "uncategorized"]) {
        acc[curr.categoryName ?? "uncategorized"] = (acc[curr.categoryName ?? "uncategorized"] ?? 0) + Number(curr.amount);
      } else {
        acc[curr.categoryName ?? "uncategorized"] += Number(curr.amount);
      }
      return acc;
    }, {});
}

function getMonthlyExpense({ expenses, month }: MonthlyDataTypes) {

  return expenses
    .filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === month && date.getFullYear() === targetDate(month).getFullYear();
    })
    .reduce<Record<string, number>>((acc, curr) => {
      const month = new Date(curr.date).toLocaleDateString("en-US", {
        month: "short",
      });
      if (!acc[month]) {
        acc[month] = (acc[month] ?? 0) + Number(curr.amount);
      } else {
        acc[month] += Number(curr.amount);
      }
      return acc;
    }, {});
}
interface MonthlyIncomeType {
  transactions: IncomeTransactionTypes[];
}
function getMonthlyIncome({ transactions }: MonthlyIncomeType) {
  return transactions
    .filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce<Record<string, number>>((acc, curr) => {
      const month = new Date(curr.date).toLocaleDateString("en-US", {
        month: "short",
      });
      if (!acc[month]) {
        acc[month] = (acc[month] ?? 0) + Number(curr.amount);
      } else {
        acc[month] += Number(curr.amount);
      }
      return acc;
    }, {});
}

type useFilteredDataTypes = {
query?: string 
page?: number
dateFrom?: string
dateTo?: string
PAGE_SIZE?:number
}
export function useFilteredExpense({query,page,dateFrom,dateTo,PAGE_SIZE}:useFilteredDataTypes){
  const [showLoading,setShowLoading] = useState(false)

     const debouncedQuery = useSimpleDebounce(query,100)

      const { data,isError,isFetching} = useGetFilteredExpenseTransactionsQuery({
        query:debouncedQuery,
        page,
        size:PAGE_SIZE,
        from:dateFrom === undefined || dateFrom === '' ?  undefined : new Date(dateFrom).toISOString(),
        to: dateTo === undefined || dateTo === '' ? undefined : new Date(dateTo).toISOString()
      })

      const lastValidData = useRef(data)
      if(data){
        lastValidData.current = data
      }

      const stableData = data ?? lastValidData.current

      useEffect(() => {
        let timer:number
        if(isFetching){
          timer = setTimeout(() => {
            setShowLoading(true)
          }, 300);
        }
        else{
          setShowLoading(false)
        }

        return () => clearTimeout(timer)
      },[isFetching])

    return { data:stableData,isFetching:showLoading,isError}
}


type RecentTransactionsType = {
  page:number 
  PAGE_SIZE:number
}
export function useRecentTransactions({page,PAGE_SIZE}:RecentTransactionsType){
 const { data,isError,isFetching } = useGetRecentTransactionsQuery({
  page,
  size:PAGE_SIZE,
  skip: page === undefined || page == 0 ? 0 : (page - 1) * PAGE_SIZE
 })

 let timer:number;
 const [showLoading,setShowLoading] = useState(false)
 
  let lastDataRef = useRef(data)
 
  if(data){
   lastDataRef.current = data
  }
  const stableData = data ?? lastDataRef.current


 useEffect(() => {
  if(isFetching){
    timer = setTimeout(() => {
     setShowLoading(true)
    },200)
  }
  else{
    setShowLoading(false)
  }

  return () => clearTimeout(timer)
 },[isFetching])

 return { data:stableData,isError,isFetching:showLoading}
}

export function useGetCategories(){
  const { data, isError,isFetching } = useGetCategoriesQuery()
  const [showLoading, setShowLoading] = useState(false)
  let timer:number | undefined;

  
  useEffect(() => {

    timer = setTimeout(() => {
      if(isFetching){
       setShowLoading(true)
      }else{
       setShowLoading(false)
      }
    },200)

    return () => clearTimeout(timer)
  },[isFetching])

  return { data, isError,isFetching:showLoading}
}