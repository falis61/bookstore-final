import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { Link } from "react-router-dom";

const Bundles = () => {
  const [bundles, setBundles] = useState(null);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const response = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-bundles"
        );

        setBundles(response.data.data || []);
      } catch (error) {
        console.log("Bundles fetch error:", error);
        setBundles([]);
      }
    };

    fetchBundles();
  }, []);

  if (bundles === null) {
    return (
      <div className="min-h-[60vh] bg-[#F5F1E6] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-[#F5F1E6] px-4 md:px-12 py-10 min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 text-center">
          <p className="text-[#CBA756] uppercase tracking-[0.2em] text-sm font-semibold mb-2">
            Curated Savings
          </p>

          <h1 className="text-3xl md:text-4xl text-[#3B2218] font-serif font-bold">
            Featured Bundles
          </h1>

          <p className="text-[#7A5C3E] mt-3">
            Handpicked book sets at bundle pricing.
          </p>
        </div>

        {bundles.length === 0 ? (
          <p className="text-center text-[#7A5C3E]">
            No bundles available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {bundles.map((bundle) => (
              <Link
                to={`/bundle/${bundle._id}`}
                key={bundle._id}
                className="bg-[#FBF7EF] border border-[#E6D8BD] rounded-[18px] overflow-hidden shadow-sm hover:shadow-[0_18px_40px_rgba(75,46,31,0.16)] hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={bundle.image}
                  alt={bundle.title}
                  className="w-full h-[260px] object-cover"
                />

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#F4E4C8] text-[#7A5C3E] text-xs font-semibold">
                      📦 {bundle.books?.length || 0} Books
                    </span>

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      Save {bundle.discountPercent}%
                    </span>
                  </div>

                  <h2 className="font-serif text-[#3B2218] text-xl font-bold">
                    {bundle.title}
                  </h2>

                  <p className="text-[#7A614D] text-sm mt-3 line-clamp-2">
                    {bundle.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bundles;