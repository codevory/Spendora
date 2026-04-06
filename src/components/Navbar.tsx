import { HiOutlineMenu } from "react-icons/hi"

interface NavbarPropsType {
    onToggle:() => void
}

const Navbar = ({onToggle}:NavbarPropsType) => {

  return (
     <div className="navbar h-15 flex items-center px-4">
            <HiOutlineMenu onClick={onToggle} startOffset={2} stroke="white" className="h-10 w-10 ml-4 cursor-pointer active:scale-95" />
          </div>
  )
}

export default Navbar
