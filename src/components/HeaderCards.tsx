import type { IncomeType, TransactionType } from '../types/transactionType'
import { useAppSelector } from '../store/store'
import EmptyState from './EmptyState'

interface HeaderCardsPropsType {
  setModalState:(val:"income") => void;
}

const HeaderCards = ({setModalState}:HeaderCardsPropsType) => {
    const selectedState = useAppSelector((state) => state.transaction.transactions)
    const userIncome = useAppSelector((state) => state.incomeTransaction.incomeTransactions)
    const transactions = Array.isArray(selectedState) ? selectedState : []
    const now = new Date;
    const date = new Date(now.getFullYear(),now.getMonth(),1);
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    if(transactions.length === 0){
      return <EmptyState content={"No data found"} />
    }

    const topCategory = getTopCategory(transactions)
    const monthlyData = getMonthlyData(transactions,currentMonth,currentYear)
    const monthlyIncome = getMonthlyIncome(userIncome)
    const monthlyIncomeChange = getMonthlyIncomeChangePercent(userIncome,currentMonth,currentYear)

  return (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="p-3 md:p-6 bg-slate-800 rounded-2xl border glass border-slate-700 shadow-lg">
     <p className="text-slate-400 text-sm font-medium">Total Balance</p>
     <div className='flex gap-2 items-center'>
       <h2 className="text-xl md:text-3xl font-bold text-white mt-1">₹{monthlyIncome}</h2>
       <button onClick={() => setModalState("income")} className=' px-4 py-1 bg-blue-900 rounded-xl active:scale-95 cursor-pointer'>Add</button>
     </div>
    <div className={`mt-2 md:mt-4 text-xs font-medium ${monthlyIncomeChange <= 0 ? 'text-red-400' : 'text-green-400'}`}>
      {monthlyIncomeChange > 0 ? '+' : ''}{monthlyIncomeChange.toFixed(2)}% from last month</div>
  </div>
  
  <div className="p-3 md:p-6 bg-slate-800 rounded-2xl border glass border-slate-700 shadow-lg">
    <p className="text-slate-400 text-sm font-medium">Monthly Spending</p>
    <h2 className="text-xl md:text-3xl font-bold text-white mt-1">₹{monthlyData}</h2>
    <div className="mt-4 h-1 w-full bg-slate-700 rounded-full">
        <div className="h-1 bg-indigo-500 rounded-full width: 45%"></div>
    </div>
  </div>

  <div className="p-3 md:p-6 bg-slate-800 rounded-2xl border glass border-slate-700 shadow-lg">
    <p className="text-slate-400 text-sm font-medium">Top Category</p>
    <h2 className="text-xl md:text-3xl font-bold text-white mt-1">{`${topCategory.category ?? 'Top Category' }`}</h2>
    <div className="mt-2 md:mt-4 flex items-center gap-2">
        <span className="p-1 bg-orange-500/20 text-orange-500 rounded">icon</span>
        <span className="text-xs text-slate-400">Largest expense this week</span>
    </div>
  </div>
</div>
  )
}

export default HeaderCards


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

function getMonthlyData(transactions:TransactionType[],currentMonth:number,currentYear:number){
    if(!transactions.length){
     return 0;
  }

  return transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    )
  }).reduce((total,t) => total + t.amount,0);
}

function getMonthlyIncome(transactions:IncomeType[]){
 if(!transactions.length) return 0;
 return transactions.reduce((acc,amt) => acc + amt.amount,0) || 0
}


function getMonthlyIncomeChangePercent(
  transactions: IncomeType[],
  currentMonth: number, // 0-11
  currentYear: number
): number {
  if (!transactions.length) return 0;

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentTotal = transactions
    .filter((txn) => {
      const d = new Date(txn.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, t) => acc + t.amount, 0);

  const prevTotal = transactions
    .filter((txn) => {
      const d = new Date(txn.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    })
    .reduce((acc, t) => acc + t.amount, 0);

  if (prevTotal === 0) {
    return currentTotal > 0 ? 100 : 0;
  }

  return ((currentTotal - prevTotal) / prevTotal) * 100;
}