"use client"
import { IoMdArrowBack } from "react-icons/io";
import { GrPaint } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { Profile } from "@/types/profile";
import { getProfile } from "@/api/profileApi";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    const pathname = usePathname()
    const router = useRouter()
    const isActive = (path: string) => pathname === path;
    const { user } = useAuthStore()
    const [profile, setProfile] = useState<Profile>()

    function timeAgo(dateString?: string): string {
        if (!dateString) return "unknown";
      
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
      
        const seconds = Math.floor(diffMs / 1000);
        if (seconds < 60) return `${seconds} seconds ago`;
      
        const minutes = Math.floor(diffMs / (1000 * 60));
        if (minutes < 60) return `${minutes} minutes ago`;
      
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        if (hours < 24) return `${hours} hours ago`;
      
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return `${days} days ago`;
      }

    useEffect(() => {
        if(!user) return

        const fetch = async () => {
            const res = await getProfile(user.username)
            setProfile(res)
        }
        
        fetch()
    }, [user])

    useEffect(() => {
        console.log(profile)
    }, [profile])

    return (
        <div className="flex flex-col w-full">
            <div className="mt-5 flex flex-row">
                <button className="w-10 h-10 rounded-xl bg-blue-900 hover:bg-blue-950 active:bg-blue-700 text-blue-50 flex items-center justify-center mr-5 cursor-pointer" 
                onClick={() => router.push(`/users/${user?.username}`)}><IoMdArrowBack/></button>
                <div className="flex flex-col">
                    <h1>Edit profile</h1>
                    <p>Updated: {timeAgo(profile?.last_Update_Date)}</p>
                </div>
            </div>
            <div className="flex flex-row gap-5">
                <div className="w-75 mt-5">

                    <p className={`w-full ${isActive("/settings/appearance") ? "bg-blue-700 hover:bg-blue-600 active:bg-blue-500" : "bg-blue-900 hover:bg-blue-950 active:bg-blue-700"} 
                    cursor-pointer text-blue-50 pl-5 mb-1 rounded-xl pb-2 pt-2 flex flex-row items-center pr-5 duration-300`} 
                    onClick={() => router.push('/settings/appearance')}><GrPaint className="mr-2"/>Appearance</p>

                    <p className={`w-full ${isActive("/settings/account") ? "bg-blue-700 hover:bg-blue-600 active:bg-blue-500"  : "bg-blue-900 hover:bg-blue-950 active:bg-blue-700"} 
                    cursor-pointer text-blue-50 pl-5 mb-1 rounded-xl pb-2 pt-2 flex flex-row items-center pr-5 duration-300`} 
                    onClick={() => router.push('/settings/account')}><FaRegUser className="mr-2"/>Personal information</p>

                </div>
                {children}
            </div>
        </div>
    );
  }
  