import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AboutPreview = () => {
  return (
    <section className="bg-[#F5F1E6] px-6 md:px-10 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#FBF7EF] border border-[#D9C8AA] rounded-[28px] p-8 md:p-12 shadow-[0_10px_30px_rgba(75,46,31,0.08)]"
        >

          {/* TEXT LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C5A059] uppercase tracking-[0.3em] text-sm font-semibold mb-3">
              About Us
            </p>

            <h2 className="text-[#4A3428] text-4xl md:text-5xl font-serif leading-[1.12] mb-6">
              A thoughtful space made for readers.
            </h2>

            <p className="text-[#7A6758] text-base md:text-lg leading-8 mb-5 max-w-xl">
              BookNest is a place for people who love stories, learning, and the
              comfort that books bring. We created it to feel warm, elegant, and
              personal.
            </p>

            <p className="text-[#7A6758] text-base md:text-lg leading-8 mb-8 max-w-xl">
              From romance and thrillers to educational and technology books, we
              bring together collections that make every visit feel inspiring and
              meaningful.
            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-2 rounded-full bg-[#F5E6D3] text-[#5A4335] text-sm uppercase tracking-wider border border-[#E6D4B7]">
                Warm
              </span>
              <span className="px-4 py-2 rounded-full bg-[#F5E6D3] text-[#5A4335] text-sm uppercase tracking-wider border border-[#E6D4B7]">
                Curated
              </span>
              <span className="px-4 py-2 rounded-full bg-[#F5E6D3] text-[#5A4335] text-sm uppercase tracking-wider border border-[#E6D4B7]">
                Timeless
              </span>
            </div>

            <Link
              to="/about"
              className="inline-block px-7 py-3 bg-[#C5A059] text-[#1A1110] font-semibold uppercase tracking-wide rounded-full hover:bg-[#E6C89A] hover:scale-105 transition-all duration-300 shadow-md"
            >
              Learn More
            </Link>
          </motion.div>

          {/* IMAGE RIGHT */}
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2 }}
            className="pl-0 lg:pl-6 md:pl-10"
          >
            <div className="overflow-hidden rounded-[24px] bg-[#F5F1E6] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <img
                src="/about3.jpg"
                alt="About BookNest"
                className="w-full h-[500px] object-cover object-top transition duration-700 hover:scale-105"
              />
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default AboutPreview;