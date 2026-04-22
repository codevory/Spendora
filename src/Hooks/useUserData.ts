import type { ChartData } from "chart.js";
import { useAppSelector } from "../store/store";
import type { IncomeType, TransactionType } from "../types/transactionType";
import { getUserOriginList } from "../utils/currency";

interface MonthlyDataTypes {
  trans: TransactionType[];
  month: number;
}

export interface UserOriginItem {
  key: string;
  country: string;
  currencySymbol: string;
}

const now = new Date();
const start = 1;
const targetDate = (month: number) => new Date(now.getFullYear(), month, 1);

export const useUserData = () => {
  const trans = useAppSelector((state) => state.transaction.transactions);
  const incomeTrans = useAppSelector(
    (state) => state.incomeTransaction.incomeTransactions,
  );
  const normalizedCurrentDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const currMonthData = getMonthlyData({
    trans,
    month: normalizedCurrentDate.getMonth(),
  });
  const prevMonthData = getMonthlyData({
    trans,
    month: normalizedCurrentDate.getMonth() - 1,
  });
  const currMonthIncome = getMonthlyIncome({ transactions: incomeTrans });

  const currentLabels = Object.keys(currMonthData);
  const currentMonthAmounts = currentLabels.map(
    (label) => currMonthData[label] ?? 0,
  );
  const currentMonthExpense = getMonthlyExpense({
    trans: trans,
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

  return { pieData, barData, lineData, analysisData, userOriginsList };
};

function getMonthlyData({ trans, month }: MonthlyDataTypes) {
  const targetMonth = targetDate(month).getMonth();
  const targetYear = targetDate(month).getFullYear();

  return trans
    .filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === targetMonth && date.getFullYear() === targetYear
      );
    })
    .reduce<Record<string, number>>((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = (acc[curr.category] ?? 0) + Number(curr.amount);
      } else {
        acc[curr.category] += Number(curr.amount);
      }
      return acc;
    }, {});
}

function getMonthlyExpense({ trans, month }: MonthlyDataTypes) {
  const end = targetDate(month).getFullYear();
  return trans
    .filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() >= start && date.getFullYear() <= end;
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
  transactions: IncomeType[];
}
function getMonthlyIncome({ transactions }: MonthlyIncomeType) {
  const end = targetDate(now.getMonth()).getFullYear();
  return transactions
    .filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() >= start && date.getFullYear() <= end;
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
