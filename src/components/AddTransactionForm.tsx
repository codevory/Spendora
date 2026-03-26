import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch } from '../store/store'
import type { TransactionType } from '../types/transactionType'
import { addTransaction, setTransactionError, setTransactionStatus } from '../store/features/transaction'
import '../App.css'

const AddTransactionForm = () => {
    type categoryType = "Food" | "Travel" | "Bills" | "Shopping" | "Other";
    const [amount,setAmount] = useState<number | "">("")
    const [date,setDate] = useState<string>('')
    const [payee,setPayee] = useState<string>('')
    const [category,setCategory] = useState<categoryType>("Bills")

    const dispatch = useAppDispatch()
    const Success = () => toast.success("Expense Added Successfully");
    const failed = (message:string) => toast.error(message);
    const categories:categoryType[] = ["Food" , "Travel" , "Bills" , "Shopping" , "Other"]

    const transaction:TransactionType = {
      name:payee,
      date:date,
      amount:amount ? amount : Number(amount),
      category:category,
      transactionId:""
    }

    function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
     e.preventDefault();
     if(amount !== "" && amount <= 0){
        failed("kindly add valid amount");
        return;
     }
     const tId = crypto.randomUUID();
    
     const transactionData:TransactionType = {
        ...transaction,
        transactionId:tId
     }

     try {
        dispatch(setTransactionStatus("pending"))

         dispatch(setTransactionError(null))

        dispatch(addTransaction(transactionData))

        dispatch(setTransactionStatus("success"))
        console.log(transactionData)
     } catch (err) {
        if(err instanceof Error){
           dispatch(
            setTransactionError({message:err.message,code:500})
           )
        }
        else{
           dispatch(setTransactionError({message:"Error Unknown",code:404}))
            console.log(err)
        }
        dispatch(setTransactionStatus("failed"))
        //toast message
        failed("Failed to add Expense")
     }
     finally{
        Success()
     }
     setAmount("")
     setPayee('')
     setCategory('Food')
    }

  return (
   <div className="card w-full max-w-md mx-auto">
  <form 
    onSubmit={handleSubmit}
    className="flex flex-col gap-5"
  >

    {/* Amount */}
    <div className="relative">
      <label className="text-sm text-muted mb-1 block">Amount</label>
      <div className="flex items-center input">
        <span className="mr-2 text-muted">$</span>
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
        onChange={(e) => setCategory(e.target.value as categoryType)}
        className="input"
        required
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    {/* Button */}
    <button
      type="submit"
      className="btn-primary w-full active:scale-95"
    >
      Add Expense
    </button>

  </form>
</div>
  )
}

export default AddTransactionForm
