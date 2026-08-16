import type { ChartData } from "chart.js";
import type { expenseTranscationTypes } from "../types/transactionType";
import { formatCurrency, getUserOriginList } from "../utils/currency";
import {
  useGetIncomeTransactionsQuery,
  useGetExpenseTransactionsQuery,
  useGetFilteredExpenseTransactionsQuery,
  useGetRecentTransactionsQuery,
  useGetCategoriesQuery,
  useGetFinanceSummaryQuery
} from "../store/features/transactionApi";
import { useSimpleDebounce } from "./useSimpleDebounce";
import { useEffect, useMemo, useRef,useState } from "react";
import { useAppSelector } from "../store/store";
import useThemeContext from "./useThemeContext";

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

  const { data,isError:expenseError,isLoading:expenseLoading } = useGetExpenseTransactionsQuery({sort:"DESC"})
  const { data: incomeResponse,isError:incomeError,isLoading:incomeLoading } = useGetIncomeTransactionsQuery({sort:"DESC"});
  const { data:summaryData,isError:summaryDataError,isLoading:isSummaryDataLoading } = useGetFinanceSummaryQuery({})

  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key)
  const { isDark } = useThemeContext()

  const summaryDataLabels = useMemo(() => {
   return summaryData?.monthlyFinanceReport.map((d) => d.month_name)
  },[summaryData])

  const income_summary_Data = useMemo(() => {
     return summaryData?.monthlyFinanceReport.map((d) => {
      return d.totalIncome
     })
  },[summaryData])

  const balance_summary_data = useMemo(() => {
   return summaryData?.monthlyFinanceReport.map((d) => d.netBalance)
  },[summaryData])

  const expense_summary_data = useMemo(() => {
   return summaryData?.monthlyFinanceReport.map((d) => d.totalExpense)
  },[summaryData?.monthlyFinanceReport])

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

  const currentLabels = Object.keys(currMonthData);
  const currentMonthAmounts = currentLabels.map(
    (label) => currMonthData[label] ?? 0,
  );

  const trendLabels = Array.from(
    new Set([...Object.keys(currMonthData), ...Object.keys(prevMonthData)]),
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
    labels: summaryDataLabels,
    datasets: [
      {
        label: "Monthly Income Analysis",
        data: income_summary_Data || [],
        borderColor: "green",
        borderWidth: 2,
        backgroundColor: `${isDark ? 'lightgreen' : 'darkgreen'}`,
        showLine:true,
         tooltip:{
          callbacks:{
             label: function(context){
               let label = 'inc '
               if(label){
                label += ' : '
               }

                if (context.parsed.y !== null) {
                      label += formatCurrency(context.parsed.y,currencyKey)
                    }

               return label
             },
             labelColor:function(){
              return {
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'white',
                borderWidth: 2,
                borderDash: [2, 2],
                borderRadius: 2,
              }
             },
             labelTextColor:function(){
              return `${isDark ? 'lightgreen' : 'darkgreen'}`
             }
            }
        }
      },
      {
        label: "Monthly expense Analysis",
        data: expense_summary_data || [],
        borderColor: `${isDark ? 'pink' : 'red'}`,
        borderWidth: 2,
        backgroundColor: "rgb(75,192,192)",
         tooltip:{
          callbacks:{
             label: function(context){
               let label = 'exp '
               if(label){
                label += ' : '
               }

                if (context.parsed.y !== null) {
                      label += formatCurrency(context.parsed.y,currencyKey)
                    }

               return label
             },
             labelColor:function(){
              return {
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'rgb(0, 0, 255)',
                borderWidth: 2,
                borderDash: [2, 2],
                borderRadius: 2,
              }
             },
             labelTextColor:function(){
              return `${isDark ? 'pink' : 'red'}`
             }
            }
        }
      },
      {
         label: "Monthly Balance Analysis",
        data: balance_summary_data || [],
        borderColor: `${isDark ? 'yellow' : 'blue'}`,
        borderWidth: 2,
        backgroundColor: "rgb(75,192,192)",
         tooltip:{
          callbacks:{
             label: function(context){
               let label = 'bal '
               if(label){
                label += ' : '
               }

                if (context.parsed.y !== null) {
                      label += formatCurrency(context.parsed.y, currencyKey)
                }
                 
               return label
             },
             labelColor: function (){
              return {
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'rgb(255, 0, 0)',
                borderWidth: 2,
                borderDash: [2, 2],
                borderRadius: 2,
              }
             },
             labelTextColor:function (){
               return `${isDark ? 'yellow': 'blue'}`
             }
            }
        }
      }
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
    expenseError,
    expenseLoading,
    incomeError,
    incomeLoading,
    netBalance:summaryData?.financialSummary.netBalance,
    summaryDataError,
    isSummaryDataLoading
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
        limit:PAGE_SIZE,
        from:dateFrom === undefined || dateFrom === '' ?  undefined : new Date(dateFrom).toISOString(),
        to: dateTo === undefined || dateTo === '' ? undefined : new Date(dateTo).toISOString(),
        sort: "desc"
      })

      const lastValidData = useRef(data)
      if(data){
        lastValidData.current = data
      }
      const stableData = data ?? lastValidData.current

      useEffect(() => {
        let timer:NodeJS.Timeout
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
  limit:PAGE_SIZE,
  skip: page === undefined || page == 0 ? 0 : (page - 1) * PAGE_SIZE,
  sort:"desc"
 })

 let timer:NodeJS.Timeout;
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
  const { data,isFetching,error } = useGetCategoriesQuery({sort:"desc",limit:50})
  const [showLoading, setShowLoading] = useState(false)
  let timer:NodeJS.Timeout;
  
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

  return { data, isError:error,isFetching:showLoading}
}