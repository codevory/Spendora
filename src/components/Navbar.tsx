import { HiOutlineMenu } from "react-icons/hi"
import ThemeSwitcher from "./ThemeSwitcher"

interface NavbarPropsType {
    onToggle:() => void
}

const Navbar = ({onToggle}:NavbarPropsType) => {

  return (
     <div className="navbar h-15 flex items-center justify-between px-4">
            <HiOutlineMenu onClick={onToggle} startOffset={2} stroke="white" className="h-10 w-10 ml-4 cursor-pointer active:scale-95" />
           <ThemeSwitcher />
          </div>
  )
}

export default Navbar
