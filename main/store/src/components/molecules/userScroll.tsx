"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { getTopRichUsers } from '@/api/profileApi'
import { Profile } from '@/types/profile'
import { useRouter } from 'next/navigation'
import { GrMoney } from "react-icons/gr";

const UserScroll = () => {
  const [users, setUsers] = useState<Profile[]>()
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      const res = await getTopRichUsers()
      setUsers(res.data)
    }
    fetch()
  }, [])

  return (
    <>
      <h1 className='mt-5 font-bold text-2xl'>Active users</h1>
      <div className='flex flex-row mt-5 overflow-x-scroll pb-5 gap-5' style={{scrollbarWidth: 'none'}}>
        {users?.map((el, index) => (<div key={index} className='min-w-75 h-25 rounded-2xl bg-gray-400 hover:bg-gray-500 cursor-pointer flex items-center ' onClick={() => router.push(`/users/${el.username}`)}>
          <div className='w-20 h-20 border rounded-full ml-2 relative flex justify-center items-center'
            style={{
            backgroundImage: el?.avatar_Url ? `url(${el.avatar_Url})` : undefined,
            backgroundColor: el?.avatar_Url ? undefined : "brown",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          >
            <div
            className='min-w-24 min-h-24 rounded-full'
            style={{
              backgroundImage: el?.border_Url ? `url(${el.border_Url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            ></div>
          </div>

          <div className='flex flex-col ml-5 h-full'>
            <h1 className='font-bold text-2xl mt-5'>{el.username}</h1>
            <div className='flex flex-row items-center font-medium'>
              <p className='mr-1'>{el.money}</p>
              <GrMoney/>
            </div>
          </div>
        </div>))}
      </div>
    </>
  )
}

export default UserScroll