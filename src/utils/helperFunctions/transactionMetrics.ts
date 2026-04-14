import type { IncomeType, TransactionType } from "../../types/transactionType";

type TransactionLike = {
  date: string;
  amount: number;
};

const isInMonth = (dateString: string, month: number, year: number) => {
  const date = new Date(dateString);
  return date.getMonth() === month && date.getFullYear() === year;
};

export function getMonthlyTotal<T extends TransactionLike>(
  transactions: T[],
  month: number,
  year: number,
) {
  return transactions
    .filter((transaction) => isInMonth(transaction.date, month, year))
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getMonthOverMonthChange<T extends TransactionLike>(
  transactions: T[],
  month: number,
  year: number,
) {
  if (!transactions.length) {
    return 0;
  }

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  const currentTotal = getMonthlyTotal(transactions, month, year);
  const previousTotal = getMonthlyTotal(transactions, prevMonth, prevYear);

  if (previousTotal === 0) {
    return currentTotal > 0 ? 100 : 0;
  }

  return ((currentTotal - previousTotal) / previousTotal) * 100;
}

export function getTopCategory(transactions: TransactionType[]) {
  const categoryTotals = transactions.reduce<Record<string, number>>(
    (accumulator, transaction) => {
      accumulator[transaction.category] =
        (accumulator[transaction.category] ?? 0) + transaction.amount;
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

export function getLargestTransactionInRange<T extends TransactionLike>(
  transactions: T[],
  startDate: Date,
  endDate: Date,
) {
  return transactions
    .filter((transaction) => {
      const date = new Date(transaction.date);
      return date >= startDate && date <= endDate;
    })
    .reduce<T | null>((largest, transaction) => {
      if (!largest || transaction.amount > largest.amount) {
        return transaction;
      }

      return largest;
    }, null);
}

export function getMonthlyIncomeTotal(
  transactions: IncomeType[],
  month: number,
  year: number,
) {
  return getMonthlyTotal(transactions, month, year);
}

export function getMonthlyExpenseTotal(
  transactions: TransactionType[],
  month: number,
  year: number,
) {
  return getMonthlyTotal(transactions, month, year);
}
