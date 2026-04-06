import Layout from '../components/Layout'
import MainContent from '../components/MainContent'
import CategoryModal from '../components/CategoryModal';
import {createPortal} from 'react-dom'
import { useState } from 'react';

interface DashboardPropsType {
  onToggle:() => void;
  isOpen:boolean;
}
const DashBoardLayout = ({onToggle,isOpen}:DashboardPropsType) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div className='relative'>
      <Layout onToggle={onToggle} isOpen={isOpen}>
        <>
        {showModal && createPortal(
      <CategoryModal onClose={() => setShowModal(false)} />,document.body
    )}
        </>
        <div className=''>
         <MainContent setShowModal={setShowModal} />
        </div>
      </Layout>
    </div>
  )
}

export default DashBoardLayout
