"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getBooksByGenre, getTopAuthorBooks, GenreBooks} from '@/api/bookApi';
import {motion} from 'motion/react'
import { useRouter } from 'next/navigation';

interface RecomendsByProps {
    data: string[]
    type: string
}

const RecomendsBy = ({data, type} : RecomendsByProps) => {
  const [bookList, setBookList] = useState<GenreBooks[]>([]);
  const router = useRouter()

  useEffect(() => {
    const fetchBooks = async () => {
        if(type === 'author' && data){
            const res = await getTopAuthorBooks(data);
            setBookList(res);
        } 
        if (type === "genre") {
            const res = await getBooksByGenre(data[0], 5);
            setBookList([{ genre: data[0], books: res }]);
        }
    };
    fetchBooks();
  }, []);

  return (
    <motion.div
    initial={{translateY: 100, opacity: 0}}
    whileInView={{translateY: 0, opacity: 1}}
    transition={{duration: 1}}>
        <h1 className='mt-5 font-bold text-2xl'>{type === "author" ? 'This author wrote else' : "In this ganre exist else"}</h1>
        <p>From the most popular to the least popular</p>
        <div className='flex flex-row mt-5 overflow-x-scroll pb-5 gap-5' style={{scrollbarWidth: 'none'}}>
            {bookList.length > 0 ? bookList.map((book, index) => (
                <div className='w-25 h-5'>
                    {book.books[index].title}
                </div>
            )) : <h1>Loading...</h1>}
        </div>
    </motion.div>
  )
}

export default RecomendsBy