import { useState } from "react";
import { useAppSelector } from "../store/store";
import toast from "react-hot-toast";
import { handleAddIncomeTransaction } from "../utils/helperFunctions/handleFormActions";
import { convertToBaseAmount, getCurrencyMeta } from "../utils/currency";
import { useAddIncomeTxnMutation } from "../store/features/transactionApi";

type IncomeFormPropsType = {
  setModalState: (val: "closed") => void;
};
const AddIncomeForm = ({ setModalState }: IncomeFormPropsType) => {
  const [amount, setAmount] = useState<number | "">("");
  const [incomeSource, setIncomeSource] = useState<string>("");
  const [incomeDate, setIncomeDate] = useState<string>("");
  const [isSubmitting,setIsSubmitting] = useState<boolean>(false)
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);
  const currencyMeta = getCurrencyMeta(currencyKey);

  const success = (message: string) => toast.success(message);
  const failed = (message: string) => toast.error(message);
  const [addIncomeTxn] = useAddIncomeTxnMutation();

  const onSubmit = handleAddIncomeTransaction;
  return (
    <div className="form-card min-h-70">
      <form
        onSubmit={(e) =>
          onSubmit({
            e: e,
            setModalState: setModalState,
            success: success,
            incomeDate: incomeDate,
            setIsSubmitting:setIsSubmitting,
            incomeSource: incomeSource,
            amount:
              amount === "" ? 0 : convertToBaseAmount(amount, currencyKey),
            failed: failed,
            addIncomeTxn,
          })
        }
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1 relative">
          <label className="text-muted block mb-1 text-sm">
            amount ({currencyMeta.currencySymbol})
          </label>
          <input
            className="bg-transparent w-full outline-none input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </div>

        <div className="flex flex-col gap-1 relative">
          <label className="text-muted block mb-1 text-sm">income source</label>
          <input
            className="bg-transparent w-full outline-none input"
            type="text"
            value={incomeSource}
            onChange={(e) => setIncomeSource(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 relative">
          <label className="text-muted block mb-1 text-sm">
            income received
          </label>
          <input
            className="bg-transparent w-full outline-none input"
            type="date"
            value={incomeDate}
            onChange={(e) => setIncomeDate(e.target.value)}
          />
        </div>

        <button disabled={isSubmitting} type="submit" className="btn-primary w-full active:scale-95">
          {isSubmitting ? "Adding.." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddIncomeForm;
