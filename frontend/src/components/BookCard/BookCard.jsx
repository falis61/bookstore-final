import React, { useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaStar, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../Store/auth";
import toast from "react-hot-toast";

const BookCard = ({ data, onRemove, showNewBadge = false, showDiscountBadge = false }) => {
  const dispatch = useDispatch();
  const imageRef = useRef(null);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const favourites = useSelector((state) => state.auth.favourites);

  const bookData = data?.book || data;
  const bookId = bookData?._id;
  const isOutOfStock = bookData?.stock <= 0;

  const isFav = favourites.includes(bookId);

  const hasDiscount =
    Number(bookData?.originalPrice) > 0 &&
    Number(bookData?.originalPrice) > Number(bookData?.price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((bookData.originalPrice - bookData.price) /
          bookData.originalPrice) *
          100
      )
    : 0;

  const isNew = (() => {
    if (!showNewBadge || !bookData?.createdAt) return false;

    const created = new Date(bookData.createdAt);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);

    return diffDays <= 2;
  })();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: bookId,
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

  const handleImageMouseMove = (e) => {
    if (!imageRef.current || isOutOfStock) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const moveX = (x / rect.width - 0.5) * 7;
    const rotateY = (x / rect.width - 0.5) * 8;

    imageRef.current.style.transform = `perspective(1000px) translateX(${moveX}px) rotateY(${rotateY}deg) scale(1.04)`;
  };

  const handleImageMouseLeave = () => {
    if (!imageRef.current) return;

    imageRef.current.style.transform =
      "perspective(1000px) translateX(0px) rotateY(0deg) scale(1)";
  };

  const handleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast("Please log in first", toastStyle);
      return;
    }

    if (role !== "user") {
      toast("Only users can add books to favourites", toastStyle);
      return;
    }

    if (!bookId) {
      toast.error("Book ID not found", errorToastStyle);
      return;
    }

    try {
      if (isFav) {
        await axios.put(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/remove-book-from-favourite",
          {},
          { headers }
        );

        dispatch(authActions.removeFavourite(bookId));
        toast.success("Removed from favourites", toastStyle);

        if (onRemove) onRemove(bookId);
      } else {
        await axios.put(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/add-book-to-favourite",
          {},
          { headers }
        );

        dispatch(authActions.addFavourite(bookId));
        toast.success("Added to favourites", toastStyle);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Favourite action failed",
        errorToastStyle
      );
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast("Please log in first", toastStyle);
      return;
    }

    if (role !== "user") {
      toast("Only users can add books to cart", toastStyle);
      return;
    }

    if (bookData?.stock <= 0) {
      toast.error("This book is out of stock", errorToastStyle);
      return;
    }

    if (!bookId) {
      toast.error("Book ID not found", errorToastStyle);
      return;
    }

    try {
      const response = await axios.put(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/add-book-to-cart",
        {},
        { headers }
      );

      dispatch(authActions.incrementCartCount());
      toast.success(response.data.message, toastStyle);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add book to cart",
        errorToastStyle
      );
    }
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating || 0);

    return [1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        className={star <= rounded ? "text-[#C5A059]" : "text-[#D6C4A8]"}
      />
    ));
  };

  const getStockBadge = () => {
    if (bookData?.stock === 0) {
      return (
        <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">
          Out of Stock
        </span>
      );
    }

    if (bookData?.stock <= 5) {
      return (
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
          Low Stock
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        In Stock
      </span>
    );
  };

  const getCartText = () => {
    if (bookData?.stock <= 0) return "Out of Stock";
    if (!isLoggedIn) return "Login to Add";
    return "Add to Cart";
  };

  return (
    <div
      className={`relative z-10 bg-[#FBF7EF] rounded-[18px] p-4 flex flex-col h-full w-full border border-[#E6D8BD] shadow-sm hover:shadow-[0_18px_40px_rgba(75,46,31,0.16)] hover:-translate-y-1 transition-all duration-300 group ${
        isOutOfStock ? "opacity-75 grayscale-[25%]" : ""
      }`}
    >
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
          {showDiscountBadge && hasDiscount && (
  <span
    className={`px-3 py-1 rounded-full text-white text-xs font-semibold shadow ${
      discountPercent >= 30
        ? "bg-red-600 animate-pulse"
        : "bg-[#C5A059]"
    }`}
  >
    {discountPercent >= 30
      ? `🔥 ${discountPercent}%`
      : `${discountPercent}% OFF`}
  </span>
)}

        {isNew && (
          <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold shadow">
            NEW
          </span>
        )}
      </div>

      <button
        onClick={handleFavourite}
        className={`absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 backdrop-blur shadow-md ${
          isFav ? "text-red-500" : "text-gray-400"
        } hover:scale-110 transition`}
      >
        <FaHeart />
      </button>

      <Link
        to={`/view-book-details/${bookId}`}
        className="flex flex-col flex-1 relative z-10"
      >
        <div
          className="relative bg-[#EFE2D2] rounded-[14px] flex items-center justify-center h-[220px] overflow-hidden p-4"
          onMouseMove={handleImageMouseMove}
          onMouseLeave={handleImageMouseLeave}
        >
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 bg-black/25 backdrop-blur-[1px] flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-white/90 text-gray-700 text-sm font-semibold shadow">
                Unavailable
              </span>
            </div>
          )}

          <img
            ref={imageRef}
            src={bookData?.url}
            alt={bookData?.title}
            loading="lazy"
            className={`object-contain h-full w-full ${
              isOutOfStock ? "blur-[1px] opacity-70" : ""
            }`}
          />
        </div>

        <h2 className="mt-4 font-serif text-[#3B2218] text-lg font-semibold">
          {bookData?.title}
        </h2>

        <p className="mt-2 text-[#7A614D] text-sm">by {bookData?.author}</p>

        <div className="mt-2 flex items-center gap-2">
          {renderStars(bookData?.avgRating)}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            {hasDiscount && (
              <span className="line-through text-sm text-[#9C8875]">
                ${bookData.originalPrice}
              </span>
            )}

            <p className="text-lg font-semibold text-[#3B2218]">
              ${bookData.price}
            </p>
          </div>

          {getStockBadge()}
        </div>

        <p className="mt-2 text-sm text-[#7A614D]">
          Available: {bookData?.stock}
        </p>

        {bookData?.stock > 0 && bookData.stock <= 5 && (
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
            Only {bookData.stock} left
          </span>
        )}
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={bookData?.stock <= 0}
        className={`mt-4 py-2 rounded-full flex items-center justify-center gap-2 ${
          bookData?.stock <= 0
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-[#C5A059] text-white hover:bg-[#a88445]"
        }`}
      >
        <FaShoppingCart />
        {getCartText()}
      </button>
    </div>
  );
};

export default BookCard;