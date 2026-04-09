import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import './App.css'
import DashBoardLayout from './pages/DashBoardLayout'
import { Outlet, Route, Routes } from 'react-router-dom'
import TransactionLayout from './pages/TransactionLayout'
import CategoriesPage from './pages/CategoriesPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { analytics } from './backend/firebaseConfig'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import UserAccountPage from './pages/UserAccountPage'

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  analytics
  return (
    <>
      <div>
   <Routes>
    <Route path='/transactions/tnx-details/:id' element={<TransactionLayout isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />} />
    <Route path='/' element={<DashBoardLayout isLoggedin={true} isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />}/>
    <Route path='/transactions' element={<TransactionLayout isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />} />
    <Route path='/categories' element={<CategoriesPage isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />} />
    <Route path='/analytics' element={<AnalyticsPage isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)}/>} />
    <Route path='/signup' element={<Signup isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />} />
    <Route path='/signin' element={<Signin isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)}/> } />
    <Route path='/me' element={<UserAccountPage isLoggedin={false} isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />} />
   </Routes>
   <Outlet />
     <Toaster />
      </div>
    </>
  )
}

export default App
