import { useAppSelector } from "../store/store"

const RecentTransactions = () => {
const data = useAppSelector((state) => state.transaction.transactions)


return (
  <div className="card mt-6">
  <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

  {data.map((item) => (
    <div className="transaction-item border-b border-slate-700 last:border-none">
      
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-muted">
          {item.date} • {getDayName(item.date)}
        </p>
      </div>

      <p className="text-red-400 font-semibold">
        -₹{item.amount}
      </p>

    </div>
  ))}
</div>
)

}

export default RecentTransactions

function getDayName(dateString:string){
  return new Date(dateString).toLocaleDateString("en-us",{
    weekday:"short",
  })
}