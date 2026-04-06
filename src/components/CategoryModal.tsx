import AddNewCategoryForm from './AddCategoryForm'

interface CategoryModalPropsType {
    onClose: () => void;
}
const CategoryModal = ({onClose}:CategoryModalPropsType) => {
   
  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4'>
        <div className='relative w-full max-w-md rounded-xl bg-white p-5 shadow-2xl'>
        <button onClick={onClose} className='primary-button absolute right-2 top-2'>Close</button>
          <AddNewCategoryForm />
        </div>
    </div>
  )
}

export default CategoryModal
