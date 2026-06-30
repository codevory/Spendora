import { useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/store";
import type { expenseTranscationTypes, } from "../types/transactionType";
import { handleAddExpenseTransaction } from "../utils/helperFunctions/hanldeFormActions";
import { convertToBaseAmount, getCurrencyMeta } from "../utils/currency";

interface AddTransactionFormPropsType {
  setModalState: (val: "category") => void;
}
const AddTransactionForm = ({ setModalState }: AddTransactionFormPropsType) => {
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState<string>("");
  const [payee, setPayee] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("select");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const categories = useAppSelector((state) => state.transaction.categories);
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);
  const currencyMeta = getCurrencyMeta(currencyKey);
  const selectedCategoryName =
    categories.find((cat) => String(cat.id) === categoryId)?.name ?? "";

  const dispatch = useAppDispatch();
  const Success = () => toast.success("Expense Added Successfully");
  const failed = (message: string) => toast.error(message);

  const transaction: expenseTranscationTypes = {
    id:1,
    paidTo: payee,
    date: date,
    amount: amount !== "" ? convertToBaseAmount(amount, currencyKey) : 0,
    categoryId: categoryId === "select" ? 0 : Number(categoryId),
    categoryName: selectedCategoryName,
    transactionId: "",
    createdAt: new Date(date).toString(),
    type: "expense",
  };

  return (
    <>
      <div className="form-card">
        <form
          onSubmit={(e) =>
            handleAddExpenseTransaction({
              e: e,
              setAmount: setAmount,
              setPayee: setPayee,
              category: categoryId,
              success: Success,
              failed: failed,
              amount: amount,
              dispatch: dispatch,
              transaction: transaction,
              setIsSubmitting: setIsSubmitting,
            })
          }
          className="flex flex-col gap-5"
        >
          {/* Amount */}
          <div className="relative">
            <label className="text-sm text-muted mb-1 block">Amount</label>
            <div className="flex items-center input">
              <span className="mr-2 text-muted">
                {currencyMeta.currencySymbol}
              </span>
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
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
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
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option key={"add-new-Key"} value="add new">
                Add new Category
              </option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTransactionForm;
