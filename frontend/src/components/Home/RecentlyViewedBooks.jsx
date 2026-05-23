import React, { useEffect, useRef, useState } from "react";
import BookCard from "../BookCard/BookCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const RecentlyViewedBooks = () => {
  const [recentBooks, setRecentBooks] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    const userId = getStoredItem("id");
    const role = getStoredItem("role");

    if (!userId || role !== "user") {
      setRecentBooks([]);
      return;
    }

    const storageKey = `recentlyViewedBooks_${userId}`;
    const viewed = JSON.parse(localStorage.getItem(storageKey)) || [];

    setRecentBooks(viewed);
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
  const clearHistory = () => {
  const userId = getStoredItem("id");
  const storageKey = `recentlyViewedBooks_${userId}`;

  localStorage.removeItem(storageKey);
  setRecentBooks([]);
};


  if (!recentBooks || recentBooks.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-8 bg-[#F5F1E6] py-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[#C5A059] uppercase tracking-[0.25em] text-sm font-semibold mb-2">
              Continue Exploring
            </p>

            <h2 className="text-[#3B2218] text-3xl md:text-4xl font-serif font-bold">
              Recently Viewed
            </h2>

            <p className="text-[#6B5748] mt-2">
              Books you've explored recently.
            </p>
          </div>

          <div className="flex items-center gap-3">

 <button
    onClick={clearHistory}
    className="px-4 py-2 rounded-full border border-[#D8C5AA] bg-[#FBF7EF] text-[#3B2218] text-sm font-medium hover:bg-[#EFE2D2] transition"
  >
    Clear History
  </button>

  <button onClick={scrollLeft}>
    <FaChevronLeft />
  </button>

  <button onClick={scrollRight}>
    <FaChevronRight />
  </button>

</div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-3 hide-scrollbar"
        >
          {recentBooks.map((book, index) => (
            <div
              key={index}
              className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] max-w-[300px] flex-shrink-0"
            >
              <BookCard data={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedBooks;