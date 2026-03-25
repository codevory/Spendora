import { useState } from 'react'
import { HiOutlineMenu } from "react-icons/hi"
import AddTransactionForm from "../components/AddTransactionForm"
import RecentTransactions from "../components/RecentTransactions"
import SidebarMenu from "../components/SidebarMenu"


const AddExpense = () => {
  const [isOpen,setIsOpen] = useState<boolean>(true)

  return (
    <div className=" bg-sky-900 flex flex-col p-2 overflow-hidden">
      <div className="bg-red-400 w-full h-20 flex items-center px-2">
        <HiOutlineMenu onClick={() => setIsOpen((p) => !p)} startOffset={2} stroke="blue" className="h-10 w-10 cursor-pointer active:scale-95" />
      </div>

      <div className="w-full h-dvh flex gap-5">

      {/* //left side */}
      <div className={` ${isOpen ? 'w-[17%] transform-content' : 'w-[6%] transform-content -transate-x-20' } h-full bg-green-900`}>
      <SidebarMenu isOpen={isOpen} />
      </div> 

      <div className="w-full">  
      <AddTransactionForm />
      <div className="bg-gray-400">
      <RecentTransactions />
      </div>
      </div>
      {/* //right side */}

      <div className="bg-purple-700 w-1/3">
        <h2> recent transactions </h2>
        <div>
            <RecentTransactions />
        </div>
      </div>
      </div>

    </div>
  )
}

export default AddExpense
