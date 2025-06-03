"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuthStore from "@/store/auth";
import { getBoughDecorations, setAvatar, setBorder, setBanner } from "@/api/profileApi"
import Image from "next/image";
import Loader from "@/app/loader";

const tabs = ["Avatars", "Avatar_borders", "Banners"];

interface Decoration {
  user_d: number;
  user_id: number;
  type: string;
  item_Url: string;
}

const Page = () => {
  const [selected, setSelected] = useState<string>("Avatars");
  const { user, setAvatarUrl, setBannerUrl, setBorderUrl } = useAuthStore()
  const [decoration, setDecoration] = useState<Decoration[]>()

  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      const res = await getBoughDecorations(user.user_id)
      setDecoration(res.data)
    }

    fetch()
  }, [user])

  const handleSetBorder = (url: string) => {
    if (!user) return
    setBorderUrl(url)

    const fetch = async () => {
      const res = await setBorder(user.user_id, url)
      console.log(res.data)
    }

    fetch()
  }

  const handleSetBanner = (url: string) => {
    if (!user) return
    setBannerUrl(url)

    const fetch = async () => {
      const res = await setBanner(user.user_id, url)
      console.log(res.data)
    }

    fetch()
  }

  const handleSetAvatar = (url: string) => {
    if (!user) return
    setAvatarUrl(url)

    const fetch = async () => {
      const res = await setAvatar(user.user_id, url)
      console.log(res.data)
    }

    fetch()
  }

  useEffect(() => {
    console.log(user)
  }, [user])

  if (!user) {
    return <Loader/>
  } else 
  return (
    <div className="flex flex-col w-full mt-5">
          <div
            className="h-75 rounded-b-2xl relative"
            style={{
              backgroundColor: user?.banner_url ? undefined : "blue",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain", 
              backgroundPosition: "center",
            }}>
            {user.banner_url && (<Image src={user.banner_url} alt="" fill />)}
          <div
            className="w-45 h-45 rounded-full mt-5 absolute -bottom-20 left-8 flex justify-center items-center cursor-pointer"
            style={{
              backgroundImage: `url(${user?.avatar_url ?? undefined })`,
              backgroundPosition: 'center',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}>
            <img
              src={user?.border_url ?? undefined}
              alt=""
              loading="lazy"
              className="min-w-55 min-h-55 absolute rounded-full object-cover"
            />
          </div>
      </div>

      <h1 className="mt-25 font-bold text-2xl">My jewelry</h1>

      <div className="relative mt-5 flex flex-row gap-5 border-b-2 border-b-transparent w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelected(tab)}
            className="relative px-2 pb-2 font-semibold">
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

      <div className="mt-10">
        {selected === "Avatars" && <div>
            <h1 className="text-2xl font-medium">Content for avatars</h1>
            <div className="grid grid-cols-5 gap-5 mt-5">
            {decoration?.filter(it => it.type === "avatar").map((el, i) => (
            <div key={i} className="w-35 h-35 rounded-full mt-5 overflow-hidden flex justify-center items-center cursor-pointer"
            onClick={() => handleSetAvatar(el.item_Url)}
            >
              <img
                src={el.item_Url}
                alt={`avatar_${i}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            ))}
            </div>
        </div>
        }
        {selected === "Avatar_borders" && <div>
            <h1 className="text-2xl font-medium">Content for borders</h1>
            <div className="grid grid-cols-5 gap-5 mt-5">
              {decoration?.filter(it => it.type === "border").map((el, i) => (
                <div key={i}
                  className="w-35 h-35 rounded-full mt-5 relative flex justify-center items-center cursor-pointer"
                  onClick={() => handleSetBorder(el.item_Url)}
                  style={{
                    backgroundImage: `url(${user?.avatar_url ?? ""})`,
                    backgroundPosition: 'center',
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}>
                  <img
                    src={el.item_Url}
                    alt="avatar overlay"
                    loading="lazy"
                    className="min-w-42 min-h-42 absolute rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>}
        {selected === "Banners" && <div>
          <h1 className="text-2xl font-medium">Content for banners</h1>
          <div className="grid grid-cols-2 gap-5 mt-5">
            {decoration?.filter(it => it.type === "banner").map((el, i) => (
              <div key={i} className="w-125 min-h-35 rounded-2xl mt-2 cursor-pointer" 
              onClick={() => handleSetBanner(el.item_Url)}
              style={{background: `url(${el.item_Url})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}></div>
            ))}
          </div>          
        </div>}
      </div>
    </div>
  );
};

export default Page;
