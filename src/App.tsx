
import toast, { Toaster } from 'react-hot-toast'
import './App.css'

function App() {
 
const notify = () => toast.success("successfully created")
  return (
    <>
      <div>
     <h2>app</h2>
     <button onClick={notify}>Notify</button>
     <Toaster />
      </div>
    </>
  )
}

export default App
