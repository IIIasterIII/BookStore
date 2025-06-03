"use client"

import React, { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { getBookDetails, BookDetails } from '@/api/bookApi'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import Cookies from '../../../../node_modules/@types/js-cookie'
import { TiShoppingCart } from "react-icons/ti";
import Loader from '@/app/loader'
import { motion } from 'motion/react'
import { useToastStore } from '@/store/useToastStore'
import useAuthStore from '@/store/auth'
import axios from 'axios'
import { useSocketStore } from '@/store/useWebSocket'
import { formatDistanceToNow, parseISO, differenceInDays, format } from 'date-fns'

interface UserData {
  avatar_url: string | null
  banner_url: string | null
  border_url: string | null
  username: string
}

interface Comment {
    id_c: number
    user_id_fk: number
    text: string
    group_id: string
    date: string
    user_data: UserData
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  cover: string;
};

interface User {
  id: string;
  groupId: string;
}

const Page = () => {
  const { user } = useAuthStore()
  const { connectToGroup, disconnect } = useSocketStore()
  const path = usePathname()
  const { addToast } = useToastStore() 
  const[book, setBook] = useState<BookDetails>()
  const[show, setShow] = useState(false)
  const[quality, setQuality] = useState(1)
  const { addToCart } = useCartStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>()
  const socket = useRef<WebSocket | null>(null)

  useEffect(() => {
    const getBookInfo = async (path: string) => {
      setBook(await getBookDetails(path) || undefined)
    }
    if(path) {
      getBookInfo(path.slice(7))
    }
  }, [])

  function formatCommentDate(dateString: string) {
    const date = parseISO(dateString)
    const daysDiff = differenceInDays(new Date(), date)
  
    if (daysDiff <= 3) {
      return formatDistanceToNow(date, { addSuffix: true }) // "1 second ago", "3 days ago"
    } else {
      return format(date, 'yyyy-MM-dd HH:mm') // например: "2025-06-01 11:50"
    }
  }
  

  useEffect(() => {
    if (!user || !path) return;
  
    const groupId = path.slice(7);
    socket.current = new WebSocket(`ws://localhost:8003/ws/${groupId}/${user.user_id}`);
  
    socket.current.onopen = () => {
      console.log(`🔌 Подключено к ws: ${user.user_id} -> ${groupId}`);
    };
  
    socket.current.onmessage = (event) => {
      try {
        const comment: Comment = JSON.parse(event.data);
        console.log(comment)
        setComments(prev => [...prev, comment]);
      } catch (e) {
        console.error('Ошибка парсинга сообщения из WebSocket', e);
      }
    };
  
    socket.current.onerror = (error) => {
      console.error('WebSocket ошибка', error);
    };
  
    socket.current.onclose = () => {
      console.log(`❌ Соединение закрыто: ${user.user_id}`);
    };
  
    return () => {
      socket.current?.close();
    };
  }, [user]);

  useEffect(() => {
    console.log(comments)
  }, [comments])
  
  

  const pushToCart = () => {
    if (!book) return;
  
    const newBook: CartItem = {
      id: book.id,
      title: book.title,
      price: book.price,
      quantity: quality,
      cover: book.coverLarge || book.coverMedium || book.coverSmall || ''
    };
  
    const data = Cookies.get('cart');
    let cart: CartItem[] = [];

    addToast("Item successfully added to cart", "success")
  
    if (data) {
      try {
        cart = JSON.parse(data);
  
        const existing = cart.find((item: CartItem) => item.id === newBook.id);
        if (existing) {
          existing.quantity += newBook.quantity;
        } else {
          cart.push(newBook);
        }
      } catch (error) {
        console.error('Cookie cart:', error);
        cart = [newBook];
      }
    } else {
      cart = [newBook];
    }
  
    Cookies.set('cart', JSON.stringify(cart));
    addToCart(newBook);
    console.log('added to cart');
  };

  const handleMakeComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const comment = {
      user_id: user?.user_id,
      text: commentText,
      group_id: path.slice(7),
    };
  
    if (!socket.current) return
    socket.current.send(JSON.stringify(comment));
    setCommentText("");
  };

  const uniqueGenres = [...new Set(
    book?.genres?.map(g => g.toLowerCase()).map(g => {
      if (g.includes('horror')) return 'Horror';
      if (g.includes('thriller')) return 'Thriller';
      if (g.includes('psychological')) return 'Psychological';
      if (g.includes('fantasy')) return 'Fantasy';
      if (g.includes('science fiction')) return 'Sci-Fi';
      if (g.includes('gothic')) return 'Gothic';
      if (g.includes('ghost')) return 'Ghost';
      if (g.includes('children')) return 'Children';
      if (g.includes('historical')) return 'Historical';
      if (g.includes('dracula')) return 'Dracula';
      if (g.includes('vampire')) return 'Vampires';
      if (g.includes('criticism')) return 'Criticism';
      if (g.includes('romania') || g.includes('england') || g.includes('irish')) return 'Regional';
      if (g.includes('fiction')) return 'Fiction';
      return g.charAt(0).toUpperCase() + g.slice(1);
    })
  )];

  return (
    <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    transition={{ duration: 0.5 }}
    className="mt-10 px-6 sm:px-10 lg:px-20 xl:px-40"
  >
    {book ? (
      (book.coverLarge || book.coverMedium || book.coverSmall) && (
        <motion.div 
          className="flex flex-col md:flex-row items-start gap-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <motion.img
            src={book.coverLarge || book.coverMedium || book.coverSmall || ''}
            alt={book.title || 'Book cover'}
            width={350}
            height={500}
            className="rounded-2xl shadow-xl"
            initial={{ scale: 0.9 }}
            whileHover={{ scale: 1.03 }}
          />

          <div className="flex flex-col gap-4 w-full md:w-2/3">
            <motion.h1 layout className="text-4xl font-bold text-gray-900">
              {book.title}
            </motion.h1>
            {book.authors?.map((el, i) => (
              <motion.h2 layout key={i} className="text-lg text-gray-700">
                {el}
              </motion.h2>
            ))}
            <motion.div layout className="flex h-15 flex-wrap gap-2 mt-4 items-start">
              {uniqueGenres.map((genre, i) => (
                (show || i < 5) && (
                  <motion.span 
                    key={i}
                    className="px-3 py-1 h-8 flex justify-center items-center bg-gray-300 text-gray-900 rounded-full font-semibold shadow-sm"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  > {genre}   </motion.span> )
              ))}
            </motion.div>
            {book.genres?.length > 5 && (
              <motion.button 
                onClick={() => setShow(prev => !prev)}
                className="text-blue-600 hover:underline font-semibold ml-auto mt-1"
              >
                {show ? 'Hide genres' : 'Show all genres'}
              </motion.button>
            )}

            <motion.div layout className="text-gray-600">
              {book.language && <p><strong>Language:</strong> {book.language}</p>}
              {book.numberOfPages && <p><strong>Pages:</strong> {book.numberOfPages}</p>}
            </motion.div>

            <motion.p layout className="text-md leading-6 text-gray-800 mt-2">
              {book.description}
            </motion.p>

            <motion.div 
              className="flex items-center justify-start bg-yellow-100 rounded-2xl p-4 mt-5 shadow-inner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <select
                className="text-lg font-bold bg-transparent outline-none text-gray-700"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              >
                {Array.from({ length: 30 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <motion.button
                onClick={() => pushToCart()}
                whileTap={{ scale: 0.95 }}
                className="ml-5 bg-amber-600 cursor-pointer duration-300 transition-all hover:bg-amber-400 active:bg-amber-300 text-white text-3xl p-3 rounded-xl shadow-lg"
              >
                <TiShoppingCart />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )
    ) : (
      <div className="text-center text-gray-600 py-10">Loading...</div>
    )}

    <div>
      <h1 className='font-medium text-3xl mt-5'>Comments</h1>
      <form onSubmit={(el) => handleMakeComment(el)} action="" className='flex flex-col mt-5'>
        <input type="text" placeholder='type a comment' defaultValue={commentText} className='border rounded-2xl h-12 pl-5 pr-5' onChange={(el) => setCommentText(el.target.value)}/>
        <input type="submit" value={'send message'} className='mt-5 ml-auto cursor-pointer hover:bg-violet-800 active:bg-violet-500 bg-violet-700 text-violet-50 rounded-xl h-12 duration-300 w-75'/>
      </form>
      <div className='flex flex-col border mt-10 min-h-75'>
      {comments?.map((el, i) => (
        <div key={i} className="flex items-start gap-4 p-4 border rounded-2xl shadow-sm bg-white">
          <div className="relative w-12 h-12 flex-shrink-0">
            <div
              className="w-full h-full rounded-full bg-cover bg-center bg-no-repeat"
              style={
                el.user_data?.avatar_url
                  ? { backgroundImage: `url(${el.user_data.avatar_url})` }
                  : { backgroundColor: 'brown' }
              }
            />
            {user?.border_url && (
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none"
                style={{
                  backgroundImage: `url(${el.user_data.border_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">{el.user_data.username || 'Anonymous'}</span>
              <span className="font-medium text-gray-500"> { formatCommentDate(el.date) } </span>
            </div>
            <p className="mt-1 text-sm text-gray-700">{el?.text || 'No comment text.'}</p>
          </div>
        </div>
        ))}
      </div>
    </div>

  </motion.div>
  )
}

export default Page