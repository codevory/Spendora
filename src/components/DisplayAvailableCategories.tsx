import type { CategoryPropsType, TransactionType } from '../types/transactionType'
import EmptyState from './EmptyState'
import { useAppDispatch, useAppSelector } from '../store/store'
import { deleteCategory } from '../store/features/transaction'
interface DisplayCategoriesPropsType {
    data:TransactionType[]
}
const DisplayAvailableCategories = ({data}:DisplayCategoriesPropsType) => {
    if(!data.length) return <EmptyState content={"No data available"} />
    const categories = useAppSelector((state) => state.transaction.categories)
    const dispatch = useAppDispatch()

    
    function handleDelete(category:CategoryPropsType){
    try {
      dispatch(deleteCategory(category))
    } catch (error) {
      console.error(error)
    }
    }
  return (
    <div>
        <ul>
      {categories.map((txn) => (
        <div key={txn.id} className='flex gap-4 bg-gray-800'>
          <li>{txn.name}</li>
          <button className='primary-button bg-red-600 text-white active:scale-95 font-semibold' onClick={() => handleDelete(txn)}>delete</button>
        </div>
      ))}
        </ul>
    </div>
  )
}

export default DisplayAvailableCategories
