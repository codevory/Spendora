import { useAppSelector } from "../store/store"

const RecentTransactions = () => {
const data = useAppSelector((state) => state.transaction.transactions)
    
  return (
    <div>
      {data.map((item) => (
        <span key={item.transactionId} className="flex gap-3"><b>${item.amount}</b> | <p>{'Tue'}</p> | {<b>{item.name}</b>}</span>
      ))}
    </div>
  )
}

export default RecentTransactions
