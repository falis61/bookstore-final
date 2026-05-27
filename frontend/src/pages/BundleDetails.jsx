import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import BookCard from "../components/BookCard/BookCard";
import Loader from "../components/Loader/Loader";
import { FaArrowLeft, FaBoxOpen, FaShoppingCart, FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authActions } from "../Store/auth";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const BundleDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFavouriteBundle, setIsFavouriteBundle] = useState(false);

  const headers = {
    id: getStoredItem("id"),
    authorization: `Bearer ${getStoredItem("token")}`,
  };

  const toastStyle = {
    style: {
      background: "#3B2218",
      color: "#F5F1E6",
      border: "1px solid #C5A059",
    },
  };

  const errorToastStyle = {
    style: {
      background: "#3B2218",
      color: "#F5F1E6",
      border: "1px solid #C95A5A",
    },
  };

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const res = await axios.get(
          `https://bookstore-backend-x6dx.onrender.com/api/v1/get-bundle/${id}`
        );

        setBundle(res.data.data);
      } catch (error) {
        console.log("Bundle fetch error:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [id]);

  useEffect(() => {
    const checkFavouriteBundle = async () => {
      try {
        if (!headers.id || !getStoredItem("token")) {
          return;
        }

        const response = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-favourite-bundles",
          { headers }
        );

        const favBundles = response.data.data || [];

        const exists = favBundles.some((item) => item._id === id);

        setIsFavouriteBundle(exists);
      } catch (error) {
        console.log("Check favourite bundle error:", error);
      }
    };

    checkFavouriteBundle();
  }, [id]);

  const updateNavbarCartCount = async () => {
    try {
      const cartRes = await axios.get(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/get-user-cart",
        { headers }
      );

      const updatedCart = cartRes.data.data || [];

      const count = updatedCart.reduce(
        (sum, item) => sum + Number(item.quantity || 1),
        0
      );

      dispatch(authActions.setCartCount(count));
    } catch (error) {
      console.log("Cart count update error:", error);
    }
  };

  const addBundleToCart = async () => {
    try {
      if (!headers.id || !getStoredItem("token")) {
        toast("Please login to add bundle to cart", toastStyle);
        return;
      }

      if (!bundle || !bundle._id) {
        toast("Bundle not found", errorToastStyle);
        return;
      }

      if (!bundle.books || bundle.books.length === 0) {
        toast("This bundle has no books yet", errorToastStyle);
        return;
      }

      const response = await axios.put(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/add-bundle-to-cart",
        {},
        {
          headers: {
            ...headers,
            bundleid: bundle._id,
          },
        }
      );

      toast.success(response.data.message, toastStyle);
      updateNavbarCartCount();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add bundle to cart",
        errorToastStyle
      );
    }
  };

  const toggleBundleFavourite = async () => {
    try {
      if (!headers.id || !getStoredItem("token")) {
        toast("Please login to manage favourites", toastStyle);
        return;
      }

      if (!bundle || !bundle._id) {
        toast("Bundle not found", errorToastStyle);
        return;
      }

      const endpoint = isFavouriteBundle
        ? "remove-bundle-from-favourite"
        : "add-bundle-to-favourite";

      const response = await axios.put(
        `https://bookstore-backend-x6dx.onrender.com/api/v1/${endpoint}`,
        {},
        {
          headers: {
            ...headers,
            bundleid: bundle._id,
          },
        }
      );

      toast.success(response.data.message, toastStyle);

      if (isFavouriteBundle) {
        setIsFavouriteBundle(false);
        dispatch(authActions.removeFavouriteBundle(bundle._id));
      } else {
        setIsFavouriteBundle(true);
        dispatch(authActions.addFavouriteBundle(bundle._id));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update favourites",
        errorToastStyle
      );
    }
  };

  // ✅ FIXED: prevent crash
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (notFound || !bundle) {
    return (
      <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center">
        <p className="text-[#3B2218] text-2xl">Bundle not found.</p>
      </div>
    );
  }

  const books = bundle.books || [];

  const oldPrice = books.reduce(
    (sum, book) => sum + Number(book.price || 0),
    0
  );

  const discountPercent = Number(bundle.discountPercent || 0);

  const newPrice = oldPrice - (oldPrice * discountPercent) / 100;

  return (
    <div className="bg-[#F5F1E6] min-h-screen px-4 md:px-10 py-10">
      <div className="max-w-[1400px] mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#5A3827] font-semibold mb-8 hover:text-[#C5A059] transition"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        <div className="bg-[#FBF7EF] border border-[#E5D7C2] rounded-[24px] overflow-hidden shadow-sm">
          <img
            src={bundle.image}
            alt={bundle.title}
            className="w-full h-[300px] md:h-[430px] object-cover"
          />

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold bg-[#F4E5CB] text-[#8B5E3C] px-4 py-2 rounded-full">
                <FaBoxOpen />
                {books.length} Books Included
              </span>

              <span className="bg-[#E7F3E8] text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
                Save {discountPercent}%
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B2218] mb-4">
              {bundle.title}
            </h1>

            <p className="text-[#6B5748] text-lg leading-8 max-w-4xl">
              {bundle.description}
            </p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-6">
              <div className="flex items-end gap-4">
                <span className="line-through text-[#8C7766] text-xl">
                  ${oldPrice.toFixed(0)}
                </span>

                <span className="text-4xl font-bold text-[#3B2218]">
                  ${newPrice.toFixed(0)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleBundleFavourite}
                  className={`w-12 h-12 inline-flex items-center justify-center rounded-full hover:bg-[#5a3a2a] transition ${
                    isFavouriteBundle
                      ? "bg-[#C95A5A] text-white"
                      : "bg-[#3B2218] text-[#F5F1E6]"
                  }`}
                >
                  <FaHeart />
                </button>

                <button
                  onClick={addBundleToCart}
                  className="w-12 h-12 inline-flex items-center justify-center bg-[#3B2218] text-[#F5F1E6] rounded-full hover:bg-[#5a3a2a] transition"
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-serif font-bold text-[#3B2218] mb-6">
            Books in this Bundle
          </h2>

          {books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book, index) => (
                <BookCard key={book._id || index} data={book} />
              ))}
            </div>
          ) : (
            <p className="text-[#7A5C3E]">
              No books have been added to this bundle yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BundleDetails;