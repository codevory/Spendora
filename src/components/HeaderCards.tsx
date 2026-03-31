import type { TransactionType } from '../types/transactionType'
import { useAppSelector } from '../store/store'

const HeaderCards = () => {
    const selectedState = useAppSelector((state) => state.transaction.transactions)
    const topCategory = getTopCategory(selectedState)
    const monthlyData = getMonthlyData(selectedState)

  return (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="p-6 bg-slate-800 rounded-2xl border glass border-slate-700 shadow-lg">
    <p className="text-slate-400 text-sm font-medium">Total Balance</p>
    <h2 className="text-3xl font-bold text-white mt-1">₹12,423</h2>
    <div className="mt-4 text-xs text-green-400 font-medium">+2.5% from last month</div>
  </div>
  
  <div className="p-6 bg-slate-800 rounded-2xl border glass border-slate-700 shadow-lg">
    <p className="text-slate-400 text-sm font-medium">Monthly Spending</p>
    <h2 className="text-3xl font-bold text-white mt-1">₹{monthlyData}</h2>
    <div className="mt-4 h-1 w-full bg-slate-700 rounded-full">
        <div className="h-1 bg-indigo-500 rounded-full width: 45%"></div>
    </div>
  </div>

  <div className="p-6 bg-slate-800 rounded-2xl border glass border-slate-700 shadow-lg">
    <p className="text-slate-400 text-sm font-medium">Top Category</p>
    <h2 className="text-3xl font-bold text-white mt-1">{`${topCategory.category ?? 'Top Category' }`}</h2>
    <div className="mt-4 flex items-center gap-2">
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