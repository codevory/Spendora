import { Toaster } from 'react-hot-toast'
import './App.css'
import DashBoardLayout from './pages/DashBoardLayout'
import { Outlet, Route, Routes } from 'react-router-dom'
import TransactionLayout from './pages/TransactionLayout'
import CategoriesPage from './pages/CategoriesPage'

function App() {
  return (
    <>
      <div>
   <Routes>
    <Route path='/transactions/tnx-details/:id' element={<TransactionLayout />} />
    <Route path='/' element={<DashBoardLayout />}/>
    <Route path='/transactions' element={<TransactionLayout />} />
    <Route path='/categories' element={<CategoriesPage />} />
   </Routes>
   <Outlet />
     <Toaster />
      </div>
    </>
  )
}

export default App
