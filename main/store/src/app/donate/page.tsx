'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { postRefill } from '@/api/refillApi'
import useAuthStore from '@/store/auth'
import { useToastStore } from '@/store/useToastStore'

const paymentMethods = ['Credit card', 'Paypal', 'Qr', 'Other']

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.match(/.{1,4}/g)?.join(' ') ?? ''
}

function formatExpiry(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 4) digits = digits.slice(0, 4)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return digits
  return digits.slice(0, 2) + '/' + digits.slice(2)
}

const Page = () => {
  const [selected, setSelected] = useState('Credit card')
  const [cardNumber, setCardNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [showTopUp, setShowTopUp] = useState(false)
  const [amount, setAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const { user, setMoney } = useAuthStore()
  const { addToast } = useToastStore()

  useEffect(() => {
    const bonus =
      amount >= 100
        ? amount * 200
        : amount >= 10
        ? amount * 110
        : amount * 100
  
    setTotal(bonus)
  }, [amount])
  

  const handleTransaction = () => {
    console.log(user)
    if(!user?.user_id) return
    const fetchRefill = async () => {
      try {
        await postRefill(user.user_id, {sum: total, euro: amount})
        addToast('You have successfully topped up your balance!', "success")
        setMoney(total)
      } catch(err) {
        console.log(err)
        addToast("Server error, please try again later", "error")
      } finally {
        setShowTopUp(false)
      }
    }
    fetchRefill()
  }

  const isFormValid =
    cardNumber.replace(/\s/g, '').length === 16 &&
    /^[a-zA-Z\s]+$/.test(name) &&
    expiry.length === 5 &&
    /^[0-9]{3,4}$/.test(cvv)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormValid) {
      alert('Please fill in the form correctly')
      return
    }
  }

  return (
  <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-10 px-5"
    >
      <h1 className="mb-5 text-3xl font-semibold text-gray-800">Select Payment Method</h1>

      <div className="flex flex-row gap-10 border-b border-gray-300 pb-2">
        {paymentMethods.map((method) => (
          <motion.h1
            key={method}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelected(method)}
            className={`cursor-pointer pb-1 transition-colors font-medium ${
              selected === method
                ? 'border-b-2 border-teal-600 text-teal-700'
                : 'text-gray-500 hover:text-teal-600'
            }`}
          >
            {method}
          </motion.h1>
        ))}
      </div>

      {selected === 'Credit card' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8"
        >
          <h2 className="font-semibold text-gray-800">Pay using credit cards</h2>
          <div className="flex flex-row mt-5 gap-5">
            <Image width={50} height={30} alt="masterCard" src="/masterCard.png" />
            <Image width={50} height={30} alt="visa" src="/visa.png" />
          </div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full mt-8 max-w-md mx-auto space-y-5"
          >
            <div>
              <label className="text-gray-600 text-sm" htmlFor="cardNumber">
                Credit card number
              </label>
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="mt-1 w-full border-b border-gray-700 bg-transparent outline-none py-1 text-lg tracking-widest"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm" htmlFor="name">
                Name on card
              </label>
              <input
                id="name"
                type="text"
                maxLength={30}
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  if (/^[a-zA-Z\s]*$/.test(e.target.value)) setName(e.target.value)
                }}
                className="mt-1 w-full border-b border-gray-700 bg-transparent outline-none py-1 text-lg"
              />
            </div>

            <div className="flex flex-row gap-5">
              <div className="flex-1">
                <label className="text-gray-600 text-sm" htmlFor="expiry">
                  Expiry (MM/YY)
                </label>
                <input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="mt-1 w-full border-b border-gray-700 bg-transparent outline-none py-1 text-lg tracking-widest"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-600 text-sm" htmlFor="cvv">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => {
                    if (/^\d{0,4}$/.test(e.target.value)) setCvv(e.target.value)
                  }}
                  className="mt-1 w-full border-b border-gray-700 bg-transparent outline-none py-1 text-lg tracking-widest"
                />
              </div>
            </div>

            <motion.input
              whileTap={{ scale: 0.95 }}
              type="submit"
              value="Pay"
              disabled={!isFormValid}
              onClick={() => setShowTopUp(true)}
              className={`w-full h-12 rounded-xl mt-5 cursor-pointer font-medium transition
                ${isFormValid ? 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800' : 'bg-gray-400 cursor-not-allowed text-gray-700'}`}
            />
          </motion.form>
        </motion.div>
      )}
    </motion.div>

    {showTopUp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center flex-col">
          <div className="w-full max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-md p-6 absolute -translate-y-75">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Top-up Bonuses</h2>
            <ul className="space-y-3 text-gray-700 text-base">
              <li className="flex justify-between">
                <span>Up to €9</span>
                <span>100 coins per €1</span>
              </li>
              <li className="flex justify-between">
                <span>From €10 to €49</span>
                <span><strong>+10% bonus</strong> (110 coins per €1)</span>
              </li>
              <li className="flex justify-between">
                <span>€100 and more</span>
                <span><strong>200 coins</strong> per €1</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowTopUp(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Top up your balance</h2>
            <label htmlFor="amount" className="block text-gray-600 text-sm mb-1">
              Amount in €
            </label>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="w-full border-b border-gray-700 outline-none py-2 text-lg mb-4"
            />
            <div className="mb-4 text-gray-700">
              You will receive: 
              <span className="font-bold ml-1">
                 {total} coins
              </span>
            </div>
            <button
              onClick={() => handleTransaction()}
              disabled={amount <= 0}
              className={`w-full h-12 rounded-xl font-medium cursor-pointer transition ${
                amount > 0
                  ? 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800'
                  : 'bg-gray-400 cursor-not-allowed text-gray-700'
              }`}
            >
              Confirm top-up
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Page
