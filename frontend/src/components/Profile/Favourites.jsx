import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/auth";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const Favourites = () => {
  const [FavouriteBooks, setFavourireBooks] = useState();
  const [FavouriteBundles, setFavouriteBundles] = useState([]);
  const dispatch = useDispatch();

  const headers = {
    id: getStoredItem("id"),
    authorization: `Bearer ${getStoredItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-favourite-books",
        { headers }
      );

      setFavourireBooks(response.data.data);

      dispatch(
        authActions.setFavourites(response.data.data.map((book) => book._id))
      );

      const bundleResponse = await axios.get(
        "http://localhost:1000/api/v1/get-favourite-bundles",
        { headers }
      );

      setFavouriteBundles(bundleResponse.data.data || []);

      dispatch(
        authActions.setFavouriteBundles(
          (bundleResponse.data.data || []).map((bundle) => bundle._id)
        )
      );
    };

    fetch();
  }, []);

  const handleRemoveFromUI = (bookId) => {
    setFavourireBooks((prev) => prev.filter((b) => b._id !== bookId));
    dispatch(authActions.removeFavourite(bookId));
  };

  const handleRemoveBundleFromUI = async (e, bundleId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await axios.put(
        "http://localhost:1000/api/v1/remove-bundle-from-favourite",
        {},
        {
          headers: {
            ...headers,
            bundleid: bundleId,
          },
        }
      );

      setFavouriteBundles((prev) =>
        prev.filter((bundle) => bundle._id !== bundleId)
      );

      dispatch(authActions.removeFavouriteBundle(bundleId));
      toast.success("Bundle removed from favourites");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove bundle"
      );
    }
  };

  return (
    <section className="bg-[#F5F1E6] min-h-full px-4 md:px-6 py-6 rounded-[18px]">
      <div className="mb-6">
        <p className="text-[#CBA756] uppercase tracking-[0.2em] text-sm font-semibold mb-2">
          Saved Reads
        </p>

        <h2 className="text-3xl md:text-4xl text-[#3B2218] font-serif font-bold">
          Favourite Books
        </h2>
      </div>

      {FavouriteBooks &&
        FavouriteBooks.length === 0 &&
        FavouriteBundles.length === 0 && (
          <div className="bg-[#F5F1E6] rounded-[18px] min-h-[55vh] flex items-center justify-center flex-col text-center px-4">
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#3B2218]"></h3>

            <p className="text-[#6B5748] mt-4 text-lg">
              Books you love will appear here.
            </p>

            <img src="/star.png" alt="star" className="h-[18vh] my-10 mb-3" />
          </div>
        )}

      {FavouriteBundles && FavouriteBundles.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-serif font-bold text-[#3B2218] mb-5">
            Favourite Bundles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {FavouriteBundles.map((bundle) => (
              <Link
                to={`/bundle/${bundle._id}`}
                key={bundle._id}
                className="relative bg-[#FBF7EF] border border-[#E6D8BD] rounded-[18px] overflow-hidden shadow-sm hover:shadow-[0_18px_40px_rgba(75,46,31,0.16)] hover:-translate-y-1 transition-all duration-300"
              >
                <button
                  onClick={(e) => handleRemoveBundleFromUI(e, bundle._id)}
                  className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white text-[#C95A5A] shadow flex items-center justify-center hover:bg-[#C95A5A] hover:text-white transition"
                >
                  <FaHeart />
                </button>

                <img
                  src={bundle.image}
                  alt={bundle.title}
                  className="w-full h-[220px] object-cover"
                />

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4E4C8] text-[#7A5C3E] text-xs font-semibold">
                      <FaBoxOpen />
                      {bundle.books?.length || 0} Books
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
        </div>
      )}

      {FavouriteBooks && FavouriteBooks.length > 0 && (
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#3B2218] mb-5">
            Favourite Books
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {FavouriteBooks.map((items, i) => (
              <div key={i} className="h-full">
                <BookCard
                  data={items}
                  favourite={true}
                  onRemove={handleRemoveFromUI}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Favourites;