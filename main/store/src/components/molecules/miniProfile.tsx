import React from 'react'
import {motion} from 'motion/react'
import Image from 'next/image';

const MiniProfile = () => {
  return (
      <div className='w-80 h-80 rounded-4xl flex items-center justify-center relative'>
        <div className='relative z-20 text-blue-50 p-3 rounded-3xl border-2 border-teal-300' style={{ backgroundColor: 'rgba(1, 1, 18, 0.5)' }}>
            <Image width={75} height={75} alt='avatar' src={'/avatar.jpg'} className='rounded-3xl border-2 border-blue-50 w-25 h-25'/>
            <h1 className='flex flex-row items-center justify-center'>🤫​ Aster</h1>
            <h1 className='flex flex-row items-center border-t justify-center'>Developer</h1>
        </div>

        <motion.svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg" style={{ rotate: '-90deg', position: 'absolute' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
            duration: 3,
            repeat: Infinity, 
            repeatType: 'loop',
            ease: 'linear',
        }}
        >
            <circle r="115" cx="125" cy="125" fill="transparent" strokeWidth="8"></circle>
            <circle
              r="115"
              cx="125"
              cy="125"
              stroke="#0d9488"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="420.48" 
              strokeDashoffset="235.62" 
              fill="transparent"
            ></circle>
          </motion.svg>



          <motion.svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg" style={{ rotate: '-90deg', position: 'absolute' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
            duration: 3,
            repeat: Infinity, 
            repeatType: 'loop',
            ease: 'linear',
        }}
        >
            <circle r="115" cx="125" cy="125" fill="transparent" strokeWidth="8"></circle>
            <circle
              r="115"
              cx="125"
              cy="125"
              stroke="#0d9488"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="300" 
              strokeDashoffset="205.62" 
              fill="transparent"
            ></circle>
          </motion.svg>



          <motion.svg 
            width="300" 
            height="300" 
            viewBox="0 0 300 300" 
            xmlns="http://www.w3.org/2000/svg" 
            style={{ rotate: '-90deg', position: 'absolute' }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
                duration: 3,
                repeat: Infinity, 
                repeatType: 'loop',
                ease: 'linear',
            }}
            >
            <circle r="140" cx="150" cy="150" fill="transparent" strokeWidth="8"></circle>
            <circle
                r="140"
                cx="150"
                cy="150"
                stroke="#0d9488"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="879.6"
                strokeDashoffset="194.2"
                fill="transparent"
            ></circle>
           </motion.svg>

           <motion.svg 
                width="200" 
                height="200" 
                viewBox="0 0 200 200" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{ rotate: '-90deg', position: 'absolute' }}
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 3,
                    repeat: Infinity, 
                    repeatType: 'loop',
                    ease: 'linear',
                }}
                >
                <circle r="100" cx="110" cy="110" fill="transparent" strokeWidth="8"></circle>
                <circle
                    r="80" 
                    cx="100" 
                    cy="100"
                    stroke="#0d9488"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 80} 
                    strokeDashoffset={2 * Math.PI * 0 - 150}
                    fill="transparent"
                ></circle>
                </motion.svg>

                <motion.svg 
                    width="200" 
                    height="200" 
                    viewBox="0 0 200 200" 
                    xmlns="http://www.w3.org/2000/svg" 
                    style={{ rotate: '-90deg', position: 'absolute' }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity, 
                        repeatType: 'loop',
                        ease: 'linear',
                    }}
                    >
                    <circle r="100" cx="110" cy="110" fill="transparent" strokeWidth="8"></circle>
                    <circle
                        r="170" 
                        cx="170" 
                        cy="170"
                        stroke="#0d9488"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 170}
                        strokeDashoffset={2 * Math.PI * 170 - 150} 
                        fill="transparent"
                    ></circle>
                    </motion.svg>

      </div>
  )
}

export default MiniProfile