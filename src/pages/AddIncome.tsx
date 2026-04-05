import { useState } from 'react'
import Layout from '../components/Layout'
import AddIncomeForm from '../components/AddIncomeForm'
import SidebarMenu from '../components/SidebarMenu'

const AddIncome = () => {
const [isOpen,setIsOpen] = useState<boolean>(false)

  return (
    <>
      <Layout onToggle={() => setIsOpen((p) => !p)} >
        <div className='flex w-dvw max-h-dvh'>
          <div className={` ${isOpen ? 'w-[14%] transform-content' : 'w-[6%] transform-content -transate-x-20' } sidebar bg-green-900`}>
              <SidebarMenu isOpen={isOpen} />
           </div>

           <div className='form-container'>
              <AddIncomeForm />
           </div>
        </div>
      </Layout>
    </>
  )
}

export default AddIncome
