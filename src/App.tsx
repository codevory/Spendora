import { Toaster } from 'react-hot-toast'
import './App.css'
import AddExpense from './pages/AddExpense'

function App() {
 
  return (
    <>
      <div>
    <AddExpense />
     <Toaster />
      </div>
    </>
  )
}

export default App
