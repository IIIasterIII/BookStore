"use client"

import React, { useEffect, useState } from 'react'
import { LuPencil } from "react-icons/lu";
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';
import { usePathname } from 'next/navigation';
import { getProfile } from '@/api/profileApi'
import { Profile } from '@/types/profile';
import Loader from '@/app/loader';
import Image from 'next/image';

const Page = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const path = usePathname()
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if(!user) return

    const fetchProfile = async () => {
      try {
        const res = await getProfile(path.slice(7))
        setProfile(res)
      } catch(err){
        console.log(err)
      }
    }

    fetchProfile()
  }, [user])

  useEffect(() => {
    console.log(profile)
  }, [profile])

  if(!profile) {
    <Loader/>
  } else 
  return (
    <div className='flex flex-col'>
        <div 
        className="h-75 rounded-b-2xl relative mt-5"
        style={{
          backgroundColor: profile?.banner_Url ? undefined : "brown",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain", 
          backgroundPosition: "center",
        }}>
        {profile.banner_Url && <Image src={profile.banner_Url} alt="" fill />}
        <div
            className="w-45 h-45 rounded-full mt-5 absolute -bottom-20 left-8 flex justify-center items-center cursor-pointer "
            style={{
              backgroundImage: `url(${profile.avatar_Url ?? undefined })`,
              backgroundColor: profile.avatar_Url ? undefined : "#f1422e ",
              backgroundPosition: 'center',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}>
              {profile.border_Url && (
                <img
                  src={profile.border_Url}
                  alt=""
                  loading="lazy"
                  className="min-w-55 min-h-55 absolute rounded-full object-cover border-none"
                />
              )}
          </div>
      </div>
        <div className="flex flex-row mt-6 items-center justify-between">
        <h1 className="font-extrabold text-3xl text-gray-900 ml-60">{profile?.username}</h1>
        
        {profile?.username === user?.username && (
          <button
            onClick={() => router.push("/settings/appearance")}
            className="rounded-xl cursor-pointer bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white px-5 py-2 flex items-center transition-colors"
          >
            <LuPencil className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col mt-10 bg-gray-100 border border-gray-300 rounded-2xl p-6 shadow-md max-w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Personal Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-gray-600 font-extrabold mb-1">Full Name</span>
            <span className="text-gray-900 font-medium">
              {profile.name && profile.surname ? `${profile.name} ${profile.surname}` : "Unknown"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-extrabold mb-1">Email</span>
            <span className="text-gray-900 font-medium">{profile.email ?? "Unknown"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-extrabold mb-1">Country</span>
            <span className="text-gray-900 font-medium">{profile.country ?? "Unknown"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-extrabold mb-1">Gender</span>
            <span className="text-gray-900 font-medium">{profile.gender ?? "Unknown"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-extrabold mb-1">Money</span>
            <span className="text-gray-900 font-medium">{profile.money ?? 0}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-extrabold mb-1">Birthday</span>
            <span className="text-gray-900 font-medium">
              {profile.birthday
                ? new Date(profile.birthday).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className='flex mt-5 flex-col w-full bg-gray-100 border-gray-300 rounded-2xl p-6 shadow-md max-w-full justify-center'>
        <h1 className='text-2xl font-bold text-gray-700 mb-6'>Description</h1>
        <h1 className='h-full w-full bg-gray-200 rounded-2xl p-5 flex-wrap'>{profile.description ? profile.description : "Uknown"}</h1>
      </div>
    </div>
  )
}

export default Page