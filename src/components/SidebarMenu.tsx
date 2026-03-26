import { TiHomeOutline } from "react-icons/ti";

const SidebarMenu = ({isOpen}:{isOpen:boolean}) => {
  return (
    <div className='flex flex-col gap-10 items-center h-full mt-1 font-semibold text-xl sidebar '>
      <span className="sidebar-item">{isOpen ? '🏠 Dashboard' :  <TiHomeOutline /> }</span>
      <span className="sidebar-item">{isOpen ?  '💸 Add Expense' : "💸"}</span>
      <span className="sidebar-item">{ isOpen ? '📊 Analytics' : '📊'}</span>
      <span className="sidebar-item">{isOpen ? ' ⚠️ Budget Alerts' : '⚠️'}</span>
      <span className="sidebar-item">{isOpen ?  '🧾 Transactions' : '🧾'}</span>
      <span className="sidebar-item">{isOpen ? '🏷 Categories' : '🏷'}</span>
      <span className="sidebar-item">{isOpen ? '⚙️ Settings' : '⚙️'}</span>
    </div>
  )
}

export default SidebarMenu
