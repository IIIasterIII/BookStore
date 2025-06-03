"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getTopGenresBooks, GenreBooks } from '@/api/bookApi';
import {motion} from 'motion/react'
import { useRouter } from 'next/navigation';

const Recomends = () => {
  const [bookList, setBookList] = useState<GenreBooks[]>([]);
  const router = useRouter()

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getTopGenresBooks();
      setBookList(data);
    };
    fetchBooks();
  }, []);

  return (
    <div>
        <h1 className='mt-5 font-bold text-2xl'>All popular topics</h1>
        <p>From the most popular to the least popular</p>
        <div className='flex flex-row mt-5 overflow-x-scroll pb-5 gap-5' style={{scrollbarWidth: 'none'}}>
            {bookList.length > 0 ? bookList.map((book, index) => (
                <motion.div key={index} className='min-h-60 border min-w-100 rounded-2xl relative flex justify-center overflow-hidden'
                initial={{opacity: 0, translateY: 50}}
                animate={{opacity: 1, translateY: 0}}
                transition={{delay: index*0.2, duration: 1}}
                >
                <h1 className='font-bold text-2xl mb-10 mt-2'>{book.genre}</h1>
                <div onClick={() => router.push(`/books/${book.books[0].id}`)} className='min-w-45 overflow-hidden min-h-65 absolute rounded-2xl -bottom-30 right-0 rotate-30 border-2 border-gray-300'>
                    <Image sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" quality={90}  fill priority style={{ objectFit: 'cover'}} alt='book' src={`${book.books[0]?.thumbnail || ''}`}/>
                </div>
                <div onClick={() => router.push(`/books/${book.books[1].id}`)} className='min-w-45 overflow-hidden min-h-65 absolute rounded-2xl -bottom-20 z-10 border-2 border-gray-300'>
                    <Image sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" quality={90}  fill priority style={{ objectFit: 'cover'}} alt='book' src={`${book.books[1]?.thumbnail || ''}`}/>
                </div>
                <div onClick={() => router.push(`/books/${book.books[2].id}`)} className='min-w-45 overflow-hidden min-h-65 absolute rounded-2xl -bottom-30 z-10 left-0 -rotate-30 border-2 border-gray-300'>
                    <Image sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" quality={90}  fill priority style={{ objectFit: 'cover'}} alt='book' src={`${book.books[2]?.thumbnail || ''}`}/>
                </div>
            </motion.div>
            )) : <h1>Loading...</h1>}
        </div>
    </div>
  )
}

export default Recomends