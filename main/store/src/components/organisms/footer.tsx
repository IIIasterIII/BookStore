"use client"

import React from 'react'
import InviteMessage from '@/components/molecules/inviteMessage';
import MiniProfile from '@/components/molecules/miniProfile';
import {motion} from 'motion/react'

const Footer = () => {
  return (
    <motion.section id="contactsMe" className='w-full max-w-[1536px] h-auto sm:min-h-[400px] bg-gray-900 mt-10 rounded-3xl flex flex-col mb-20'
    initial={{translateY: 100, opacity: 0}}
    whileInView={{translateY: 0, opacity: 1}}
    transition={{duration: 1}}
    >
      <div className='flex flex-col sm:flex-row items-center mb-5'>
        <MiniProfile/>
        <InviteMessage/>
      </div>
    </motion.section>
  )
}

export default Footer