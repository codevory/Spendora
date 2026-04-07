import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import './App.css'
import DashBoardLayout from './pages/DashBoardLayout'
import { Outlet, Route, Routes } from 'react-router-dom'
import TransactionLayout from './pages/TransactionLayout'
import CategoriesPage from './pages/CategoriesPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <div>
   <Routes>
    <Route path='/transactions/tnx-details/:id' element={<TransactionLayout isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />} />
    <Route path='/' element={<DashBoardLayout isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />}/>
    <Route path='/transactions' element={<TransactionLayout isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />} />
    <Route path='/categories' element={<CategoriesPage isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />} />
    <Route path='/analytics' element={<AnalyticsPage isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)}/>} />
   </Routes>
   <Outlet />
     <Toaster />
      </div>
    </>
  )
}

export default App
