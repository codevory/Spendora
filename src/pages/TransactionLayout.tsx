import { useState } from 'react'
import Layout from '../components/Layout'
import TransactionsContent from '../components/TransactionsContent'
import ViewTransactionDetails from '../components/ViewTransactionDetails'
import TrendGraph from '../charts/TrendGraph'
import { useAppSelector } from '../store/store'
import type { TransactionType } from '../types/transactionType'

interface TransactionLayoutProps {
  onToggle:() => void;
  isOpen:boolean;
}

const TransactionLayout = ({onToggle,isOpen}:TransactionLayoutProps) => {
  const [query,setQuery] = useState<TransactionType['category'] | undefined>()
  const [dateFrom,setDateFrom] = useState<string>("")
  const [dateTo,setDateTo] = useState<string>("")
  const data = useAppSelector((state) => state.transaction.transactions)
  const [filteredData,setFilteredData] = useState<TransactionType[] | undefined>(undefined)
  const categories = [...new Set(data.map((txn) => txn.category))] as TransactionType['category'][]


  const handleSearchTxns = () => {
    if (!dateFrom || !dateTo) {
      setFilteredData(data);
      return;
    }

    const start = new Date(dateFrom);
    const end = new Date(dateTo);

    const nextFilteredData = data.filter((txn) => {
      const date = new Date(txn.date);
      return date >= start && date <= end;
    });

    setFilteredData(nextFilteredData);
  }


  return (
  <>
      <Layout onToggle={onToggle} isOpen={isOpen}>
           <div className='grid grid-cols-2 gap-2 bg-main '>
            <div className=''>
              <select value={query ?? ''} onChange={(e) => setQuery(e.target.value ? (e.target.value as TransactionType['category']) : undefined)}>
              <option value=''>All Categories</option>
             {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
             ))}
              </select>
           <TransactionsContent query={query} data={filteredData ?? data} />
            </div>


           <div className='flex flex-col gap-5 items-center'>
           <ViewTransactionDetails data={filteredData ?? data} dateFrom={dateFrom} dateTo={dateTo} setDateFrom={setDateFrom} setDateTo={setDateTo} handleSearchTxns={handleSearchTxns} />
           <div className='min-w-140 min-h-110'>
            <TrendGraph />
           </div> 
           </div>
           </div>
      </Layout>
  </>
  )
}

export default TransactionLayout
