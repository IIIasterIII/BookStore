import React from 'react'
import Image from 'next/image'

const AdvertisementBanner = () => {
  return (
    <div className="relative w-full h-[450px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-yellow-50 to-white">
      <div className="absolute bottom-0 left-0 w-[300px] h-[400px] md:w-[450px] md:h-[600px]">
        <Image
          alt="Bookstore Banner"
          src="/sharia_books_and_stationary_vector_illustration_isolated_on_whi_597a5199-b299-44fb-9736-64fbd9a41857-photoroom-png-photoroom.png"
          fill
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
          className="object-contain"
        />
      </div>

      <div className="z-10 w-[90%] max-w-3xl h-[90%] bg-white/90 border border-amber-200 shadow-xl rounded-xl flex flex-col items-center justify-center text-center text-amber-800 p-6">
        <h2 className="text-xl md:text-2xl font-medium">Special Offer</h2>
        <h1 className="text-3xl md:text-5xl font-bold mt-2">BOOKSTORE</h1>
        <h2 className="mt-4 px-6 py-2 border-2 border-amber-600 rounded-md text-lg md:text-xl font-semibold hover:bg-amber-100 transition cursor-pointer hover:scale-110 duration-300">
          UP TO 50% OFF SALE
        </h2>
        <p className="mt-4 max-w-md text-sm md:text-base text-amber-600">
          As a new user, your first 5 books will cost 50% less. Don't miss out!
        </p>
      </div>
    </div>
  )
}

export default AdvertisementBanner
