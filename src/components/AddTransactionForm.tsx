import { useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/store";
import type { TransactionType } from "../types/transactionType";
import "../App.css";
import { handleAddExpenseTransaction } from "../utils/helperFunctions/hanldeFormActions";
import { convertToBaseAmount, getCurrencyMeta } from "../utils/currency";

interface AddTransactionFormPropsType {
  setModalState: (val: "category") => void;
}
const AddTransactionForm = ({ setModalState }: AddTransactionFormPropsType) => {
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState<string>("");
  const [payee, setPayee] = useState<string>("");
  const [category, setCategory] = useState<string>("select");
  const categories = useAppSelector((state) => state.transaction.categories);
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);
  const currencyMeta = getCurrencyMeta(currencyKey);

  const dispatch = useAppDispatch();
  const Success = () => toast.success("Expense Added Successfully");
  const failed = (message: string) => toast.error(message);

  const transaction: TransactionType = {
    name: payee,
    date: date,
    amount: amount !== "" ? convertToBaseAmount(amount, currencyKey) : 0,
    category: category,
    transactionId: "",
    createdAt: Number(new Date(date)),
    type: "expense",
  };

  const handleSubmitTransaction = handleAddExpenseTransaction;

  return (
    <>
      <div className="form-card card mx-auto">
        <form
          onSubmit={(e) =>
            handleSubmitTransaction({
              e: e,
              setAmount: setAmount,
              setCategory: setCategory,
              setPayee: setPayee,
              category: category,
              success: Success,
              failed: failed,
              amount: amount,
              dispatch: dispatch,
              transaction: transaction,
            })
          }
          className="flex flex-col gap-5"
        >
          {/* Amount */}
          <div className="relative">
            <label className="text-sm text-muted mb-1 block">Amount</label>
            <div className="flex items-center input">
              <span className="mr-2 text-muted">{currencyMeta.currencySymbol}</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="bg-transparent w-full outline-none"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-muted mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
              required
            />
          </div>

          {/* Payee */}
          <div>
            <label className="text-sm text-muted mb-1 block">Paid to</label>
            <input
              type="text"
              placeholder="Netflix, YouTube Premium"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              className="input"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-muted mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value.trim() === "add new") {
                  setModalState("category");
                }
              }}
              className="input"
              required
            >
              <option key={"select-key"} value={"select"}>
                select
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option key={"add-new-Key"} value="add new">
                Add new Category
              </option>
            </select>
          </div>

          {/* Button */}
          <button type="submit" className="btn-primary w-full active:scale-95">
            Add Expense
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTransactionForm;
