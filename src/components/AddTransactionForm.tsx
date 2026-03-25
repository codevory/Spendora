import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch } from '../store/store'
import type { TransactionType } from '../types/transactionType'
import { addTransaction, setTransactionError, setTransactionStatus } from '../store/features/transaction'

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
    <div className='bg-gray-800 text-white font-semibold w-full px-2 py-3 rounded '>
    <form onSubmit={(e) => handleSubmit(e)} 
    className='flex flex-col items-center p-2 bg-blue-950 h-100 border-2 border-solid'>

      <div className='w-full h-95 gap-5 flex flex-col '>
           <div className=' p-2 flex justify-start sm:gap-5 outline-0 items-center mt-2'>
              <span className=''>
                <p className=' font-semibold w-px text-2xl'>$</p>
              </span>
              <span className=' relative w-full'>
              <input  className='outline-0 border-2 m-0 px-2 w-full rounded-xl h-12 font-mono text-xl ' 
              type='number' placeholder="enter amount" value={amount} 
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))} required />
              <label className={`absolute   bottom-11.5 bg-gray-800 left-3 font-mono text-[14px]`} >Amount</label>
              </span>

           </div>

           <div className='flex relative gap-2 p-1 sm:gap-5 outline-0 items-center'>
              <label className={`absolute   bottom-11.5 bg-gray-800 left-3 font-mono text-[14px]`}>Select Date</label>
              <input className='outline-0 border-2 px-2 rounded-xl h-13 w-full font-mono text-xl '  type="date" value={date} 
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} required />
           </div>

           <div className='flex relative gap-2 p-1 sm:gap-5 outline-0 items-center'>
               <label className={`absolute   bottom-11.5 bg-gray-800 left-3 font-mono text-[14px]`}>Payed to</label>
               <input className='outline-0 border-2 px-2 rounded-xl h-13 w-full font-mono text-xl ' 
               type="text" placeholder='eg. Netflix, Youtube premium' value={payee} 
               onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPayee(e.target.value)} required />
           </div>

           <div className='flex relative gap-2 p-1 sm:gap-5 outline-0 items-center'>
              <label className={`absolute   bottom-11.5 bg-gray-800 left-3 font-mono text-[14px]`}>Category</label>
              <select className='outline-0 border-2 px-2 rounded-xl h-13 w-full font-mono text-xl bg-blue-950' 
                 value={category} onChange={(e) => setCategory(e.target.value as categoryType)} required>
                 {categories.map((cat) => (
                 <option key={cat} value={cat} >{cat}</option>))}
              </select> 
           </div>
      </div>
        
       <button className='bg-pink-600 backdrop-blur-2xl w-60 h-12 rounded-xl p-1 cursor-pointer active:scale-95' 
       type="submit">Add</button>
    </form>
    </div>
  )
}

export default AddTransactionForm
