import { useAppSelector } from "../store/store"

const RecentTransactions = () => {
const data = useAppSelector((state) => state.transaction.transactions)

const copy = [...data]
return (
  <div className="card mt-6">
  <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

  {copy.sort((a,b) => b.createdAt - a.createdAt).map((item) => {

    return (
      <div key={item.transactionId} className="transaction-item border-b border-slate-700 last:border-none">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-muted">
          {formateDate().format(new Date(item.date))} • {getDayName(item.date)}
        </p>
      </div>

      <p className="text-red-400 font-semibold">
        -₹{item.amount}
      </p>

    </div>
    )
  })}
</div>
)

}

export default RecentTransactions

function getDayName(dateString:string){
  return new Date(dateString).toLocaleDateString("en-us",{
    weekday:"short",
  })
}

function formateDate(){
  return  new Intl.DateTimeFormat("en-Us",{
    year:"numeric",
    day:"2-digit",
    month:"long",
  })

}