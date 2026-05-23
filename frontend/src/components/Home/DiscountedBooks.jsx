import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const DiscountedBooks = () => {
  const [Data, setData] = useState();
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchDiscountedBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/discounted-books"
        );

        setData(response.data.data || []);
      } catch (error) {
        console.log("Discounted books error:", error);
        setData([]);
      }
    };

    fetchDiscountedBooks();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -330,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 330,
        behavior: "smooth",
      });
    }
  };

  if (Data && Data.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-8 bg-[#F5F1E6] py-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[#CBA756] uppercase tracking-[0.2em] text-sm font-semibold mb-2">
              Special Offers
            </p>

            <h2 className="text-3xl md:text-4xl text-[#3B2218] font-serif font-bold">
              Deals & Discounts
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-[#D8C5AA] bg-[#FBF7EF] text-[#3B2218] flex items-center justify-center hover:bg-[#EFE2D2] transition"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-[#D8C5AA] bg-[#FBF7EF] text-[#3B2218] flex items-center justify-center hover:bg-[#EFE2D2] transition"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {!Data && (
          <div className="flex items-center justify-center my-8">
            <Loader />
          </div>
        )}

        {Data && (
          <>
            {/* 🔹 Slider */}
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-3 hide-scrollbar"
            >
              {Data.map((book, i) => (
                <div
                  key={book._id || i}
                  className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] max-w-[300px] flex-shrink-0 relative"
                >
                  <BookCard data={book} showDiscountBadge={true} />
                </div>
              ))}
            </div>

            {/* 🔥 BUTTON UNDER CARDS */}
            <div className="flex justify-center mt-8">
              <Link
                to="/deals"
                className="px-6 py-2 rounded-full bg-[#C5A059] text-white font-semibold hover:bg-[#2a1811] transition"
              >
                View All Deals →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DiscountedBooks;