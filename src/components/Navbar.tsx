import { HiOutlineMenu } from "react-icons/hi"

interface NavbarPropsType {
    onToggle:() => void
}

const Navbar = ({onToggle}:NavbarPropsType) => {

  return (
     <div className="navbar w-full h-15 flex items-center px-2">
            <HiOutlineMenu onClick={onToggle} startOffset={2} stroke="blue" className="h-10 w-10 cursor-pointer active:scale-95" />
          </div>
  )
}

export default Navbar
