"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getAvatars, getBanners, getBorders } from "@/api/staticApi"; 
import { FaCoins } from "react-icons/fa6";
import useAuthStore from "@/store/auth";
import { postBuyItemDecoration } from "@/api/buyApi"
import { getBoughDecorations } from "@/api/profileApi";
const tabs = ["Avatars", "Avatar_borders", "Banners"];
import { useToastStore } from "@/store/useToastStore";

interface focusItem {
  url: string | null
  id_focus: string | null
  index: number
  price: number
}

interface Decoration {
  user_d?: number;
  user_id: number;
  type: string;
  item_Url: string;
}

const Page = () => {
  const [selected, setSelected] = useState<string>("Avatars");
  const { user, decreaseMoney } = useAuthStore()
  const { addToast } = useToastStore()
  const [decoration, setDecoration] = useState<{
    avatars: Decoration[];
    borders: Decoration[];
    banners: Decoration[];
  }>({
    avatars: [],
    borders: [],
    banners: []
  });

  const [time_avatar, setTime_avatar] = useState<string | null>(null)
  const [focusedItem, setFocusedItem] = useState<focusItem>({
    url: null,
    index: 0,
    id_focus: null,
    price: 0
  });

  const [files, setFiles] = useState({
    avatars: [],
    banners: [],
    borders: []
  })

  useEffect(() => {
    const getFiles = async () => {
      const [avatars, banners, borders] = await Promise.all([
        getAvatars(),
        getBanners(),
        getBorders()
      ])
  
      setFiles({
        avatars,
        banners,
        borders
      })
    }
  
    getFiles()
  }, [])

  const TheBaseFetch = async (user_id: number) => {
    const res = await getBoughDecorations(user_id);

    const avatars: Decoration[] = []
    const borders: Decoration[] = []
    const banners: Decoration[] = []

    res.data.forEach((item: Decoration) => {
      if (item.type === 'avatar') avatars.push(item);
      else if (item.type === 'border') borders.push(item);
      else if (item.type === 'banner') banners.push(item);
    });

    setDecoration({
      avatars,
      borders,
      banners
    });
  };

  useEffect(() => {
    if (!user) return;
    TheBaseFetch(user.user_id);
  }, [user]);

  useEffect(() => {
    console.log(decoration)
  }, [decoration])

  const handleBuyItem = (type: string, price: number, item_id: string, item_url: string) => {
    if (!user) return
    let real_type = "something"
    if(type === "Avatars") real_type = "avatar"
    else if(type === "Avatar_borders") real_type = "border"
    else if(type === "Banners") real_type = "banner"

    const fetch = async () => {
      const obg = {
        id_u: user.user_id,
        item_type: real_type,
        sum: price,
        item_id: item_id ,
        item_url: item_url 
      }
      const res = await postBuyItemDecoration(obg)
      addToast("You bought item!", "success")
      decreaseMoney(price)
      TheBaseFetch(user.user_id)
    }
    fetch()
  }

  function calculatePriceInCoins(url: string): number {
    const basePrice = 5;
    const lengthBonus = Math.min(url.length / 20, 10);
  
    const formatBonus = (() => {
      if (url.endsWith(".gif")) return 10;
      if (url.endsWith(".webp")) return 4;
      if (url.endsWith(".png")) return 2;
      if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return 1;
      return 0;
    })();
  
    const sizeMatch = url.match(/_(\d{2,4})x(\d{2,4})/);
    const sizeBonus = sizeMatch
      ? (parseInt(sizeMatch[1]) * parseInt(sizeMatch[2])) / 100000
      : 0;
  
    const totalEuro = basePrice + lengthBonus + formatBonus + sizeBonus;
    const coins = Math.round(totalEuro * 100);
  
    return coins;
  }

  return (
    <div className="flex flex-col mt-5 relative">
      <h1 className="font-bold text-2xl">Jewelry store</h1>

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
        
      {selected === "Avatars" && (
        <div className="grid grid-cols-5 gap-5 mt-5">
        {files.avatars.map((el, index) => (
            <motion.div
              layoutId={`avatar_${el}`}
              key={index}
              className="border border-gray-400 rounded-2xl h-auto cursor-pointer flex items-center flex-col overflow-hidden"
              onClick={() => setFocusedItem({
                url: el,
                index: index + 1,
                id_focus: `avatar_${el}`,
                price: calculatePriceInCoins(el)
              })}>
              <div className="w-35 h-35 rounded-full mt-5 overflow-hidden flex justify-center items-center">
              <img
                src={el}
                alt={`avatar_${index}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
              <div className="w-full h-25 bg-gray-300 mt-5 flex flex-col p-5">
                <h1 className="text-2xl font-medium">avatar_{index + 1}</h1>
                <h1 className="flex flex-row items-center mt-1">{calculatePriceInCoins(el)} <FaCoins className="ml-1"/></h1>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selected === "Avatar_borders" && (
        <>
        <div className="p-5 bg-gray-300 rounded-2xl mt-5">
          <h1 className="font-bold text-2xl">Here you can apply a border to your avatar</h1>
          <div className="flex flex-row w-full h-35 mt-5 overflow-x-scroll scrollbar-none scroll-hide">
            {files.avatars.map((el, index) => (
              <div
                onClick={() => setTime_avatar(el)}
                key={index}
                className="min-w-35 min-h-35 mr-5 rounded-full cursor-pointer overflow-hidden flex items-center justify-center">
                <img
                  src={el}
                  alt={`avatar_${index}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 mt-5">
          {files.borders.map((el, index) => (
            <motion.div
              layoutId={`border_${el}`}
              key={index}
              className="border border-gray-400 rounded-2xl h-auto cursor-pointer flex items-center flex-col"
              onClick={() => setFocusedItem({
                url: el,
                index: index + 1,
                id_focus: `border_${el}`,
                price: calculatePriceInCoins(el)
              })}>
                <div
                  className="w-35 h-35 rounded-full mt-5 relative flex justify-center items-center"
                  style={{
                    backgroundImage: `url(${user?.avatar_url || time_avatar || ""})`,
                    backgroundPosition: 'center',
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <img
                    src={el}
                    alt="avatar overlay"
                    loading="lazy"
                    className="min-w-42 min-h-42 absolute rounded-full object-cover"
                  />
                </div>
              <div className="w-full h-25 bg-gray-300 mt-5 flex flex-col p-5">
                <h1 className="text-2xl font-medium">border_{index + 1}</h1>
                <h1 className="flex flex-row items-center mt-1">{calculatePriceInCoins(el)} <FaCoins className="ml-1"/></h1>
              </div>
            </motion.div>
          ))}
        </div>
        </>
      )}

      {selected === "Banners" && (
        <div className="grid grid-cols-3 gap-5 mt-5">
          {files.banners.map((el, index) => (
            <motion.div
              layoutId={`banner_${el}`}
              key={index}
              className="border border-gray-400 rounded-2xl h-60 cursor-pointer flex items-center flex-col overflow-hidden relative"
              onClick={() => setFocusedItem({
                url: el,
                index: index + 1,
                id_focus: `banner_${el}`,
                price: calculatePriceInCoins(el)
              })}>
              <div className="w-100 min-h-30 rounded-2xl mt-2" style={{background: `url(${el})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}></div>
              <div className="w-full h-25 bg-gray-300 flex flex-col p-5 mt-auto">
                <h1 className="text-2xl font-medium">banner_{index + 1}</h1>
                <h1 className="flex flex-row items-center mt-1">{calculatePriceInCoins(el)} <FaCoins className="ml-1"/></h1>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {focusedItem.url !== null && focusedItem.id_focus !== null && (
          <>
            <motion.div
              className="fixed inset-0 bg-opacity-50 z-40"
              style={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
              onClick={() => setFocusedItem({
                url: null,
                index: 0,
                id_focus: null,
                price: 0
              })}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}/>

            <motion.div
              layoutId={focusedItem.id_focus}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={selected !== "Banners" ?
                 "fixed p-5 top-1/2 left-1/2 z-50 w-80 h-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-gray-400 bg-gray-200" :
                 "fixed p-5 top-1/2 left-1/2 z-50 w-210 h-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-gray-400 bg-gray-200"}>
              {selected === "Avatars" && <div className="w-50 h-50 rounded-full mt-5 m-auto" style={{background: `url(${focusedItem.url})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}></div>}
              {selected === "Avatar_borders" && 
                <div className="w-50 h-50 rounded-full mt-5 relative flex justify-center items-center m-auto" style={{backgroundImage: `url(${user?.avatar_url || time_avatar || undefined})`, backgroundPosition: 'center', backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
                  <div className="w-58 h-58 absolute rounded-full" style={{background: `url(${focusedItem.url})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}></div>
                </div>
              }
              {selected === "Banners" && <div className="w-200 min-h-60 rounded-2xl mt-2 m-auto" 
              style={{background: `url(${focusedItem.url})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}></div>}
              <div className="w-full rounded-2xl h-25 bg-gray-300 mt-5 flex flex-col p-5">
              {selected === "Avatars" && <h1 className="text-2xl font-medium">avatar_{focusedItem.index}</h1>}
              {selected === "Avatar_borders" && <h1 className="text-2xl font-medium">border_{focusedItem.index}</h1>}
              {selected === "Banners" && <h1 className="text-2xl font-medium">banner_{focusedItem.index}</h1>}
              <h1 className="flex flex-row items-center mt-1">{focusedItem.price}<FaCoins className="ml-1"/></h1>
              </div>

              {![
                ...decoration.avatars,
                ...decoration.borders,
                ...decoration.banners
              ].some(item => item.item_Url === focusedItem.url) && focusedItem.url && (
                <motion.button
                  className={`w-full h-12 mt-5 rounded-xl cursor-pointer ${ user?.money && user.money > focusedItem.price ? "hover:bg-blue-700 active:bg-blue-500 bg-blue-600" : "hover:bg-gray-700 active:bg-gray-500 bg-gray-600" } text-white font-medium` }
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    if (!focusedItem.id_focus || !focusedItem.url) return console.log('Something is void');
                    user && user.money > focusedItem.price ?  handleBuyItem(selected, focusedItem.price, focusedItem.id_focus, focusedItem.url) : addToast("You don't have money!", "alert")
                  }}
                >
                  Buy
                </motion.button>
              )}
            <p className="text-gray-500 mt-2">After buy, you can use the decoration whenever you want</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
