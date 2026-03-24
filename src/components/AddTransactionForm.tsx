import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch } from '../store/store'
import type { TransactionType } from '../types/transactionType'
import { addTransaction, setTransactionError, setTransactionStatus } from '../store/features/transaction'

const AddTransactionForm = () => {
    type categoryType = "Food" | "Travel" | "Bills" | "Shopping" | "Other";
    const [amount,setAmount] = useState<number>(0)
    const [date,setDate] = useState<string>('')
    const [payee,setPayee] = useState<string>('')
    const [category,setCategory] = useState<categoryType>("Bills")

    const dispatch = useAppDispatch()
   // const error = useAppSelector((state) => state.transaction.error)
    const Success = () => toast.success("Expense Added Successfully");
    const failed = (message:string) => toast.error(message);
   // const Loading = () => toast.loading("Adding.. expense")
    const categories:categoryType[] = ["Food" , "Travel" , "Bills" , "Shopping" , "Other"]

    const transaction:TransactionType = {
      name:payee,
      date:date,
      amount:amount,
      category:category,
      transactionId:""
    }

    function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
     e.preventDefault();
     if(amount <= 0){
        failed("Failed to add,kindly add valid amount > 0");
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
     setAmount(0)
     setPayee('')
     setCategory('Food')
    }

  return (
    <div className='bg-gray-800 text-white font-semibold flex-col gap-5 w-2/3 justify-center items-center'>
    <h1 className='font-bold'>Add Expense</h1>
    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col gap-5 bg-blue-950 h-80 border-2 border-solid'>

        <div className='flex gap-2 sm:gap-5 h-12 items-center outline-1'>
           <label className='w-1/3 md:w-1/4'>Enter amount :</label>
           <input className='outline-none border-0 w-[40%]' placeholder="enter amount you spent" value={Number(amount)} 
           onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))} required />
        </div>
        
        <div className='flex gap-5 h-12 items-center outline-1'>
          <label>Select Date :</label>
          <input className='outline-none border-0 w-1/3' type="date" value={date} 
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} required />
        </div>

         <div className='flex gap-5 h-12 items-center outline-1'>
         <label>Payed to :</label>
         <input className='outline-none border-0 w-[40%]' type="text" placeholder='eg. Netflix, Youtube premium' value={payee} 
         onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPayee(e.target.value)} required />
         </div>
    
        <div className='flex gap-2 h-12 items-center outline-1'>
            <label>Category :</label>
            <select className='outline-none border-0 w-1/3' value={category} onChange={(e) => setCategory(e.target.value as categoryType)} required>
              {categories.map((cat) => (
             <option key={cat} value={cat} >{cat}</option>
             ))}
            </select> 
        </div>
    
       <button className='bg-pink-600 backdrop-blur-2xl w-30 h-10 rounded-xl p-1 cursor-pointer' type="submit">Add</button>
    </form>
    </div>
  )
}

export default AddTransactionForm
