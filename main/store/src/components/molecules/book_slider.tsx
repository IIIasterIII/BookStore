"use client"

import React, { useEffect, useState } from 'react'
import { Book, getBestBooksOfMonth, getUpcomingBooks, getRecommendedBooks } from '@/api/bookApi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type BookType = "getBestBooksOfMonth" | "getUpcomingBooks" | "getRecommendedBooks"

interface BookSliderProps {
  type: BookType
}

const BookSlider = ({ type }: BookSliderProps) => {
  const [books, setBooks] = useState<Book[] | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      let data: Book[] = []
      switch (type) {
        case 'getBestBooksOfMonth':
          data = await getBestBooksOfMonth()
          break
        case 'getUpcomingBooks':
          data = await getUpcomingBooks()
          break
        case 'getRecommendedBooks':
          data = await getRecommendedBooks()
          break
      }
      setBooks(data)
      setLoading(false)
    }

    fetchBooks()
  }, [type])

  const getTitle = () => {
    switch (type) {
      case 'getBestBooksOfMonth':
        return '📚 Best Books of the Month'
      case 'getUpcomingBooks':
        return '⏳ Upcoming Books'
      case 'getRecommendedBooks':
        return '💡 Recommended Books'
    }
  }

  return (
    <div className='w-full mb-10'>
      <h1 className='text-2xl font-bold mb-4 text-gray-800'>{getTitle()}</h1>

      {loading && (
        <div className='flex space-x-4 overflow-x-auto'>
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className='min-w-45 h-80 bg-gray-200 animate-pulse rounded-xl'
            />
          ))}
        </div>
      )}

      {!loading && books && (
        <div
          className='flex space-x-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'
        >
          {books.map((el, index) => (
            <div onClick={() => router.push(`/books/${el.id}`)} key={index} className='w-60 h-auto snap-start cursor-pointer flex-shrink-0 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-3'>
              <div className='min-w-45 h-80 mb-3 relative rounded-lg overflow-hidden'>
                {el.thumbnail ? (
                  <Image
                    src={el.thumbnail}
                    fill
                    sizes="(max-width: 768px) 100vw,
                    (max-width: 1200px) 50vw,
                    33vw"
                    alt='Book cover'
                    className='object-cover transition-transform duration-300 hover:scale-105'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-100' />
                )}
              </div>
              <h2 className='text-sm font-semibold text-gray-800 line-clamp-2'>{el.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookSlider
