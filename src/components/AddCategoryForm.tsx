import toast from "react-hot-toast";
import { addNewCategory } from "../store/features/transaction";
import { useAppDispatch } from "../store/store"
import { useState } from 'react'

const AddCategoriesForm = () => {
     const [category,setCategory] = useState<string>('')
    const dispatch = useAppDispatch();
    const success = () => toast.success("added Successfully")
    const failed = (message:string) => toast.error(message)

    function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        if(category === "")return failed("kindly type category name")
        try {
            dispatch(addNewCategory(category))
            setCategory('')
            success()
        } catch (error) {
            failed("Failed to add");
            if(error instanceof Error){
                failed(error.message)
            }
            console.log(error)
        }
    }
  return (
    <div className="flex flex-col gap-2 " >
        <h2>Add New Category</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="form flex flex-col gap-2 ">
        <div className=" flex flex-col">
        <label className='text-accent label'>category</label>
        <input className='input' type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <button className="button w-20 h-11 font-semibold hover:bg-slate-500 active:scale-95 glass" type="submit">Add</button>
      </form>
    </div>
  )
}

export default AddCategoriesForm
