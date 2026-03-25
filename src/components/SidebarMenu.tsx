import { TiHomeOutline } from "react-icons/ti";

const SidebarMenu = ({isOpen}:{isOpen:boolean}) => {
  return (
    <div className='flex flex-col gap-3 justify-center items-center bg-blue-500'>
      <span>{`${isOpen ? 'Add expense' :  <TiHomeOutline /> }`}</span>
      <span>menu 2</span>
      <TiHomeOutline />
      <span>menu 3</span>
      <span>menu 4</span>
       <span>menu 5</span>
       <span>menu 6</span>
       <span>menu 7</span>
       <span>menu 8</span>
    </div>
  )
}

export default SidebarMenu
