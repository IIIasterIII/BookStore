"use client"
import React, { useState } from 'react';

const exampleSlides = [
  {
    title: 'Northfard',
    description: 'Something about Northfard...',
    blocks: [1, 2, 3, 4],
  },
  {
    title: 'Eastwind',
    description: 'Something about Eastwind...',
    blocks: [5, 6, 7, 8],
  },
  {
    title: 'Southvale',
    description: 'Something about Southvale...',
    blocks: [9, 10, 11, 12],
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? exampleSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === exampleSlides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = exampleSlides[currentIndex];

  return (
    <div className="w-full h-100 rounded-xl flex flex-row items-center">
      <button onClick={prevSlide} className="ml-5 border w-12 h-12 flex justify-center items-center rounded-2xl text-xl">
        {'<'}
      </button>

      <div className="w-full m-5 h-full flex flex-row">
        <div className="border w-full h-full"></div>

        <div className="border ml-5 w-150 h-full flex flex-col p-5">
          <h1 className="font-bold text-3xl">{currentSlide.title}</h1>

          <div className="h-50 mt-10 grid grid-cols-2 place-items-center gap-5">
            {currentSlide.blocks.map((block, i) => (
              <div key={i} className="w-40 h-25 bg-gray-300 flex items-center justify-center">
                {block}
              </div>
            ))}
          </div>

          <p className="mt-7">{currentSlide.description}</p>
        </div>
      </div>

      <button onClick={nextSlide} className="mr-5 border w-12 h-12 flex justify-center items-center rounded-2xl text-xl">
        {'>'}
      </button>
    </div>
  );
};

export default Slider;
