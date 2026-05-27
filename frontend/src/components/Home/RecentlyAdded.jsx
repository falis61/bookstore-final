import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const RecentlyAdded = () => {
  const [Data, setData] = useState();
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/get-all-books"
      );
      setData(response.data.data);
    };
    fetch();
  }, []);

  const recentBooks = useMemo(() => {
    if (!Data) return [];

    return [...Data].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [Data]);

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

  return (
    <section className="px-4 md:px-8 bg-[#F5F1E6] py-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[#CBA756] uppercase tracking-[0.2em] text-sm font-semibold mb-2">
              Fresh Arrivals
            </p>

            <h2 className="text-3xl md:text-4xl text-[#3B2218] font-serif font-bold">
              Recently Added Books
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
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-3 hide-scrollbar"
          >
            {recentBooks.map((items, i) => (
              <div
                key={i}
                className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] max-w-[300px] flex-shrink-0"
              >
                <BookCard data={items} showNewBadge={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyAdded;