import type { ReactNode } from 'react';

interface CategoryModalPropsType {
    onClose: () => void;
    form:ReactNode;
    isForm:string;
}
const ModalBox = ({onClose,form,isForm}:CategoryModalPropsType) => {
   
  return (
    <div className='fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4'>
        <div className={`relative w-full max-w-md rounded-xl ${isForm === "income" ? 'bg-slate-800' : 'bg-white'} p-5 shadow-2xl`}>
        <button onClick={onClose} className='btn-primary absolute right-2 top-2'>Close</button>
         {form}
        </div>
    </div>
  )
}

export default ModalBox
