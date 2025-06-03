import { FC } from 'react'
import { useToastStore } from '@/store/useToastStore'
import { IoIosCloseCircle } from "react-icons/io"
import { IoMdCloseCircle } from "react-icons/io";
import { GoAlert } from "react-icons/go";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

interface message {
  message: string | null
  toast_id: number 
  type: "success" | "error" | "info" | "alert";
}

const ToastMessage : FC<message> = ({message, toast_id, type}) => {
  const {removeToast} = useToastStore()
  return (
    <div className='w-100 h-15 ml-auto min mt-2 relative rounded-l-xl bg-gray-300 flex flex-row z-50'>
      <div className={`w-15 h-15 rounded-l-xl flex justify-center items-center text-3xl text-white font-extrabold 
      ${type === "success" && "bg-green-400"} ${type === "error" && "bg-red-400"} ${type === "alert" && "bg-yellow-400"} ${type === "info" && "bg-blue-400"}`}>
        {type === "success" && <IoCheckmarkCircleOutline/>}
        {type === "error" && <IoMdCloseCircle/>}
        {type === "alert" && <GoAlert/>}
        {type === "info" && <IoMdInformationCircleOutline/>}
      </div>
      <div className='flex flex-col ml-3'>
        {type === "success" && <h1 className="font-bold">Success!</h1>}
        {type === "error" && <h1 className="font-bold">Error!</h1>}
        {type === "alert" && <h1 className="font-bold">Alert!</h1>}
        {type === "info" && <h1 className="font-bold">Info!</h1>}
        <p className="font-medium">{message}</p>
      </div>
      <IoIosCloseCircle className='absolute right-2 top-2 text-2xl' onClick={() => removeToast(toast_id)}/>
    </div>
  )
}

export default ToastMessage