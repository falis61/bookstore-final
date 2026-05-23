import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const slides = [
    {
      image: "/book-bg.jpeg",
      title: "BookNest",
      subtitle: "Your Sanctuary for Words",
    },
    {
      image: "/back4.jpg",
      title: "Where Stories Feel Alive",
      subtitle: "Step into warmth, comfort, and discovery",
    },
    {
      image: "/back2.jpg",
      title: "Books Chosen With Care",
      subtitle: "Find stories that stay with you",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-[#1A1110]">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <motion.img
          key={slide.image}
          src={slide.image}
          alt="Library Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          initial={false}
          animate={{
            opacity: index === currentSlide ? 1 : 0,
            scale: index === currentSlide ? 1 : 1.04,
          }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: 5, ease: "easeOut" },
          }}
        />
      ))}

      {/* Main Overlay */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(26,17,16,0.16)_0%,rgba(26,17,16,0.76)_80%,rgba(26,17,16,0.9)_100%)]"></div>

      {/* Bottom Cinematic Fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-10 bg-gradient-to-t from-[#1A1110]/70 to-transparent"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1
              className={`font-serif leading-[1.08] tracking-[0.04em] text-[#E8D8B5] uppercase drop-shadow-lg max-w-5xl ${
                currentSlide === 0
                  ? "text-6xl md:text-8xl"
                  : "text-5xl md:text-7xl"
              }`}
            >
              {slides[currentSlide].title}
            </h1>

            <p className="mt-5 font-serif text-lg md:text-xl italic text-[#E6D3A3] tracking-[0.12em] uppercase max-w-3xl">
              {slides[currentSlide].subtitle}
            </p>

            <Link
              to="/all-books"
              className="mt-8 inline-block px-8 py-3 bg-[#E8D8B5] text-[#1A1110] font-semibold tracking-wide uppercase rounded
              transition-all duration-300 shadow-md transform translate-y-1
              hover:bg-[#F0E2C2] hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
            >
              Discover More
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Hero;