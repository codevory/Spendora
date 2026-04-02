import { useState } from 'react'
import Layout from '../components/Layout'
import TransactionsContent from '../components/TransactionsContent'
import SidebarMenu from '../components/SidebarMenu'
import ViewTransactionDetails from '../components/ViewTransactionDetails'
import TrendGraph from '../charts/TrendGraph'

const TransactionLayout = () => {
  const [isOpen,setIsOpen] = useState<boolean>(true)
  return (<div className=''>
      <Layout onToggle={() => setIsOpen((p) => !p)}>
        <div className='flex gap-4 transaction-layout bg-main  '>
           <div className={` ${isOpen ? 'w-[14%] transform-content' : 'w-[6%] transform-content -transate-x-20' } sidebar bg-green-900`}>
            <SidebarMenu isOpen={isOpen} />
           </div>
           <div className='flex mt-2 justify-center w-screen h-dvh'>

           <TransactionsContent />

           <div className='flex flex-col gap-5 items-center w-fit'>
           <ViewTransactionDetails />
           <div className='w-full h-full min-w-140 min-h-110'>
            <TrendGraph />
           </div>
           </div>
           </div>
        </div>
      </Layout>
  </div>
  )
}

export default TransactionLayout
