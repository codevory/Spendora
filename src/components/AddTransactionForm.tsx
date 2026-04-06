import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../store/store'
import type { TransactionType } from '../types/transactionType'
import { addTransaction, setTransactionError, setTransactionStatus } from '../store/features/transaction'
import '../App.css'

interface AddTransactionFormPropsType {
  setShowModal:(show:boolean) => void;
}
const AddTransactionForm = ({setShowModal}:AddTransactionFormPropsType) => {
  const [amount,setAmount] = useState<number | "">("")
  const [date,setDate] = useState<string>('')
  const [payee,setPayee] = useState<string>('')
  const [category,setCategory] = useState<string>("select")
  const categories = useAppSelector((state) => state.transaction.categories)
  
  const dispatch = useAppDispatch()
  const Success = () => toast.success("Expense Added Successfully");
  const failed = (message:string) => toast.error(message);

    
     const transaction:TransactionType = {
      name:payee,
      date:date,
      amount:amount !== "" ? amount : Number(amount),
      category:category,
      transactionId:"",
      createdAt:Number(new Date()),
    }

    function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
     e.preventDefault();
     if(amount !== "" && amount <= 0){
        failed("kindly add valid amount");
        return;
     }
     if(category === undefined || category.trim() === "add new" || 
     category.trim() === "select" || category.trim() === ""){
      return failed("Kindly select category")
     }

     const tId = `txn-${Date.now().toFixed(4)}-${new Date().getMilliseconds().toFixed(2)}`;
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
        setAmount("")
        setPayee('')
        setCategory('select')
     }
    }
    
      return (<>
        <div className="form-card card mx-auto">
  <form 
    onSubmit={handleSubmit}
    className="flex flex-col gap-5"
  >

    {/* Amount */}
    <div className="relative">
      <label className="text-sm text-muted mb-1 block">Amount</label>
      <div className="flex items-center input">
        <span className="mr-2 text-muted">₹</span>
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
        onChange={(e) =>{ 
          setCategory(e.target.value)
          if (e.target.value.trim() === 'add new') {
            setShowModal(true)
          }
        }}
        className="input"
        required
      >
        <option key={'select-key'} value={'select'}>select</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
        <option key={'add-new-Key'} value="add new">Add new Category</option>
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
      </>
  )
}

export default AddTransactionForm
