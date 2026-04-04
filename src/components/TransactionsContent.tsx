import { Link } from 'react-router-dom';
import { useState,useMemo } from 'react'
import type { TransactionType } from '../types/transactionType';
import EmptyState from './EmptyState';


interface TransactionsContentPropsType {
    query? : TransactionType['category'],
    data:TransactionType[]
}

const TransactionsContent = ({query,data}:TransactionsContentPropsType) => {
    const [localData,setLocalData] = useState<TransactionType[]>([])

    useMemo(() => {
        if(query === undefined){
            setLocalData(data);
            return
        }
    const result = data.filter((txn) => txn.category === query)
    setLocalData(result)
    },[query,data])
   

     const noData =  <div className='transaction-container h-dvh min-h-100 overflow-y-scroll rounded-xl'>
        <div className=' border-2 rounded px-3 py-1'>
            <div className='flex justify-between items-center mx-4'>
                <p className='font-bold m-2'>Id</p>
                <p className='font-bold m-2'>Transaction id</p>
                <p className='font-bold m-2'>₹ amount</p>
            </div>
            <div className='flex justify-center flex-col gap-1'>
           <h2 className='font-semibold text-red-500 text-xl'>No data to display</h2>
           <p className='text-xm text-white'>add expenses to view transactions</p>
            </div>
        </div>
    </div>

    if(!localData.length){
        return <EmptyState content={noData} />
    }

  return (
    <div className='transaction-container max-h-dvh overflow-y-scroll rounded-xl'>
        <div className=' border-2 rounded'>
            <div className='flex justify-between items-center mx-4'>
                <p className='font-bold m-2'>Id</p>
                <p className='font-bold m-2'>Transaction id</p>
                <p className='font-bold m-2'>₹ amount</p>
            </div>
            {localData.map((txn,idx) => (
       <div key={txn.transactionId}>
            <Link to={`/transactions/tnx-details/${txn.transactionId}`}>
            <div className='flex items-center justify-between px-4 py-1'>
            <p className='bg-black text-white p-2 rounded-xl m-2'>{idx + 1}</p>
            <span className='transaction-item'>{txn.transactionId.slice(0,12)}</span>
            <span className='tag tag-entertainment'>₹ {txn.amount}</span>
            </div>
        </Link>
        </div>
            ))}
        </div>
    </div>
  )
}

export default TransactionsContent
