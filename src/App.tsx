import { Toaster } from 'react-hot-toast'
import './App.css'
import Dashboard from './pages/Dashboard'
import TestLayout from './pages/TestLayout'

function App() {
 
  return (
    <>
      <div>
  <TestLayout />
     <Toaster />
      </div>
    </>
  )
}

export default App
