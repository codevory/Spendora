import { useState } from 'react'
import { HiOutlineMenu } from "react-icons/hi"
import AddTransactionForm from "../components/AddTransactionForm"
import RecentTransactions from "../components/RecentTransactions"
import SidebarMenu from "../components/SidebarMenu"
import { useAppSelector } from '../store/store'
import type { TransactionType } from '../types/transactionType'
import DistributionGraph from '../charts/DistributionGraph'
import OverviewGraph from '../charts/OverviewGraph'
import TrendGraph from '../charts/TrendGraph'
import Layout from '../components/Layout'
import Dashboard from './Dashboard'
import MainContent from '../components/MainContent'

const TestLayout = () => {
    const [isOpen,setIsOpen] = useState<boolean>(true)
    const selectedState = useAppSelector((state) => state.transaction.transactions)
    const topCategory = getTopCategory(selectedState)
    const monthlyData = getMonthlyData(selectedState)
    const [activeGraph,setActiveGraph] = useState<string>("bar")
  return (
    <div>
      <Layout onToggle={() => setIsOpen((p) => !p)}>
        <div className=''>
         <MainContent isOpen={isOpen} />
        </div>
      </Layout>
    </div>
  )
}

export default TestLayout



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