import { useState } from 'react'
import Layout from '../components/Layout'
import MainContent from '../components/MainContent'

const DashBoardLayout = () => {
    const [isOpen,setIsOpen] = useState<boolean>(true)
  return (
    <div>
      <Layout onToggle={() => setIsOpen((p) => !p)}>
        <div className=''>
         <MainContent isOpen={isOpen} />
        </div>
      </Layout>
    </div>
  )
}

export default DashBoardLayout
