import type { TransactionType } from '../types/transactionType'
import EmptyState from './EmptyState'
import { safeParseArray } from '../utils/safeParseArray'
interface DisplayCategoriesPropsType {
    data:TransactionType[]
}
const DisplayAvailableCategories = ({data}:DisplayCategoriesPropsType) => {
    if(!data.length) return <EmptyState content={"No data available"} />
    const categories = safeParseArray<string>(localStorage.getItem("userCategories"))
  return (
    <div>
        <ul>
      {categories.map((txn) => (
        <li key={txn}>{txn}</li>
      ))}
        </ul>
    </div>
  )
}

export default DisplayAvailableCategories
