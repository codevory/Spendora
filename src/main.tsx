import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import Store from './store/store.ts'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={Store}>
    <App />
    </Provider>    
    </BrowserRouter>
  </StrictMode>,
)
