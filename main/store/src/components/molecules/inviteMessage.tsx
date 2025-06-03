"use client"

import React, { useState } from 'react'
import {motion} from 'motion/react'

const InviteMessage = () => {
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSend = () => {
    const subject = encodeURIComponent('Message from user')
    const body = encodeURIComponent(
      `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )
    window.location.href = `mailto:pavl.miziuk095@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex flex-col gap-3 max-w-md p-4 rounded-2xl shadow-lg text-teal-300 relative ml-5 sm:ml-auto">
      <h2 className="text-lg font-semibold mb-2">Send an Invitation</h2>
      <input
        type="text"
        className="p-2 border border-teal-600 bg-transparent rounded outline-none placeholder:text-teal-300"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="p-2 border border-teal-600 bg-transparent rounded outline-none placeholder:text-teal-300"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        className="p-2 border border-teal-600 bg-transparent rounded resize-none outline-none placeholder:text-teal-300"
        rows={4}
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <motion.button
        onClick={handleSend}
        initial={{ translateX: 50, opacity: 0 }}
        whileInView={{ opacity: 1, translateX: 0 }}
        viewport={{ once: false }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 1 }}
        className="relative mr-auto bg-gradient-to-r from-teal-600 to-teal-500 text-white font-medium text-[17px] px-4 py-[0.35em] pl-5 h-[2.8em] rounded-[0.9em] flex items-center overflow-hidden cursor-pointer shadow-[inset_0_0_1.6em_-0.6em_#714da6] group">
        <span className="mr-10 text-teal-50">Get started</span>
        <div
          className="absolute right-[0.3em] bg-white h-[2.2em] w-[2.2em] rounded-[0.7em] flex items-center justify-center transition-all duration-300 group-hover:w-[calc(100%-0.6em)] shadow-[0.1em_0.1em_0.6em_0.2em_#7b52b9] active:scale-95">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="w-[1.1em] transition-transform duration-300 text-[#05bc8b] group-hover:translate-x-[0.1em]">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            ></path>
          </svg>
        </div>
      </motion.button>
    </div>
  )
}

export default InviteMessage
