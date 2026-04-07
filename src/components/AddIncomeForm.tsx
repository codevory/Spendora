import { useState } from 'react'
import type { IncomeType } from '../types/transactionType'
import { useAppDispatch } from '../store/store'
import toast from 'react-hot-toast'
import { addIncomeTransaction } from '../store/features/incomeTransaction'
import { setTransactionError, setTransactionStatus } from '../store/features/transaction'

type IncomeFormPropsType = {
    setModalState:(val:"closed") => void;
}
const AddIncomeForm = ({setModalState}:IncomeFormPropsType) => {
    const [amount,setAmount] = useState<number | "">("")
    const [incomeSource,setIncomeSource] = useState<string>('')
    const [incomeDate,setIncomeDate] = useState<string>('')

    const dispatch = useAppDispatch()
    const success = (message:string) => toast.success(message)
    const failed = (message:string) => toast.error(message)


    function handleAddIncome(e:React.SubmitEvent<HTMLFormElement>){
     e.preventDefault();
     if(amount === 0 || incomeSource === '' || incomeDate === '') return failed("kindly fill all details");
     const addIncome:IncomeType = {
        amount : amount !== "" ? amount : 0,
        source : incomeSource,
        date : incomeDate,
        transactionId : crypto.randomUUID(),
        createdAt : Date.now()
     }

     try {
        dispatch(setTransactionError(null))
        dispatch(setTransactionStatus("pending"))
        dispatch(addIncomeTransaction(addIncome))
    } catch (error) {
        if(error instanceof Error){
            dispatch(setTransactionError({
                message:error.message,
                code:201
            }))
            failed(error.message)
        }
        console.error(error)
    }
    finally{
         success("🎉 income added successfully")
     }
     console.log(addIncome)
     setModalState("closed")
    }


  return (
<div className="form-card card mx-auto  min-h-70 min-w-100">
     <form onSubmit={(e) => handleAddIncome(e)} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1 relative'>
          <label className='text-muted block mb-1 text-sm'>amount</label>
          <input className='bg-transparent w-full outline-none input' type='number' 
          value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
      </div>
    
      <div className='flex flex-col gap-1 relative'>
          <label className='text-muted block mb-1 text-sm'>income source</label>
          <input className='bg-transparent w-full outline-none input' type='text' 
          value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} />
      </div>
    
      <div className='input-field'>
          <label className='text-muted block mb-1 text-sm'>income Date</label>
          <input className='bg-transparent w-full outline-none input' type='date' 
          value={incomeDate} onChange={(e) => setIncomeDate(e.target.value)} />
      </div>
    
      <button type='submit' className='btn-primary w-full active:scale-95'>Add</button>
    </form>

</div>
  )
}

export default AddIncomeForm
