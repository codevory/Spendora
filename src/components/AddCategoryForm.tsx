import toast from "react-hot-toast";
import { addNewCategory } from "../store/features/transaction";
import { useAppDispatch, useAppSelector } from "../store/store"
import { useState } from 'react'
import type { CategoryPropsType } from "../types/transactionType";

type CategoryFormProps = {
  setModalState:(val:"closed") => void;
}

const AddNewCategoryForm = ({setModalState}:CategoryFormProps) => {
     const [category,setCategory] = useState<string>("")
     const categories = useAppSelector((state) => state.transaction.categories)

    const dispatch = useAppDispatch();
    const success = () => toast.success("added Successfully")
    const failed = (message:string) => toast.error(message)

    function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        if(category.trim().length < 3)return failed("kindly type category name");
        
        const normalized = category.trim().toLowerCase();
        const exists = categories.some((c) => {
          const name = c?.name?.trim().toLowerCase()
          return name === normalized
        })
        if(exists){
          return failed("😩Category already exists")
        }
        const newCategory:CategoryPropsType = {
          name:category,
          id: Date.now().toFixed(6) 
        }
        try {
            dispatch(addNewCategory(newCategory))
          } catch (error) {
            failed("Failed to add");
            if(error instanceof Error){
              failed(error.message)
            }
            console.log(error)
          }finally{  
            success()
            setCategory('')
        }
        setModalState("closed")
    }
  return (
    <div className="flex flex-col gap-2 " >
        <h2>Add New Category</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="form flex flex-col gap-2 ">
        <div className=" flex flex-col">
        <label className='text-accent label'>category</label>
        <input className='input' type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <button className="button w-20 h-11 font-semibold hover:bg-slate-500 active:scale-95 glass" type="submit">Add</button>
      </form>
    </div>
  )
}

export default AddNewCategoryForm
