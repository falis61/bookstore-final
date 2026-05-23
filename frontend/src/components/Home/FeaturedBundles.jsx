import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaBoxOpen,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../Store/auth";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const FeaturedBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [favouriteBundles, setFavouriteBundles] = useState([]);
  const sliderRef = useRef(null);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

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
    fetchBundles();
    fetchFavouriteBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const res = await axios.get("http://localhost:1000/api/v1/get-bundles");

      const preferredOrder = [
        "Romance Bundle",
        "Classic Masterpieces",
        "Poetry Lover’s Set",
        "Stoicism Bundle",
        "Cybersecurity Pack",
        "Growth Essentials",
        "Horror Classics",
        "Mystery Bundle",
        "Fantasy Bundle",
        "AI & Tech Bundle",
        "Leadership Bundle",
        "Skills Bundle",
      ];

      const sortedBundles = (res.data.data || []).sort((a, b) => {
        const indexA = preferredOrder.indexOf(a.title);
        const indexB = preferredOrder.indexOf(b.title);

        return (
          (indexA === -1 ? 999 : indexA) -
          (indexB === -1 ? 999 : indexB)
        );
      });

      setBundles(sortedBundles);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFavouriteBundles = async () => {
    try {
      if (!headers.id || !getStoredItem("token")) return;

      const res = await axios.get(
        "http://localhost:1000/api/v1/get-favourite-bundles",
        { headers }
      );

      setFavouriteBundles((res.data.data || []).map((bundle) => bundle._id));
    } catch (err) {
      console.log(err);
    }
  };

  const updateNavbarCartCount = async () => {
    try {
      const cartRes = await axios.get(
        "http://localhost:1000/api/v1/get-user-cart",
        { headers }
      );

      dispatch(authActions.setCartCount(cartRes.data.data.length));
    } catch (error) {
      console.log("Cart count update error:", error);
    }
  };

  const handleAddToCart = async (e, bundle) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast("Please log in first", toastStyle);
      return;
    }

    if (role !== "user") {
      toast("Only users can add bundles to cart", toastStyle);
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-bundle-to-cart",
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

  const handleFavourite = async (e, bundle) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast("Please log in first", toastStyle);
      return;
    }

    if (role !== "user") {
      toast("Only users can add bundles to favourites", toastStyle);
      return;
    }

    const isFav = favouriteBundles.includes(bundle._id);

    try {
      if (isFav) {
        await axios.put(
          "http://localhost:1000/api/v1/remove-bundle-from-favourite",
          {},
          {
            headers: {
              ...headers,
              bundleid: bundle._id,
            },
          }
        );

        setFavouriteBundles((prev) =>
          prev.filter((id) => id !== bundle._id)
        );
        dispatch(authActions.removeFavouriteBundle(bundle._id));
        toast.success("Removed from favourites", toastStyle);
      } else {
        await axios.put(
          "http://localhost:1000/api/v1/add-bundle-to-favourite",
          {},
          {
            headers: {
              ...headers,
              bundleid: bundle._id,
            },
          }
        );

        setFavouriteBundles((prev) => [...prev, bundle._id]);
        dispatch(authActions.addFavouriteBundle(bundle._id));
        toast.success("Added to favourites", toastStyle);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Favourite action failed",
        errorToastStyle
      );
    }
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -330,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 330,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#F5F1E6] py-12 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative mb-8">
          <div className="text-center">
            <p className="text-[#C5A059] uppercase tracking-[0.25em] text-sm font-semibold mb-2">
              Curated Savings
            </p>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3B2218] mb-3">
              Featured Bundles
            </h2>

            <p className="text-[#6B5748]">
              Handpicked book sets at bundle pricing.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-[#D8C5AA] bg-[#FBF7EF] flex items-center justify-center"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-[#D8C5AA] bg-[#FBF7EF] flex items-center justify-center"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-3 hide-scrollbar"
        >
          {bundles.map((bundle) => {
            const bundlePrice =
              bundle.books?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;

            const discount = bundle.discountPercent || 0;

            const discounted = (
              bundlePrice -
              (bundlePrice * discount) / 100
            ).toFixed(0);

            const savedAmount = Math.round(bundlePrice - discounted);

            const isFav = favouriteBundles.includes(bundle._id);

            return (
              <div
                key={bundle._id}
                className="relative z-10 bg-[#FBF7EF] rounded-[18px] p-4 flex flex-col min-w-[300px] max-w-[300px] flex-shrink-0 border border-[#E6D8BD] shadow-sm hover:shadow-[0_18px_40px_rgba(75,46,31,0.16)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <button
                  onClick={(e) => handleFavourite(e, bundle)}
                  className={`absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 backdrop-blur shadow-md ${
                    isFav ? "text-red-500" : "text-gray-400"
                  } hover:scale-110 transition`}
                >
                  <FaHeart />
                </button>

                <Link
                  to={`/bundle/${bundle._id}`}
                  className="flex flex-col flex-1 relative z-10"
                >
                  <div className="h-[200px] overflow-hidden rounded-[14px] bg-[#EFE2D2]">
                    <img
                      src={bundle.image}
                      alt={bundle.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500"
                    />
                  </div>

                  <div className="mt-4 flex justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold bg-[#F4E5CB] text-[#8B5E3C] px-3 py-1.5 rounded-full">
                      <FaBoxOpen />
                      {bundle.books?.length} Books
                    </span>

                    <span className="bg-[#E7F3E8] text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      Save {discount}%
                    </span>
                  </div>

                  <h3 className="mt-4 text-[#3B2218] text-xl font-serif font-semibold">
                    {bundle.title}
                  </h3>

                  <span className="inline-block mt-2 text-xs bg-[#EFE2D2] px-2 py-1 rounded-full text-[#6B5748] w-fit">
                    Perfect for readers
                  </span>

                  <div className="flex items-end gap-3 mt-4">
                    <span className="line-through text-[#8C7766]">
                      ${bundlePrice}
                    </span>

                    <span className="text-3xl font-bold text-[#3B2218]">
                      ${discounted}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-green-700 font-semibold">
                    Save ${savedAmount}
                  </p>

                  <div className="flex mt-3">
                    {bundle.books?.slice(0, 3).map((book, index) => (
                      <img
                        key={book._id || index}
                        src={book.url}
                        alt={book.title}
                        className="w-8 h-10 object-cover rounded border border-[#E6D8BD] -ml-2 first:ml-0 bg-[#EFE2D2]"
                      />
                    ))}
                  </div>
                </Link>

                <button
                  onClick={(e) => handleAddToCart(e, bundle)}
                  className="mt-4 py-2 rounded-full flex items-center justify-center gap-2 bg-[#C5A059] text-white hover:bg-[#a88445]"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/bundles"
            className="px-6 py-2 rounded-full bg-[#C5A059] text-white font-semibold hover:bg-[#a88445] transition"
          >
            View All Bundles →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBundles;