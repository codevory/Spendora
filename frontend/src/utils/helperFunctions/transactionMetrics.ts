import type { IncomeTransactionTypes, expenseTranscationTypes } from "../../types/transactionType";

type TransactionIncomeLike = {
  date : string;
  amount: number;
};

type TransactionExpenseLike = {
  date:string;
  amount: number
}

const isInMonth = (dateString: string, month: number, year: number) => {
  const date = new Date(dateString);
  return date.getMonth() === month && date.getFullYear() === year;
};

export function getMonthlyIncome<T extends TransactionIncomeLike>(
  transactions: T[],
  month: number,
  year: number,
) {
  return transactions
    .filter((transaction) => isInMonth(transaction.date, month, year))
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
}

export function getMonthlyExpense<T extends TransactionExpenseLike>(transactions:T[],month:number,year:number){
 return transactions
    .filter((transaction) => isInMonth(transaction.date, month, year))
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
}

export function getMonthOverMonthChange<T extends expenseTranscationTypes>(
  transactions: T[],
  month: number,
  year: number,
) {
  if (!transactions.length) {
    return 0;
  }

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  const currentTotal = getMonthlyExpense(transactions, month, year);
  const previousTotal = getMonthlyExpense(transactions, prevMonth, prevYear);

  if (previousTotal === 0) {
    return currentTotal > 0 ? 100 : 0;
  }

  return ((currentTotal - previousTotal) / previousTotal) * 100;
}

export function getTopCategory(transactions: expenseTranscationTypes[]) {
  
  const categoryTotals = transactions.reduce<Record<string, number>>(
    (accumulator, transaction) => {
      accumulator[transaction.categoryName ?? "uncategorized"] =
        (accumulator[transaction.categoryName ?? "uncategorized"] ?? 0) + Number(transaction.amount);
      return accumulator;
    },
    {},
  );

  const entries = Object.entries(categoryTotals);
  if (!entries.length) {
    return { category: null, amount: 0 };
  }

  const [category, amount] = entries.reduce((currentTop, current) =>
    current[1] > currentTop[1] ? current : currentTop,
  );

  return { category, amount };
}

export function getLargestTransactionInRange<T extends expenseTranscationTypes>(
  transactions: T[],
  startDate: Date,
  endDate: Date,
) {
  return transactions
    .filter((transaction) => {
      const date = new Date(transaction.date)
      return date >= startDate && date <= endDate;
    })
    .reduce<T | null>((largest, transaction) => {
      if (!largest || Number(transaction.amount) > largest.amount) {
        return transaction;
      }

      return largest;
    }, null);
}

export function getMonthlyIncomeTotal(
  transactions: IncomeTransactionTypes[],
  month: number,
  year: number,
) {
  return getMonthlyIncome(transactions, month, year);
}

export function getMonthlyExpenseTotal(
  transactions: expenseTranscationTypes[],
  month: number,
  year: number,
) {
  return getMonthlyExpense(transactions, month, year);
}
