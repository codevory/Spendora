import { useParams } from 'react-router-dom';
import EmptyState from './EmptyState';
import type { TransactionType } from '../types/transactionType';

interface TransactionDetailsPropsType {
    data?:TransactionType[];
    dateFrom:string;
    setDateFrom:(value:string) => void;
    dateTo:string;
    setDateTo:(value:string) => void;
    handleSearchTxns:() => void;
}

const ViewTransactionDetails = ({data,dateFrom,dateTo,setDateFrom,setDateTo,handleSearchTxns}:TransactionDetailsPropsType) => {

    const { id } = useParams()
 
   if(data === undefined){
    return <EmptyState content={"No data found"} />
   }

        const tnxFound = data.find(tnx => tnx.transactionId === id)
  
    if(!tnxFound){
                return (
                    <EmptyState
                        content={
                            <div className='card glass flex min-h-72 flex-col justify-center gap-3 border border-slate-700 p-6 text-center'>
                                <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Transaction details</p>
                                <h3 className='text-xl font-semibold text-slate-100'>Select a transaction to inspect</h3>
                                <p className='text-sm leading-6 text-slate-400'>
                                    Use the list on the left to open a record. The detail panel will show amount, category, and transaction date here.
                                </p>
                                <div className='grid grid-cols-2 gap-3 text-left sm:grid-cols-3'>
                                    <div className='rounded-xl border border-slate-700 bg-slate-800/80 p-3'>
                                        <p className='text-[11px] uppercase tracking-wide text-slate-400'>Status</p>
                                        <p className='mt-1 text-sm font-semibold text-emerald-300'>Ready</p>
                                    </div>
                                    <div className='rounded-xl border border-slate-700 bg-slate-800/80 p-3'>
                                        <p className='text-[11px] uppercase tracking-wide text-slate-400'>Date filter</p>
                                        <p className='mt-1 text-sm font-semibold text-slate-100'>{dateFrom || 'Start'} → {dateTo || 'End'}</p>
                                    </div>
                                    <div className='rounded-xl border border-slate-700 bg-slate-800/80 p-3 sm:col-span-1'>
                                        <p className='text-[11px] uppercase tracking-wide text-slate-400'>Hint</p>
                                        <p className='mt-1 text-sm font-semibold text-slate-100'>Pick a transaction ID</p>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                )
    }


  return (
     <div className='space-y-4'>
        <div className='flex flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4'>
            <div className='flex items-start justify-between gap-3'>
                <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Focused record</p>
                    <h2 className='mt-1 text-xl font-semibold text-slate-100'>{tnxFound.name}</h2>
                    <p className='mt-1 text-sm text-slate-400'>Transaction ID: {tnxFound.transactionId}</p>
                </div>
                <span className='rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300'>
                    Expense
                </span>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <div className='rounded-xl border border-slate-700 bg-slate-800/70 p-3'>
                    <p className='text-xs uppercase tracking-wide text-slate-400'>Date range</p>
                    <div className='mt-2 flex items-center gap-2'>
                        <input
                            className='input min-w-0'
                            type='date'
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                        <span className='text-slate-400'>to</span>
                        <input
                            className='input min-w-0'
                            type='date'
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>
                    <div className='mt-3 flex flex-wrap gap-2'>
                        <button
                            className='rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600 active:scale-95'
                            onClick={() => handleSearchTxns()}
                        >
                            Apply filter
                        </button>
                        <span className='rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-300'>
                            {dateFrom || 'Start'} → {dateTo || 'End'}
                        </span>
                    </div>
                </div>

                <div className='rounded-xl border border-slate-700 bg-slate-800/70 p-3'>
                    <p className='text-xs uppercase tracking-wide text-slate-400'>Amount</p>
                    <div className='mt-2 flex items-center gap-3'>
                        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-300'>
                            ₹
                        </div>
                        <div>
                            <p className='text-2xl font-bold text-slate-100'>₹{tnxFound.amount}</p>
                            <p className='text-sm text-slate-400'>Recorded spending entry</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            <div className='rounded-xl border border-slate-700 bg-slate-800/70 p-3'>
                <p className='text-xs uppercase tracking-wide text-slate-400'>Category</p>
                <p className='mt-1 text-sm font-semibold text-slate-100'>{tnxFound.category}</p>
            </div>
            <div className='rounded-xl border border-slate-700 bg-slate-800/70 p-3'>
                <p className='text-xs uppercase tracking-wide text-slate-400'>Transaction date</p>
                <p className='mt-1 text-sm font-semibold text-slate-100'>
                    {new Date(tnxFound.date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                </p>
            </div>
            <div className='rounded-xl border border-slate-700 bg-slate-800/70 p-3'>
                <p className='text-xs uppercase tracking-wide text-slate-400'>Record status</p>
                <p className='mt-1 text-sm font-semibold text-emerald-300'>Visible in current filter</p>
            </div>
        </div>
     </div>
  )
}

export default ViewTransactionDetails
