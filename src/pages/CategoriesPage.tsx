import AddCategoriesForm from '../components/AddCategoryForm'
import DisplayAvailableCategories from '../components/DisplayAvailableCategories'
import Layout from '../components/Layout'
import { useAppSelector } from '../store/store'

interface CategoriesPagePropsType {
  onToggle:() => void;
  isOpen:boolean;
}
const CategoriesPage = ({onToggle,isOpen}:CategoriesPagePropsType) => {
    const data = useAppSelector((state) => state.transaction.transactions)

  return (
<>
    <Layout onToggle={onToggle} isOpen={isOpen} >
          <div className='bg-main grid grid-cols-2 h-full'>
            <div className='w-1/2 clear-both'>
              <AddCategoriesForm />
            </div>
            <div className='w-2/3'>
              <DisplayAvailableCategories data={data} />
            </div>
          </div>
            
     </Layout>
</>
  )
}

export default CategoriesPage
