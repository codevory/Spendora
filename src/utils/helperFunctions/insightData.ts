import type { IncomeType, TransactionType } from "../../types/transactionType";
import { useMemo } from 'react'
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
    incomeTransactions:IncomeType[];
    transactions:TransactionType[]
}



export const getTopCategory  = (transactions:TransactionType[]) => {
    const map:Record<string,number> = {};
    if(!transactions.length) return {category:null,amount:0};
    
    transactions.forEach((t) => {
        map[t.category] = (map[t.category] || 0 ) + t.amount ;
    });
    
    const entries = Object.entries(map);
    if(!entries.length) return {category:null,amount:0};
    
 const [category,amount] = entries.length ? entries.reduce((max,curr) => (curr[1] > max[1] ? curr : max)) : [null,0]
 
 return {category,amount};
}


export const insightData = ({incomeTransactions,transactions}:IncomeTxnsTpe) => {
return useMemo<InsightData>(() => {

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayOfMonth = Math.max(1, now.getDate());

    const currentMonthTxns = transactions.filter((txn) => {
      const d = new Date(txn.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const prevDate = new Date(currentYear, currentMonth - 1, 1);
    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();

    const prevMonthTxns = transactions.filter((txn) => {
      const d = new Date(txn.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });

    const currentMonthIncome = incomeTransactions.filter((txn) => {
      const d = new Date(txn.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalExpense = currentMonthTxns.reduce((acc, t) => acc + Number(t.amount), 0);
    const previousExpense = prevMonthTxns.reduce((acc, t) => acc + Number(t.amount), 0);
    const totalIncome = currentMonthIncome.reduce((acc, t) => acc + Number(t.amount), 0);

    const avgDailySpend = totalExpense / dayOfMonth;
    const projectedSpend = avgDailySpend * daysInMonth;
    const dailyRunRate = dayOfMonth / daysInMonth;

    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    let expenseDeltaPercent = 0;
    if (previousExpense === 0) {
      expenseDeltaPercent = totalExpense > 0 ? 100 : 0;
    } else {
      expenseDeltaPercent = ((totalExpense - previousExpense) / previousExpense) * 100;
    }

    const categoryMap = currentMonthTxns.reduce<Record<string, number>>((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + Number(txn.amount);
      return acc;
    }, {});

    const topCategoryEntry = Object.entries(categoryMap).reduce<[string, number] | null>(
      (top, current) => {
        if (!top || current[1] > top[1]) {
          return current;
        }
        return top;
      },
      null,
    );

    const topCategory =
      topCategoryEntry && totalExpense > 0
        ? {
            name: topCategoryEntry[0],
            amount: topCategoryEntry[1],
            sharePercent: (topCategoryEntry[1] / totalExpense) * 100,
          }
        : null;

    const biggestTxn = currentMonthTxns.reduce<typeof currentMonthTxns[number] | null>(
      (max, txn) => {
        if (!max || txn.amount > max.amount) {
          return txn;
        }
        return max;
      },
      null,
    );

    const biggestExpense = biggestTxn
      ? {
          name: biggestTxn.name,
          amount: biggestTxn.amount,
          date: biggestTxn.date,
        }
      : null;

    return {
      monthTitle: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
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
  }, [incomeTransactions, transactions]);
}

