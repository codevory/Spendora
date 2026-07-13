import type { IncomeTransactionTypes, expenseTranscationTypes } from "../../types/transactionType";
import { useMemo } from "react";
import {
  getMonthlyExpenseTotal,
  getMonthlyIncomeTotal,
  getTopCategory,
} from "./transactionMetrics";

interface InsightData {
  monthTitle: string;
  totalExpense: number;
  totalIncome: number;
  avgDailySpend: number;
  dailyRunRate: number;
  projectedSpend: number;
  savingsRate: number;
  expenseDeltaPercent: number;
  topCategory: { name: string; amount: number; sharePercent: number } | null;
  biggestExpense: { name: string; amount: number; date: string } | null;
}
interface IncomeTxnsTpe {
  incomeTransactions: IncomeTransactionTypes[];
  expenseTransactions: expenseTranscationTypes[];
}

export const insightData = ({
  incomeTransactions,
  expenseTransactions,
}: IncomeTxnsTpe) => {
  return useMemo<InsightData>(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayOfMonth = Math.max(1, now.getDate());

    const currentMonthTxns = expenseTransactions.filter((txn) => {
      const d = new Date(txn.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const prevDate = new Date(currentYear, currentMonth - 1, 1);
    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();

    const totalExpense = getMonthlyExpenseTotal(
      expenseTransactions,
      currentMonth,
      currentYear,
    );
    const previousExpense = getMonthlyExpenseTotal(
      expenseTransactions,
      prevMonth,
      prevYear,
    );
    const totalIncome = getMonthlyIncomeTotal(
      incomeTransactions,
      currentMonth,
      currentYear,
    );

    const avgDailySpend = totalExpense / dayOfMonth;
    const projectedSpend = avgDailySpend * daysInMonth;
    const dailyRunRate = dayOfMonth / daysInMonth;

    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    let expenseDeltaPercent = 0;
    if (previousExpense === 0) {
      expenseDeltaPercent = totalExpense > 0 ? 100 : 0;
    } else {
      expenseDeltaPercent =
        ((totalExpense - previousExpense) / previousExpense) * 100;
    }

    const topCategoryEntry = getTopCategory(currentMonthTxns);

    const topCategory =
      topCategoryEntry.category && totalExpense > 0
        ? {
            name: topCategoryEntry.category,
            amount: topCategoryEntry.amount,
            sharePercent: (Number(topCategoryEntry.amount) / totalExpense) * 100,
          }
        : null;

    const biggestTxn = currentMonthTxns.reduce<
      (typeof currentMonthTxns)[number] | null
    >((max, txn) => {
      if (!max || Number(txn.amount) > Number(max.amount)) {
        return txn;
      }
      return max;
    }, null);

    const biggestExpense = biggestTxn
      ? {
          name: biggestTxn.entity,
          amount: Number(biggestTxn.amount),
          date: biggestTxn.date,
        }
      : null;

    return {
      monthTitle: now.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
      totalExpense,
      totalIncome,
      avgDailySpend,
      dailyRunRate,
      projectedSpend,
      savingsRate,
      expenseDeltaPercent,
      topCategory,
      biggestExpense,
    };
  }, [incomeTransactions, expenseTransactions]);
};
