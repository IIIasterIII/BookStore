"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaCoins } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import Cookies from '../../../node_modules/@types/js-cookie'
import { CartItem } from '@/types/items'
import useAuthStore from '@/store/auth';
import { motion, AnimatePresence } from 'motion/react'
import { useCartStore } from '@/store/cart';
import { useToastStore } from '@/store/useToastStore';
import { FaExchangeAlt } from "react-icons/fa";

interface NavbarProps {
  setLogOutPanel: (value: boolean) => void;
}

interface MainUser {
  user_id: number;
  username: string;
  email: string;
  money: number;
  avatar_url?: string;
  banner_url?: string;
  border_url?: string;
}

const Navbar = ({setLogOutPanel}: NavbarProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const [myCart, setCart] = useState<CartItem[]>()
  const { user } = useAuthStore()
  const [MainUser, setMainUser] = useState<MainUser>()
  const { cart}  = useCartStore()
  const [money, setMoney] = useState(0)
  const { addToast } = useToastStore()

  useEffect(() => {
    const data = Cookies.get('cart');
    if (data) {
      try {
        const parsed = JSON.parse(data) as CartItem[];
        setCart(parsed);
      } catch (error) {
        console.error('Error cookie cart:', error);
        setCart([]);
      }
    }
  }, [cart]);

  useEffect(() => {
    if (!user) return
    setMoney(user.money)
  }, [user])

  useEffect(() => {
    if (!user) return
    setMainUser({...user})
  }, [user])

  const handleNavigation = (path: string) => {
    router.push(path)
    setOpen(false)
  }

  return (  
    <div className='w-full h-12 flex flex-row items-center relative mt-2 bg-gray-300 rounded-b-3xl'>
      <div className='flex flex-row items-center justify-center mr-auto ml-5' onClickCapture={() => handleNavigation('/')}>
        <Image src="/logo.svg" alt="logo" width={30} height={30} unoptimized/>
        <p className='ml-2 text-2xl font-bold text-orange-600'>Prysm</p>
      </div>

      <FaExchangeAlt className='mr-5 text-2xl cursor-pointer' onClick={() => router.push('/changelog')}/>

      <div className='flex flex-row items-center justify-center bg-amber-200 rounded-full pl-5 pr-2 h-8 cursor-pointer' onClick={() => handleNavigation('/donate')}>
        <h1 className='mr-3'>{money}</h1>
        <FaCoins/>
      </div>


      <div className='flex justify-center items-center mr-5 ml-5 relative text-2xl cursor-pointer' onClick={() => handleNavigation('/cart')}>
        <FaShoppingCart/>
        {typeof window !== 'undefined' && myCart && myCart.length > 0 && <div className='absolute top-0 right-0 -translate-y-1 translate-x-2.5 bg-red-700 w-4 h-4 rounded-full flex justify-center items-center'>
          <p className='text-sm text-blue-50'>{myCart.length}</p>
        </div>}
      </div> 

      <div className='w-10 h-10 cursor-pointer relative rounded-full flex justify-center items-center mr-5' style={user?.avatar_url ? 
      {backgroundImage: user?.avatar_url ? `url(${user.avatar_url})` : undefined, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"} : {backgroundColor: "brown"}} onClick={() => {
        setOpen(prev => !prev)
        }}>
          <div
            className="absolute w-12 h-12"
            style={{
              backgroundImage: user?.border_url ? `url(${user.border_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </div>

      <AnimatePresence>
      {open &&
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30}}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseLeave={() => setOpen(prev => !prev)} className='w-75 h-auto absolute bg-gray-400 text-gray-900 top-12 right-4 rounded-b-2xl overflow-hidden z-50 mr-2'>
      <div className='h-25 object-center object-cover relative'>
          <Image unoptimized fill alt='header' src={user?.banner_url || '/art_header4.jpg'} onClick={() => handleNavigation('/users/Aster')}/>
          <div style={user?.avatar_url ? 
            {backgroundImage: user?.avatar_url ? `url(${user.avatar_url})` : 'url(/art_header4.jpg)', backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"} : {backgroundColor: "brown"}} 
           className='w-25 h-25 rounded-full left-5 relative translate-y-6/12 border-2 border-blue-50 flex justify-center items-center' onClick={() => handleNavigation('/users/Aster')}>
            <div className='absolute w-30 h-30' style={{
              backgroundImage: user?.border_url ? `url(${user.border_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}></div>
          </div>
        </div>  

        <div className=' w-full h-full relative flex flex-col pl-5 pr-5 mt-15'>
          <h1 className='font-bold text-2xl'>{MainUser?.username}</h1>
          <div className='flex flex-col mt-2 border-t border-solid pt-2 border-b pb-2'> 
            <p onClick={() => handleNavigation(`/users/${MainUser?.username}`)}
              className="relative w-20 pb-1 cursor-pointer text-lg font-medium text-gray-800 
              after:absolute after:left-0 after:bottom-0 hover:font-bold after:h-[2px] after:w-0 after:bg-gradient-to-r 
              after:from-cyan-400 after:to-blue-600 after:transition-all after:duration-300 hover:after:w-full duration-300 ease-in-out">
            Profile</p>
            <p onClick={() => handleNavigation('/settings/appearance')}
              className="relative w-20 pb-1 cursor-pointer text-lg font-medium text-gray-800 
              after:absolute after:left-0 after:bottom-0 hover:font-bold after:h-[2px] after:w-0 after:bg-gradient-to-r 
              after:from-cyan-400 after:to-blue-600 after:transition-all after:duration-300 hover:after:w-full duration-300 ease-in-out">
            Setting</p>
            <p
              onClick={() => handleNavigation('/store')}
              className="relative w-20 pb-1 cursor-pointer text-lg font-medium text-gray-800 
              after:absolute after:left-0 hover:font-bold after:bottom-0 after:h-[2px] after:w-0 after:bg-gradient-to-r 
              after:from-cyan-400 after:to-blue-600 after:transition-all after:duration-300 hover:after:w-full duration-300 ease-in-out">
              Shop
            </p>
          </div>
          <p
          className="relative w-20 pb-1 cursor-pointer text-lg font-medium text-gray-800 
          after:absolute mb-5 after:left-0 after:bottom-0 hover:font-bold after:h-[2px] after:w-0 after:bg-gradient-to-r 
          after:from-cyan-400 after:to-blue-600 after:transition-all after:duration-300 hover:after:w-full duration-300 ease-in-out"
           onClick={() => setLogOutPanel(true)}>Exit</p>
        </div>
        </motion.div>} 
      </AnimatePresence>
    </div>
  )
}

export default Navbar