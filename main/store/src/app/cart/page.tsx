"use client"
import React, { useEffect, useState } from 'react'
import Cookies from '../../../node_modules/@types/js-cookie'
import { CartItem } from '@/types/items'
import Image from 'next/image'
import { FaCoins } from "react-icons/fa6";
import axios from 'axios'
import useAuthStore from '@/store/auth'
import { useToastStore } from '@/store/useToastStore'

const page = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>();
    const [addTicket, setAddTicket] = useState<boolean>(false)
    const [step, setStep] = useState<number>(0);
    const { addToast} = useToastStore()
    const { user } = useAuthStore()
    const steps = ["Cart", "Address", "Payment"];
    const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));
    const [paymentMethod, setPaymentMethod] = useState<'coins' | 'card'>('coins');

    useEffect(() => {
      const res = cart.reduce((accumulator, currentValue) => accumulator + (currentValue.price * currentValue.quantity), 0);
      setTotalPrice(res)
      console.log(res)
    }, [cart])

    const handleOrder = () => {
      if (!user || !totalPrice) return;

      if (totalPrice > user.money) {
        addToast("You dont have enough money!")
      }
    
      const fetchOrder = async () => {
        try {
          console.log({
            user_ud: user.user_id,
            price: totalPrice?.toFixed(2),
            books: cart
          })
          const res = await axios.post(`http://localhost:8001/order/`, {
            user_id: user.user_id, 
            price: Number(totalPrice.toFixed(2)),
            books: cart
          });

          Cookies.remove('cart')
          setCart([])
          setStep(0)
          addToast('Bought successfully!', "success")
          
          alert("Order successful: " + res.data.order_id);
        } catch (err) {
          console.error("Order failed", err);
        }
      };
    
      if (paymentMethod === 'coins') {
        alert("Order placed with coins!");
        fetchOrder();
      } else {
        alert("Order placed with card!");
        fetchOrder();
      }
    };
    

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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
    }, []);

    useEffect(() => {
        console.log(cart)
    }, [cart])

    const changeCart = (id: string) => {
      const newCart = cart.filter((el) => el.id !== id)
      setCart(() => newCart)
      Cookies.set('cart', JSON.stringify(newCart))
    }

    const increase = (id: string) => {
      const newCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(newCart);
      Cookies.set('cart', JSON.stringify(newCart));
    };
    
    const decrease = (id: string) => {
      const newCart = cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      );
      setCart(newCart);
      Cookies.set('cart', JSON.stringify(newCart));
    };
    
 
    return (
        <div className="flex flex-col items-center px-4 py-8">
          {addTicket && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-[400px] rounded-3xl p-8 shadow-lg">
                <form className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    className="border rounded-xl h-12 px-4 text-lg outline-none"
                  />
                  <input
                    type="submit"
                    value="Add Coupon"
                    className="bg-purple-600 text-white font-semibold rounded-xl h-12 cursor-pointer hover:bg-purple-700 transition"
                  />
                </form>
              </div>
            </div>
          )}
      
          <div className="relative flex flex-row justify-around w-full max-w-2xl mt-10">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 z-0"></div>
      
            {steps.map((label, i) => (
              <div
                key={i}
                className={`relative flex flex-col items-center z-10 w-10 h-10 rounded-full justify-center
                  ${i === step ? "bg-black text-white" : i < step ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                <span className="text-xl">{i + 1}</span>
                <p className="absolute top-12 text-sm font-medium text-gray-800">{label}</p>
              </div>
            ))}
          </div>
      
          <div className="w-full max-w-6xl flex flex-col gap-8 mt-12">
            {step === 0 && (
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1 max-h-[500px] overflow-y-auto pr-2">
                  {cart.map((el, index) => (
                    <div key={index} className="flex items-center border-b border-gray-300 py-4 mb-2">
                      <Image src={el.cover} width={75} height={50} alt="cover" className="rounded-md border" />
                      <div className="ml-4 flex-1">
                        <h2 className="text-lg font-semibold">{el.title}</h2>
                        <p className="text-gray-700">$ <span className="font-medium">{el.price}</span></p>
                      </div>
                      <div className="flex flex-col items-end gap-2 w-32">
                        <button className="text-red-500 hover:text-red-700" onClick={() => changeCart(el.id)}>✕</button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => decrease(el.id)} className="w-8 h-8 bg-gray-300 rounded-lg hover:text-blue-600 cursor-pointer">−</button>
                          <span className="text-lg font-medium">{el.quantity}</span>
                          <button onClick={() => increase(el.id)} className="w-8 h-8 bg-gray-300 rounded-lg hover:text-green-600 cursor-pointer">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
      
                <div className="w-full md:w-[300px] flex flex-col">
                  <h2 className="text-xl font-semibold mt-8 mb-4">Price Details</h2>
                  <div className="bg-gray-100 rounded-xl p-4 shadow-inner text-gray-800 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Total Items:</span>
                      <span>{totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Price:</span>
                      <span>${totalPrice?.toFixed(2)}</span>
                    </div>
                    <hr className="border-gray-300 my-2" />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Final Price:</span>
                      <span>${totalPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base">
                      <span>Final Price:</span>
                      <span className="flex items-center"><span className="mr-2">{totalPrice ? (totalPrice * 120).toFixed(2) : 0}</span> <FaCoins /></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
      
            {step === 1 && (
              <div className="flex flex-col gap-4 px-4">
                <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                <input className="border p-3 rounded-xl" type="text" placeholder="Full Name" />
                <input className="border p-3 rounded-xl" type="text" placeholder="Address Line" />
                <input className="border p-3 rounded-xl" type="text" placeholder="City" />
                <input className="border p-3 rounded-xl" type="text" placeholder="ZIP Code" />
                <input className="border p-3 rounded-xl" type="text" placeholder="Country" />
              </div>
            )}
      
      {step === 2 && (
  <div className="flex flex-col gap-6 px-4">
    <h2 className="text-2xl font-bold mb-4">Payment</h2>
    <p>Total: <strong>${totalPrice?.toFixed(2)} / {(totalPrice! * 120).toFixed(0)} coins</strong></p>
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="payment"
          value="coins"
          checked={paymentMethod === 'coins'}
          onChange={() => setPaymentMethod('coins')}
        />
        Pay with Coins
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="payment"
          value="card"
          checked={paymentMethod === 'card'}
          onChange={() => setPaymentMethod('card')}
        />
        Pay with Card (Euro)
      </label>
    </div>
        {paymentMethod === 'card' && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Card Number"
              className="border rounded-xl h-12 px-4 text-lg outline-none"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="border rounded-xl h-12 px-4 text-lg w-1/2 outline-none"
              />
              <input
                type="text"
                placeholder="CVC"
                className="border rounded-xl h-12 px-4 text-lg w-1/2 outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              className="border rounded-xl h-12 px-4 text-lg outline-none"
            />
          </div>
        )}

        <button
          className="bg-black text-white h-12 rounded-xl hover:bg-gray-900 transition cursor-pointer"
          onClick={() => handleOrder()}
        >
          Confirm and Order
        </button>
      </div>
    )}
            <div className="flex justify-between mt-6">
              {step > 0 && (
                <button onClick={prevStep} className="px-6 py-3 bg-gray-300 rounded-xl hover:bg-gray-400 cursor-pointer">Back</button>
              )}
              {step < steps.length - 1 ? (
                <button onClick={nextStep} className="ml-auto px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 cursor-pointer">Next</button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>      
    );
}

export default page