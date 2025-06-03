import News from '@/components/molecules/news'
import Recomends from '@/components/molecules/recomends'
import UserScroll from '@/components/molecules/userScroll'
import Advertisement_banner from '@/components/molecules/advertisement_banner'
import Book_slider from '@/components/molecules/book_slider'
import React from 'react'
import BestReccomend from '@/components/molecules/BestReccomend'
import Slider from '@/components/molecules/Slider'
import Footer from '@/components/organisms/footer'

const Page = () => {
  return (
    <div>
      <BestReccomend/>
      <UserScroll/>
      <Slider/>
      <Recomends/>
      <Advertisement_banner/>
      <News/>
      <Book_slider type={'getBestBooksOfMonth'}/>
      <Book_slider type={'getUpcomingBooks'}/>
      <Book_slider type={'getRecommendedBooks'}/>
      <Footer/>
    </div>
  )
}

export default Page