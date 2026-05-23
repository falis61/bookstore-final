import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

const AboutUs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 6;
      const y = (e.clientY / innerHeight - 0.5) * 6;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToStory = () => {
    const el = document.getElementById("story");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-[#F5F1E6] overflow-hidden">
      {/* SCROLL PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[4px] bg-[#C5A059] origin-left z-[9999]"
        style={{ scaleX }}
      />

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src="/about-bg.jpg"
          alt="bg"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-[#F5F1E6]/90"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20">
        {/* HERO */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-20 items-center mb-28">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-[#C5A059] uppercase tracking-[0.3em] text-xs mb-4">
              About BookNest
            </p>

            <h1 className="text-[#4A3428] text-4xl md:text-6xl font-serif leading-[1.1] mb-6">
              This is your space to discover stories that stay with you.
            </h1>

            <p className="text-[#7A6758] text-lg leading-8 mb-8 max-w-md">
              BookNest is more than a bookstore. It is a calm and elegant space
              where reading feels meaningful and personal.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                to="/all-books"
                className="inline-flex items-center gap-2 bg-[#3B2218] text-[#F8F2E8] px-7 py-4 rounded-full text-sm uppercase tracking-[0.18em] hover:bg-[#2A170F] hover:scale-105 transition duration-300"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={scrollToStory}
                className="inline-flex items-center gap-2 border border-[#CDBB9A] text-[#5A4335] px-7 py-4 rounded-full text-sm uppercase tracking-[0.18em] hover:bg-[#FBF7EF] hover:scale-105 transition duration-300"
              >
                Our Story
              </button>
            </div>
          </motion.div>

          {/* HERO IMAGE */}
          <motion.div
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative rounded-[30px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
            style={{
              transform: `translate(${mousePosition.x * 0.12}px, ${
                mousePosition.y * 0.12
              }px)`,
            }}
          >
            <img
              src="/about1.jpg"
              alt="BookNest"
              className="w-full h-[500px] object-cover transition duration-700 hover:scale-105"
            />

            <motion.div
              className="absolute bottom-6 left-6 bg-[#F8F2E8]/80 backdrop-blur-md px-5 py-3 rounded-xl shadow-md"
              style={{
                transform: `translate(${mousePosition.x * -0.08}px, ${
                  mousePosition.y * -0.08
                }px)`,
              }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B5748]">
                BookNest Space
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* EDITORIAL BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="grid md:grid-cols-3 gap-8 mb-28 items-center"
        >
          <div className="rounded-[30px] overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.12)]">
            <img
              src="/about2.jpg"
              alt="Editorial"
              className="w-full h-[420px] object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <div className="md:col-span-2">
            <h2 className="text-[#5A4335] text-3xl md:text-5xl font-serif leading-[1.15] mb-6">
              A bookstore designed around feeling, not just function.
            </h2>

            <p className="text-[#7A6758] text-lg leading-8 max-w-2xl">
              Every detail is made to feel calm, intentional, and inspiring.
              BookNest is designed to offer more than books — it offers a quiet
              atmosphere, thoughtful presentation, and a meaningful reading
              experience.
            </p>
          </div>
        </motion.div>

        {/* STORY */}
        <motion.div
          id="story"
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
          className="text-center max-w-3xl mx-auto mb-28"
        >
          <h2 className="text-[#4A3428] text-3xl md:text-5xl font-serif leading-[1.15] mb-6">
            Built for quiet discovery.
          </h2>

          <p className="text-[#7A6758] text-lg leading-8">
            BookNest was created to make reading feel slow, personal, and
            meaningful. Every visit is meant to feel calm, beautiful, and worth
            remembering.
          </p>
        </motion.div>

        {/* VALUES */}
        <div className="grid md:grid-cols-3 gap-10 mb-28 text-center">
          {["Curated", "Calm", "Meaningful"].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="px-4"
            >
              <h3 className="text-[#5A4335] font-serif text-2xl mb-4">
                {item}
              </h3>
              <p className="text-[#7A6758] leading-7">
                Designed with intention and care to make every book feel worth
                discovering.
              </p>
            </motion.div>
          ))}
        </div>

        {/* IMAGE SECTION */}
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2 }}
          className="rounded-[30px] overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.12)] mb-28"
        >
          <img
            src="/about3.jpg"
            alt="BookNest interior"
            className="w-full h-[420px] object-cover transition duration-700 hover:scale-105"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 className="text-[#4A3428] text-3xl md:text-5xl font-serif leading-[1.15] mb-6">
            Find your next story.
          </h2>

          <p className="text-[#7A6758] text-lg mb-8 max-w-xl mx-auto">
            Explore books that feel thoughtful, beautiful, and worth your time.
          </p>

          <Link
            to="/all-books"
            className="inline-flex items-center gap-2 bg-[#3B2218] text-[#F8F2E8] px-8 py-4 rounded-full uppercase text-sm tracking-[0.18em] hover:bg-[#2A170F] hover:scale-105 transition duration-300"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;