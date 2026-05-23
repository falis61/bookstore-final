import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaShieldAlt,
  FaLeaf,
  FaFeatherAlt,
  FaLandmark,
  FaTruck,
  FaAward,
  FaHeadset,
  FaBookOpen,
} from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { motion } from "framer-motion";

const collections = [

   {
    title: "Poetry Favorites",
    desc: "Collections that inspire reflection and feeling.",
    image: "/featcol3.png",
    link: "/category/poetry",
    icon: <FaFeatherAlt />,
  },
  {
    title: "Personal Growth Picks",
    desc: "Books for wisdom, discipline, and purpose.",
    image: "/featcol2.png",
    link: "/category/philosophy",
    icon: <FaLeaf />,
  },
   {
    title: "Cybersecurity Essentials",
    desc: "Protect, explore, and master the digital world.",
    image: "/featcol1.png",
    link: "/category/cybersecurity",
    icon: <FaShieldAlt />,
  },

  {
    title: "Timeless Classics",
    desc: "Stories and ideas that shaped generations.",
    image: "/featcol4.png",
    link: "/category/classic",
    icon: <FaLandmark />,
  },
];

const features = [
  {
    title: "Free Delivery",
    desc: "On orders over $50",
    icon: <FaTruck />,
  },
  {
    title: "100% Authentic",
    desc: "Original books guaranteed",
    icon: <FaAward />,
  },
  {
    title: "Easy Returns",
    desc: "7 day return policy",
    icon: <MdSupportAgent />,
  },
  {
    title: "Customer Support",
    desc: "We are here to help",
    icon: <FaHeadset />,
  },
];

const FeaturedCollections = () => {
  return (
    <section className="bg-[#F5F1E6] px-4 md:px-8 py-10">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 text-[#8B5E3C] mb-2">
            <span className="text-[#CBA756] text-xl">⌁</span>
            <span className="w-10 h-px bg-[#CBA756]" />
            <FaBookOpen className="text-[#8B5E3C] text-xl" />
            <span className="w-10 h-px bg-[#CBA756]" />
            <span className="text-[#CBA756] text-xl">⌁</span>
          </div>

          <h2 className="text-[#3B2218] text-3xl md:text-4xl font-serif font-bold">
            Featured Collections
          </h2>

          <p className="text-[#5C4638] text-sm mt-2">
            Curated shelves handpicked for every kind of reader.
          </p>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-16 h-px bg-[#D8B982]" />
            <span className="text-[#CBA756] text-xs">◆</span>
            <span className="w-16 h-px bg-[#D8B982]" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <Link
                to={item.link}
                className="group block h-full bg-[#FBF7EF] border border-[#E8D8C3] rounded-[12px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <div className="h-[220px] overflow-hidden bg-[#EFE2D2]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition duration-500"
                  />
                </div>

                <div className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#F5EBDD] border border-[#D6C3A3] text-[#8B5E3C] flex items-center justify-center text-base">
                    {item.icon}
                  </div>

                  <h3 className="text-[#3B2218] text-lg font-serif font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-[#5C4638] text-sm mt-2 leading-6 min-h-[60px]">
                    {item.desc}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 bg-[#CBA756] text-white px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-[#B89445] transition">
                    Explore Collection
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 bg-[#FBF7EF] border border-[#E8D8C3] rounded-[14px] px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center justify-center gap-4 text-center lg:text-left ${
                index !== features.length - 1
                  ? "lg:border-r lg:border-[#D8C5AA]"
                  : ""
              }`}
            >
              <div className="text-[#8B5E3C] text-2xl">{item.icon}</div>

              <div>
                <h4 className="text-[#3B2218] font-serif font-semibold text-base">
                  {item.title}
                </h4>
                <p className="text-[#5C4638] text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;