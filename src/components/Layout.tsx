import type { ReactNode } from 'react'
import Navbar from './Navbar';

interface LayoutProps {
    children:ReactNode;
    onToggle:() => void;
}

const Layout = ({children,onToggle}:LayoutProps) => {
    
  return (
    <div className='flex flex-col'>
        <div className='navbar h-19'>
            <Navbar onToggle={onToggle} />
        </div>
        <div className=''>
          {children}
        </div>
    </div>
  )
}

export default Layout
