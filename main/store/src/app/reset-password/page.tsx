"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useToastStore } from "@/store/useToastStore";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const {addToast} = useToastStore()
  const router = useRouter()
  const token = searchParams.get("token");
  const [data, setData] = useState({
    password: "",
    repeat_password: ""
  })
  
  const handleResetPassword = async (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault()
    if(!data.password)
        return addToast("You must insert something", "alert")

    if (data.password !== data.repeat_password)
        return addToast("The passwords must be the same", "alert")

    try {
        const res = await axios.post("http://localhost:8000/reset-password", {
            token: token,
            new_password: data.password
        });
        console.log(res.data)
        router.replace('/auth')
    } catch(err){
        addToast('Error!', "error")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold ml-2 mt-5">Reset Password</h1>
      {token ? (
        <p className="text-2xl font-medium ml-2 mt-5">Your reset token is: {token}</p>
      ) : (
        <p className="text-2xl font-medium ml-2 mt-5">No token provided</p>
      )}

      <form action="" onSubmit={(el) => handleResetPassword(el)} className="flex m-auto flex-col items-center rounded-4xl w-120 t-20 relative">
        <h1 className="mr-auto ml-10 mt-5 mb-1">Type new password</h1>
        <input type="password" placeholder="new password"
        className='w-100 border border-gray-4 rounded-xl pl-5 pr-5 outline-none h-12 focus:border-blue-500 focus:border-2'
        onChange={(el) => setData((prev) => ({...prev, password: el.target.value}))}/>
        <h1 className="mr-auto ml-10 mt-5 mb-1">Repeat new password</h1>
        <input type="password" placeholder="repeat password"
         className='w-100 border border-gray-4 rounded-xl pl-5 pr-5 outline-none h-12 focus:border-blue-500 focus:border-2'  onChange={(el) => setData((prev) => ({...prev, repeat_password: el.target.value}))}/>
        <input type="submit" value={'Submit'} className='mt-5 cursor-pointer hover:bg-violet-800 active:bg-violet-500 bg-violet-700 text-violet-50 rounded-xl h-12 duration-300 w-100'/>
      </form>
    </div>
  );
}
