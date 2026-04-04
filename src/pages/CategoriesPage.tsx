import AddCategoriesForm from '../components/AddCategoryForm'
import DisplayAvailableCategories from '../components/DisplayAvailableCategories'
import Layout from '../components/Layout'
import SidebarMenu from '../components/SidebarMenu'
import { useAppSelector } from '../store/store'
import { useState } from 'react'

const CategoriesPage = () => {
    const [isOpen,setIsOpen] = useState<boolean>(true)
    const data = useAppSelector((state) => state.transaction.transactions)
  return (
<>
    <Layout onToggle={() => setIsOpen((p) => !p)} >
    <div className='flex w-dvw '>
          <div className={` ${isOpen ? 'w-[14%] transform-content' : 'w-[6%] transform-content -transate-x-20' } sidebar bg-green-900`}>
            <SidebarMenu isOpen={isOpen} />
          </div>

          <div className='bg-main w-dvw grid grid-cols-2 '>
            <div className='w-1/2 clear-both bg-orange-900'>
              <AddCategoriesForm />
            </div>
            <div className='w-2/3 bg-blue-900'>
              <DisplayAvailableCategories data={data} />
            </div>
          </div>
            
    </div>
     </Layout>
</>
  )
}

export default CategoriesPage
