import { HiOutlineMenu } from "react-icons/hi"
import ThemeSwitcher from "./ThemeSwitcher"
import { Link } from "react-router-dom"

interface NavbarPropsType {
    onToggle:() => void
    isLoggedin:boolean
}

const Navbar = ({onToggle,isLoggedin}:NavbarPropsType) => {

  return (
     <div className="navbar h-16 flex items-center justify-between px-4">
            <HiOutlineMenu onClick={onToggle} startOffset={2} stroke="white" className="h-10 w-10 ml-4 cursor-pointer active:scale-95" />
          <div className="flex gap-10 justify-between items-center ">
            {
              isLoggedin ? <span className="w-25 h-10 btn-primary rounded-lg flex justify-center items-center bg-black">Logout</span> :
               <Link to='/signin' className="w-25 h-10 btn-primary rounded-lg flex justify-center items-center bg-black">login</Link>

            }
           <ThemeSwitcher />
          </div>
          </div>
  )
}

export default Navbar
