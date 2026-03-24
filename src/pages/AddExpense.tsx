import AddTransactionForm from "../components/AddTransactionForm"
import { deleteTransaction } from "../store/features/transaction"
import { useAppDispatch, useAppSelector } from "../store/store"

const AddExpense = () => {
    const data = useAppSelector((state) => state.transaction.transactions)
    const dispatch = useAppDispatch()
  return (
    <div className="flex-col gap-20 bg-sky-900 flex justify-center items-center h-dvh">
      <AddTransactionForm />
      <div className="bg-gray-700">
        <ul className="flex flex-col gap-2">
       {data.map((tx) => <li key={tx.transactionId} className="flex gap-3 "><span className="flex gap-3">{tx.amount} {tx.name}</span>
       <button className=" w-20 h-10 flex justify-center items-center bg-red-700 text-white font-medium rounded-xl cursor-pointer" onClick={() => dispatch(deleteTransaction(tx.transactionId))}>Delete</button>
       </li>
    )}
        </ul>
      </div>
    </div>
  )
}

export default AddExpense
