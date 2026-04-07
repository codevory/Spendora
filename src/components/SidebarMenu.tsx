import { TiHomeOutline } from "react-icons/ti";
import { Link } from "react-router-dom";

const SidebarMenu = ({isOpen}:{isOpen:boolean}) => {
    return (
    <div className='flex flex-col gap-10 items-center h-full mt-1 font-semibold text-xl sidebar '>
      <Link to='/' className="sidebar-item">{isOpen ? '🏠 Dashboard' :  <TiHomeOutline /> }</Link>
      <Link to='/analytics' className="sidebar-item">{ isOpen ? '📊 Analytics' : '📊'}</Link>
      <span className="sidebar-item">{isOpen ? ' ⚠️ Budget' : '⚠️'}</span>
      <Link to='/transactions' className="sidebar-item">{isOpen ?  '🧾 Transactions' : '🧾'}</Link>
      <Link to='/categories' className="sidebar-item">{isOpen ? '🏷 Categories' : '🏷'}</Link>
      <span className="sidebar-item">{isOpen ? '⚙️ Settings' : '⚙️'}</span>
    </div>
  )
}

export default SidebarMenu
