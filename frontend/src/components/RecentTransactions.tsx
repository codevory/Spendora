import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { formatCurrency } from "../utils/currency";
import type {
  GetRecentTransactionsResponse,
  Transaction,
} from "../types/recentTransactions";
import TransactionsSkeleton from "./TransactionsSkeleton.tsx";
import { addTransactionToDeletionQueue
 } from "../store/features/transactionUpdate.ts";

type DisplayTransaction = Transaction & {
  name: string;
  dateTimestamp: number;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  day: "2-digit",
  month: "long",
});

type RecentTransactionProps = {
  data: GetRecentTransactionsResponse | undefined;
  isError: boolean;
  isFetching: boolean;
  keepChecked?: boolean;
  clearSelectedIds:number
};

const RecentTransactions = ({
  data,
  isFetching,
  isError,
  keepChecked = false,
  clearSelectedIds = 0
}: RecentTransactionProps) => {
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);
  const [selectedTxnIds, setTxnIds] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  
  
  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const isChecked = e.target.checked;
    const selectedId = e.target.id;
    
    if (isChecked) {
      const exists = selectedTxnIds.find((id) => id == selectedId)
      if(!exists){
        setTxnIds((prev) => [...prev,selectedId])
      }
    } else {
      setTxnIds((prev) => prev.filter((id) => id!== selectedId))
    }
  }
  
  useEffect(() => {
    if(clearSelectedIds >= 1){
      setTxnIds([])
      clearSelectedIds = 0;
    }
  },[clearSelectedIds,dispatch])


  useEffect(() => {

    console.log("selected Ids : ", selectedTxnIds);
    dispatch(addTransactionToDeletionQueue(selectedTxnIds));
  }, [selectedTxnIds, dispatch]);

  const recentTxns = data?.transactions || [];

  const sortedTransactions = useMemo<DisplayTransaction[]>(() => {
    return [...recentTxns]
      .map((txn) => ({
        ...txn,
        name: txn.entity,
        dateTimestamp: new Date(txn.date).getTime(),
      }))
      .sort((a, b) => b.dateTimestamp - a.dateTimestamp);
  }, [recentTxns]);

  if (isFetching) {
    return <TransactionsSkeleton />;
  }

  if (isError) {
    return (
      <div className="card text-center p-4">Failed to load transactions.</div>
    );
  }

  return (
    <div className="card recent-transactions mt-1 relative max-h-150 overflow-y-scroll transaction-activity">
      <div
        className={`max-h-110 transition-opacity duration-200 ${isFetching ? "opacity-40" : "opacity-100"}`}
      >
        {sortedTransactions.map((item) => {
          return (
            <div
              key={item.id.toString() + item.transactionId + item.createdAt}
              className=" flex items-center"
            >
              {keepChecked && <span className="mr-2 md:mr-3">
                <input
                  aria-label={`Select ${item.name} transaction`}
                  type="checkbox"
                  id={item.id.toString()}
                  checked={selectedTxnIds.includes(item.id.toString())}
                  onChange={handleCheckboxChange}
                  className="size-4.5"
                ></input>
              </span>}

              <div className="w-full transaction-item recent-transaction-item border-b border-slate-700 last:border-none mb-1">
                <div>
                  <p className="font-medium recent-transaction-name">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted">
                    {dateFormatter.format(new Date(item.date))} •{" "}
                    {getDayName(item.date.toString())}
                  </p>
                </div>

                <div
                  className={`${
                    item.type === "expense"
                      ? "recent-transaction-amount-expense"
                      : "recent-transaction-amount-income"
                  }`}
                >
                  <span className="font-semibold flex items-center">
                    {`${item.type === "expense" ? "-" : "+"}`}
                    {formatCurrency(Number(item.amount), currencyKey)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <span className="h-6 w-full rounded-xl transaction-item"></span>
        {sortedTransactions.length === 0 && !isFetching && (
          <p className="text-center text-muted py-6">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;

function getDayName(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-us", {
    weekday: "short",
  });
}
