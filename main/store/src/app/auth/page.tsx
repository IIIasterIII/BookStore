"use client"

import React, { useState } from 'react'
import { getRegister, getLogin, forgotPassword } from '@/api/authApi'
import { useRouter } from 'next/navigation'
import Cookies from '../../../node_modules/@types/js-cookie'
import { getProtected } from '@/api/authApi'
import useAuthStore from '@/store/auth'
import { useToastStore } from '@/store/useToastStore'

const Page = () => {
  const[state, setState] = useState(true)
  const {user, setUser} = useAuthStore()
  const { addToast } = useToastStore()
  const [forgotPasswordPanel, setForgotPasswordPanel] = useState<boolean>(false)
  const [email, setEmail] = useState<string>()
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    repeat_password: ''
  })
  const router = useRouter()

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-400',
    'bg-green-400',
    'bg-teal-400',
  ];

  const handleForgotPassword = async (el: React.FormEvent<HTMLFormElement>) => {
    if(!email) return
    el.preventDefault()
    try {
      const res = await forgotPassword(email)
      addToast(res.status.toString(), "success")
    } catch(err){
      console.log(err)
    }
  }

  const handleRegister = async (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    try {
      await getRegister(data)
      addToast('The account was created', "success")
      setState(true)
    } catch (err) {
      addToast('Data error', "error")
    }
  }

  const handleLogin = (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault()  

    const fetchUser = async () => {
      const token = Cookies.get("access_token");
      if (token) {
        try {
          const res = await getProtected(token);
          setUser(res)
        } catch (error) {
          router.push("/auth")
        }
      } else {
        router.push("/auth");
      }

    };

    
    const logFunc = async () => {
      try {
        await getLogin(data)
        await fetchUser()
        addToast("You're logged in", "success")
        router.push('/')
      } catch(err){
        addToast('Wrong data', "error")
        console.log(err)
      }
    }

    logFunc()
  }

  return (
    <div className='flex flex-row bg-gray-50 h-auto w-215 p-5 gap-5 rounded-4xl border border-gray-300'>
      {state ? <>
        <div className="relative bg-slate-900 p-2 min-w-75 rounded-4xl">
        <div className="relative flex text-center">
          <div className="flex pl-3.5 pt-3"><svg viewBox="0 0 24 24" fill="currentColor" className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400">
              <circle r="12" cy="12" cx="12"></circle>
            </svg><svg viewBox="0 0 24 24" fill="currentColor" className="-ml-0.75 mr-1.5 h-3 w-3 text-yellow-400">
              <circle r="12" cy="12" cx="12"></circle>
            </svg><svg viewBox="0 0 24 24" fill="currentColor" className="-ml-0.75 mr-1.5 h-3 w-3 text-green-400">
              <circle r="12" cy="12" cx="12"></circle>
            </svg></div><span className="absolute inset-x-0 top-2 text-xs text-slate-500">JSON</span>
        </div>
        <div className="mt-5 space-y-1.5 px-5 pb-10 overflow-x-scroll">
          {data && <p className="mt-4 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">{'data {'}</span>
          </p>}
          {}
          {data.username && <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">logInData: </span>
            <span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400">{data.username}</span></span><span className="text-pink-400"> ,</span>
          </p>}
          {email && <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">email: </span>
            <span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400 flex flex-wrap">{email}</span></span><span className="text-pink-400"> ,</span>
          </p>}
          {data.email && <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">email: </span>
            <span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400 flex flex-wrap">{data.email}</span></span><span className="text-pink-400"> ,</span>
          </p>}
          {data.password && <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">password: </span>
            <span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400 flex flex-wrap">{data.password}</span></span><span className="text-pink-400"> ,</span>
          </p>}
          {<p className="mt-4 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">{'}'}</span>
          </p>}
        </div>
      </div>

      <div className='w-full h-full'>
        {forgotPasswordPanel ? 
          <form action="" className='flex flex-col mt-10 w-120 items-center' onClick={(el) => handleForgotPassword(el)}>
            <h1 className='mb-2 mr-auto ml-10 font-medium'>Type your email</h1>
            <input type="text" className='w-100 border border-gray-4 rounded-xl pl-5 pr-5 outline-none h-12 focus:border-blue-500 focus:border-2' onChange={(el) => setEmail(el.target.value)} placeholder='email'/>
            <input type="submit" value={'send a message'} className='mt-5 cursor-pointer hover:bg-violet-800 active:bg-violet-500 bg-violet-700 text-violet-50 rounded-xl h-12 duration-300 w-100'/>
          </form> : 
        <form action="" className='flex flex-col items-center w-120' onSubmit={(el) => handleLogin(el)}>
          <h1 className='font-bold text-4xl mb-2'>Welcome Back</h1>
          <p className='mb-3'>Enter your email and password to access your account!</p>
          <div>
            <p className='font-medium'>Username or email</p>
            <input type="text" placeholder='Enter username or email' className='w-100 border border-gray-4 rounded-xl pl-5 pr-5 outline-none h-12 focus:border-blue-500 focus:border-2' onChange={(el) => setData(prev => ({...prev, username: el.target.value}))} />
          </div>
          <div>
            <p className='font-medium mt-3'>Password</p>
            <input type="password" placeholder='Enter password' className='w-100 border border-gray-4 rounded-xl pl-5 pr-5 outline-none h-12 focus:border-blue-500 focus:border-2' onChange={(el) => setData(prev => ({...prev, password: el.target.value}))}/>
          </div>
          <p className='ml-auto mr-10 text-blue-600 underline cursor-pointer mt-1 hover:text-blue-400 duration-300 active:text-blue-700 select-none' onClick={() => setForgotPasswordPanel(prev => !prev)}>Forgot password</p>
          <input type="submit" value={'Log In'} className='mt-5 cursor-pointer hover:bg-violet-800 active:bg-violet-500 bg-violet-700 text-violet-50 rounded-xl h-12 duration-300 w-100'/>
        </form>
        }
        <div className='flex flex-row items-center justify-center mt-30'>
          <p>Don't have an account?</p>
          <button className='underline ml-3 text-blue-600 cursor-pointer hover:text-blue-800 active:text-blue-500 duration-300' onClick={() => {
            setData({
              username: '',
              email: '',
              password: '',
              repeat_password: ''
            })
            setForgotPasswordPanel(false)
            setState(prev => !prev)
            }}>Sign Up</button>
        </div>
      </div>
      </> : <>
        <div className="relative bg-slate-900 p-2 min-w-75 rounded-4xl">
        <div className="relative flex text-center">
          <div className="flex pl-3.5 pt-3"><svg viewBox="0 0 24 24" fill="currentColor" className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400">
              <circle r="12" cy="12" cx="12"></circle>
            </svg><svg viewBox="0 0 24 24" fill="currentColor" className="-ml-0.75 mr-1.5 h-3 w-3 text-yellow-400">
              <circle r="12" cy="12" cx="12"></circle>
            </svg><svg viewBox="0 0 24 24" fill="currentColor" className="-ml-0.75 mr-1.5 h-3 w-3 text-green-400">
              <circle r="12" cy="12" cx="12"></circle>
            </svg></div><span className="absolute inset-x-0 top-2 text-xs text-slate-500">JSON</span>
        </div>
        <div className="mt-5 space-y-1.5 px-5 pb-10 overflow-x-scroll">
          {data && <p className="mt-4 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">{'data {'}</span>
          </p>}
          {data.username && <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">username: </span>
            <span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400">{data.username}</span></span><span className="text-pink-400"> ,</span>
          </p>}
          {data.email && <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">email: </span>
            <span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400 flex flex-wrap">{data.email}</span></span><span className="text-pink-400"> ,</span>
          </p>}
          {data.password && <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">password: </span>
            <span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400 flex flex-wrap">{data.password}</span></span><span className="text-pink-400"> ,</span>
          </p>}
          {data.repeat_password && <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">repeat_password: </span>
            <span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400 flex flex-wrap">{data.repeat_password}</span></span><span className="text-pink-400"> ,</span>
          </p>}
          {<p className="mt-4 font-mono text-xs font-normal tracking-wide text-violet-400">
            <span className="text-pink-400">{'}'}</span>
          </p>}
        </div>
      </div>

      <div className='w-full h-full'>
        <form action="" className='flex flex-col items-center w-120' onSubmit={(el) => handleRegister(el)}>
          <h1 className='font-bold text-4xl mb-2'>Sign Up Account</h1>
          <p className='mb-3'>Enter your personal data to create your account.</p>
          <div>
            <p className='font-medium'>Username</p>
            <input type="text" placeholder='Enter username' className='w-100 border border-gray-4 rounded-xl pl-5 pr-5 outline-none h-12 focus:border-blue-500 focus:border-2' onChange={(el) => setData(prev => ({...prev, username: el.target.value}))} />
          </div>
          <div>
            <p className='font-medium mt-3'>Email</p>
            <input type="email" placeholder='Enter email' className='w-100 border border-gray-4 rounded-xl pl-5 pr-5 outline-none h-12 focus:border-blue-500 focus:border-2' onChange={(el) => setData(prev => ({...prev, email: el.target.value}))} />
          </div>
          <div>
            <p className='font-medium mt-3'>Password</p>
            <input
              type="password"
              placeholder='Enter password'
              className='w-100 border border-gray-4 rounded-xl pl-5 pr-5 outline-none h-12 focus:border-blue-500 focus:border-2'
              onChange={(el) => setData(prev => ({ ...prev, password: el.target.value }))}
            />

            {data.password && (
              <div className="mt-2 h-2 w-full rounded bg-gray-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strengthColors[getPasswordStrength(data.password) - 1] || 'bg-gray-200'
                  }`}
                  style={{ width: `${(getPasswordStrength(data.password) / 5) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
          <div>
            <p className='font-medium mt-3'>Repeat password</p>
            <input type="password" placeholder='Enter the same password' className='w-100 border border-gray-4 rounded-xl pl-5 pr-5 outline-none h-12 focus:border-blue-500 focus:border-2' onChange={(el) => setData(prev => ({...prev, repeat_password: el.target.value}))}/>
          </div>
          <input type="submit" value={'Sign In'} className='mt-5 cursor-pointer hover:bg-violet-800 active:bg-violet-500 bg-violet-700 text-violet-50 rounded-xl h-12 duration-300 w-100'/>
        </form>
        <div className='flex flex-row items-center justify-center mt-30'>
          <p>Already have an account?</p>
          <button className='underline ml-3 text-blue-600 cursor-pointer hover:text-blue-800 active:text-blue-500 duration-300' onClick={() => {
            setData({
              username: '',
              email: '',
              password: '',
              repeat_password: ''
            })
            setState(prev => !prev)
          }}>Log In</button>
        </div>
      </div>
      </>}
    </div>
  ) 
}

export default Page