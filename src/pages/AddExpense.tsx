import { useState } from 'react'
import { HiOutlineMenu } from "react-icons/hi"
import AddTransactionForm from "../components/AddTransactionForm"
import RecentTransactions from "../components/RecentTransactions"
import SidebarMenu from "../components/SidebarMenu"
import { useAppSelector } from '../store/store'
import type { TransactionType } from '../types/transactionType'


const AddExpense = () => {
  const [isOpen,setIsOpen] = useState<boolean>(true)
const topCategory = useAppSelector((state) => getTopCategory(state.transaction.transactions))
const monthlyData = useAppSelector((state) => getMonthlyData(state.transaction.transactions))


  return (
    <div className=" bg-sky-900 gap-1 flex flex-col p-2 overflow-hidden">
      <div className="bg-red-400 w-full h-15 flex items-center px-2">
        <HiOutlineMenu onClick={() => setIsOpen((p) => !p)} startOffset={2} stroke="blue" className="h-10 w-10 cursor-pointer active:scale-95" />
      </div>
       
      <div className="w-full h-dvh flex gap-5">

      {/* //left side */}
      <div className={` ${isOpen ? 'w-[14%] transform-content' : 'w-[6%] transform-content -transate-x-20' } h-full bg-green-900`}>
      <SidebarMenu isOpen={isOpen} />
      </div> 

   <div className='w-full flex flex-col gap-2 bg-main'>
      <div className='flex gap-2 justify-between items-center p-3 rounded bg-blue-300 h-34'>
          <div className='dashboard-card card-redish flex-col '>
            <p className='text-sm opacity-80'>Total balance</p>
            <h2 className='text-3xl font-bold '>₹12,423</h2>
          </div>

          <div className='dashboard-card card-yellowish flex-col '>
            <p className='text-sm opacity-80'>📉 Monthly Spending</p>
            <h2 className='text-3xl font-bold '>₹{monthlyData}</h2>
          </div>

           <div className='dashboard-card card-redish flex gap-1 flex-col '>
            <p className='text-sm opacity-80'>Top category</p>
            <p>{topCategory.category}</p>
            <h2 className='text-3xl font-bold '>₹{topCategory.amount}</h2>
          </div>
      </div>
   <div className='w-full flex gap-2'>
      <div className="flex gap-1 w-full">  

      <div className='bg-blue-300 w-[70%] flex justify-center items-center'>
        <div className='bg-red-400 text-black font-bold text-2xl'>chart 1</div>
      </div>

        <div className='w-1/3'>
          <AddTransactionForm />
        </div>

      </div>
      {/* //right side */}

    </div>
        <div className='transactions-box overflow-y-scroll h-[26%]'>
            <RecentTransactions />
        </div>
    
      </div>
      </div>

    </div>
  )
}

export default AddExpense

function getTopCategory(transactions:TransactionType[]){
  const map:Record<string,number> = {};
  if(!transactions.length) return {category:null,amount:0};

  transactions.forEach((t) => {
    map[t.category] = (map[t.category] || 0 ) + t.amount ;
  });

 const entries = Object.entries(map);
 if(!entries.length) return {category:null,amount:0};

 const [category,amount] = entries.length ? entries.reduce((max,curr) => (curr[1] > max[1] ? curr : max)) : [null,0]

return {category,amount};
}

function getMonthlyData(transactions:TransactionType[]){
  const now = new Date;
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    )
  }).reduce((total,t) => total + t.amount,0);
}