"use client"

import React from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { useCarousel } from '@/hooks/useCarousel';



console.log("Motion Component:", motion);

const Landing = () => {

  const currentImage = useCarousel({ totalImages: 3 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{opacity: 1}}
      transition={{ duration: 0.5}}
      className="landing"
    >landing

    <motion.div
      initial={{ y:20, opacity: 0 }}
      animate={{y:0, opacity: 1}}
      transition={{ duration: 0.5}}
      className="landing__hero"
    >
      <div className="landing__hero-content">

        <h1 className="landing__title">Courses</h1>

        <p className="landing__description">
          This is the list of the courses you can enroll in.
          <br />
          Courses when you need them and want them.
        </p>

        <div className="landing__cta">
          <Link href="/search">
            <div className="landing__cta-button">Search for Courses</div>
          </Link>
        </div>

      </div>

      <div className="landing__hero-images">
        {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"].map((src, index)=>(
          <Image
             key={src}
             src={src}
             alt={'Hero Banner ${index + 1}'}
             fill
             priority={index === currentImage} 
             sizes="(max-width:768px) 100vm, (max-width: 1200px) 50vw, 33vw"
             className={`landing__hero-image ${
              index === currentImage ? "landing__hero-image--active" : ""
             }`}
            />
        ))}

      </div>
    </motion.div>
        <motion.div
        initial={{ y:20, opacity: 0 }}
        whileInView={{y:0, opacity: 1}}
        transition={{ duration: 0.5}}
        viewport={{amount: 0.3, once: true}} //when it's get animated, and it does only once
        className="landing__featured">
          
        </motion.div>
    </motion.div>
  )
};

export default Landing;