"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { GoKey } from "react-icons/go";
import { LuPanelsLeftBottom } from "react-icons/lu";
import useAuthStore from '@/store/auth';
import { getProfile, postProfilePersonalInformation } from '@/api/profileApi'
import Cookies from '../../../../node_modules/@types/js-cookie';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/profile';
import Loader from '@/app/loader';

const Page = () => {
  const tabs = ["main", "account"]
  const { user, clearUser } = useAuthStore()
  const[selected, setSelected] = useState<string>('main')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>()

  const countries = [
    "Italy", "Germany", "France", "USA", "Ukraine", "Poland", "Spain", "Canada",
    "United Kingdom", "Australia", "Netherlands", "Sweden", "Norway", "Denmark",
    "Finland", "Brazil", "Mexico", "India", "China", "Japan", "South Korea", "Turkey",
    "Switzerland", "Austria", "Belgium", "Portugal", "Greece", "Czech Republic",
    "Romania", "Hungary"
  ];

  const [profileData, setProfileData] = useState({
    username: '',
    gender: 'Male',
    name: '',
    surname: '',
    description: '',
    birthday: '',
    country: ''
  })

  useEffect(() => {
    if(!user) return

    const fetch = async () => {
      const res = await getProfile(user.username)
      setProfile(res)
    }

    fetch()
  }, [user])

  const handleSaveChanges = () => {
    const fetchProfile = async () => {

      if (!profileData.username.trim()) {
        alert("Username is required.");
        return
      }

      if (profileData.username.length < 5) {
        alert("Your username must be longer than 5 characters")
        return
      }
  
      if (profileData.description.length > 200) {
        alert("Description must be 200 characters or fewer.")
        return
      }

      console.log('lets go!', user?.user_id)


      if(!user?.user_id) return
  
      try {
        const res = await postProfilePersonalInformation(profileData, user?.user_id)
        if(res) {
          Cookies.remove('access_token')
          clearUser()
          router.push('/auth')
        }
      } catch (err) {
        console.error("Error updating profile:", err);
      }
    };
  
    fetchProfile();
  };
  

  useEffect(() => {
    if (user?.username) setProfileData(prev => ({ ...prev, username: user.username}))
  }, [user])

  useEffect(() => {
    console.log(profileData)
  }, [profileData])

  if(!profile) {
    <Loader/>
  } else 
  return (
    <div className='flex flex-col mt-5 w-full'>
        <div className="relative flex flex-row gap-5 border-b-2 border-b-transparent w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelected(tab)}
            className="relative px-2 pb-2 font-semibold flex flex-row items-center">
            {tab === "main" && <LuPanelsLeftBottom className='mr-2'/>}
            {tab === "account" && <GoKey className='mr-2'/>}
            {tab}
            {selected === tab && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-700 rounded-full"
                transition={{ type: "spring", stiffness: 800, damping: 50 }}
              />
            )}
          </button>
        ))}
      </div>

      {selected === "main" && <div className='border-b border-dashed pb-10'>
        <h1 className='mt-5 text-2xl font-bold'>Personal information</h1>

        <div className='flex flex-row mt-5'>
            <div className='flex flex-col'>
              <p>Nickname</p>
              <input
                type="text"
                placeholder='Your nickname'
                defaultValue={profile?.username}
                onChange={(el) => setProfileData(prev => ({ ...prev, username: el.target.value }))}
                className='h-9 border-2 border-blue-950 pl-5 pr-5 outline-none mt-2 rounded-xl text-sm leading-tight'/>
            </div>

            <div className="flex flex-col ml-5">
              <p>gender</p>
              <select
                value={profileData.gender}
                onChange={(el) => setProfileData(prev => ({ ...prev, gender: el.target.value}))}
                className="h-9 border-2 border-blue-950 pl-5 pr-5 outline-none mt-2 rounded-xl text-sm leading-tight">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>
        </div>

        <div className='flex flex-row mt-5'>
          <div className='flex flex-col'>
            <p>Name</p>
            <input onChange={(el) => setProfileData(prev => ({ ...prev, name: el.target.value}))} type="text" placeholder='Your name' className='border border-blue-950 pl-5 pr-5 outline mt-2 rounded-xl pt-1 pb-1'/>
          </div>

          <div className='flex flex-col ml-5'>
            <p>Surname</p>
            <input onChange={(el) => setProfileData(prev => ({ ...prev, surname: el.target.value}))} type="text" placeholder='Your surname' className='border border-blue-950 pl-5 pr-5 outline mt-2 rounded-xl pt-1 pb-1'/>
          </div>
        </div>

        <p className='mt-10'>Description</p>
        <textarea className="border-2 w-full resize-none outline-none mt-2 rounded-2xl p-2" onChange={(el) => setProfileData(prev => ({...prev, description: el.target.value}))} rows={4}/>

        <div className='flex flex-row mt-5'>
          <div className='flex flex-col'>
            <p>Birthday</p>
            <input onChange={(el) => setProfileData(prev => ({ ...prev, birthday: el.target.value}))} type="date" placeholder='current password' className='border border-blue-950 pl-5 pr-5 outline mt-2 rounded-xl pt-1 pb-1'/>
          </div>

          <div className='flex flex-col ml-5'>
            <label htmlFor="country">Country</label>
            <select onChange={(el) => setProfileData(prev => ({ ...prev, country: el.target.value}))} id="country" className='border border-blue-950 pl-5 pr-5 outline mt-2 rounded-xl pt-1 pb-1 h-8'>
              {countries.map((country) => ( <option key={country} value={country}> {country} </option> ))}
            </select>
          </div>
        </div>
      </div>}
      <button onClick={() => handleSaveChanges()} className='w-full mt-5 h-12 bg-blue-700 text-white rounded-2xl cursor-pointer hover:bg-blue-600 active:bg-blue-500'>Save changes</button>
      {/*
      {selected === "account" && <><div className='border-b border-dashed pb-10'>
        <h1 className='mt-5 text-2xl font-bold'>Change password</h1>
        <p className='mt-3'>Current Password</p>
        <input type="text" placeholder='current password' className='border border-blue-950 pl-5 pr-5 outline mt-2 rounded-xl pt-1 pb-1'/>
        <div className='flex flex-row mt-5'>
          <div className='flex flex-col'>
            <p>New password</p>
            <input type="text" placeholder='current password' className='border border-blue-950 pl-5 pr-5 outline mt-2 rounded-xl pt-1 pb-1'/>
          </div>

          <div className='flex flex-col ml-5'>
            <p>Confirm new password</p>
            <input type="text" placeholder='current password' className='border border-blue-950 pl-5 pr-5 outline mt-2 rounded-xl pt-1 pb-1'/>
          </div>
        </div>

        <button className='bg-gray-800 font-medium mt-5 pl-5 pr-5 pt-2 pb-2 text-gray-500 rounded-xl cursor-pointer'>Change</button>
      </div>

      <div className='border-b border-dashed pb-10'>
        <h1 className='mt-5 text-2xl font-bold'>Change email</h1>
        <div className='flex flex-row mt-5'>
        <div className='flex flex-col'>
            <p>New email</p>
            <input type="text" placeholder='new email' className='border border-blue-950 pl-5 pr-5 outline mt-2 rounded-xl pt-1 pb-1'/>
          </div>

          <div className='flex flex-col ml-5'>
            <p>Current Password</p>
            <input type="text" placeholder='current password' className='border border-blue-950 pl-5 pr-5 outline mt-2 rounded-xl pt-1 pb-1'/>
          </div>
        </div>

        <button className='bg-gray-800 font-medium mt-5 pl-5 pr-5 pt-2 pb-2 text-gray-500 rounded-xl cursor-pointer'>Change</button>
      </div>

      </>}*/}
    </div>
  )
}

export default Page