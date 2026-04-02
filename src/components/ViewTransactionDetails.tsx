import { useAppSelector } from '../store/store'
import { useParams } from 'react-router-dom';
import EmptyState from './EmptyState';

const ViewTransactionDetails = () => {
    const { id } = useParams()
    const data = useAppSelector((state) => state.transaction.transactions);
    const tnxFound = data.find(tnx => tnx.transactionId === id)
  
    if(!tnxFound){
        return <EmptyState content={<div className='absolute top-10 right-60 animate-bounce card glass'>Select transaction to view</div>} />
    }

  return (
   <>
   {data.map((tnx,idx) => {
    if(tnx.transactionId === tnxFound?.transactionId){
        return <div key={tnx.transactionId} className='flex gap-2 flex-col justify-between p-2 transaction-card min-h-60 min-w-129'>
            <div className='flex gap-2 justify-between items-center'>
                <p className='flex justify-center items-center bg-slate-800 text-white rounded-full w-10 h-10'>{idx}</p>
                <h2 className='text-secondary font-bold font-serif tag rounded-sm p-1 bg-slate-900'>{tnxFound.name}</h2>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <span className={`deduct-amount font-mono font-bold bg-slate-900 w-16 h-16 rounded-full 
                flex justify-center items-center hover:animate-bounce`}>
                    <p className='text-white text-center'>₹</p>{tnxFound.amount}</span>
                <p className='transaction-item  min-h-14 hover:text-white hover:font-medium '>{tnxFound.transactionId}</p>
            </div>
            <div className='flex justify-between'>
                <p className='text-muted bg-slate-900 rounded-sm p-1'>{tnxFound.date}</p>
                <p className={`text-muted rounded-sm p-1 bg-slate-900`}>{tnxFound.category}</p>
            </div>
        </div>
    }
    
})}
   </>
  )
}

export default ViewTransactionDetails
