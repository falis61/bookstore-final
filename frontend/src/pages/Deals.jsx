 import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard/BookCard";
import Loader from "../components/Loader/Loader";

const Deals = () => {
  const [Data, setData] = useState(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/discounted-books"
        );
        setData(res.data.data || []);
      } catch (error) {
        console.log("Deals fetch error:", error);
        setData([]);
      }
    };

    fetchDeals();
  }, []);

  if (Data === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#F5F1E6]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-[#F5F1E6] px-4 md:px-12 py-10 min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3B2218] mb-8">
          Deals & Discounts
        </h1>

        {Data.length === 0 ? (
          <p className="text-[#7A5C3E]">No deals available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Data.map((book) => (
              <BookCard
                key={book._id}
                data={book}
                showDiscountBadge={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Deals;