"use client"
import React, {useState, useEffect} from 'react'
import { Book, getTopHarryPotterBook } from '@/api/bookApi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const BestReccomend = () => {
    const [book, setBook] = useState<Book | null>()
    const router = useRouter()

    useEffect(() => {
        const fetchHarryPotterBooks = async () => {
          setBook(await getTopHarryPotterBook())
        }
        fetchHarryPotterBooks()
    }, [])

  return (
    <div className="relative flex flex-row w-full mt-5 h-96 border rounded-2xl overflow-hidden shadow-lg">
    <div className="absolute inset-0 bg-black/50 z-10"></div>
    <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/BATTleOFhoGWARtsz_PNG.webp')" }}></div>
    <div className="relative z-20 p-6 text-white">
        <h1 className="text-3xl font-bold">Battle of Hogwarts</h1>
        <p className="mt-2 text-lg">A magical showdown like no other</p>
    </div>
    <div className='absolute z-20 p-6 text-white right-0'>
        {book && book.thumbnail && <Image width={210} height={75} alt='logo' src={book.thumbnail} className='rounded-xl border-2 border-gray-800 cursor-pointer' onClick={() => router.push(`/books/${book.id}`)}/>}
    </div>
    </div>
  )
}

export default BestReccomend