import { useAppSelector } from '../store/store'
import { Link } from 'react-router-dom';

const TransactionsContent = () => {

    const data = useAppSelector((state) => state.transaction.transactions);
  return (
    <div className='transaction-container w-[55%] h-dvh overflow-y-scroll rounded-xl'>
        <div className=' border-2 rounded'>
            <div className='flex justify-between items-center mx-4'>
                <p className='font-bold m-2'>Id</p>
                <p className='font-bold m-2'>Transaction id</p>
                <p className='font-bold m-2'>₹ amount</p>
            </div>
   { data.map((tnx,idx) => (
       <div key={tnx.transactionId}>
            <Link to={`/transactions/tnx-details/${tnx.transactionId}`}>
            <div className='flex items-center justify-between px-4 py-1'>
            <p className='bg-black text-white p-2 rounded-xl m-2'>{idx + 1}</p>
            <span className='transaction-item'>{tnx.transactionId.slice(0,12)}</span>
            <span className='tag tag-entertainment'>₹ {tnx.amount}</span>
            </div>
        </Link>
        </div>
    ))}
        </div>
    </div>
  )
}

export default TransactionsContent
