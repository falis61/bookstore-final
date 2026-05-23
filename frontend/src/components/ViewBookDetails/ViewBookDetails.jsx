import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit, FaStar } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../Store/auth";
import toast from "react-hot-toast";
import BookCard from "../BookCard/BookCard";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

/* NEW: Recently Viewed save helper */
const saveRecentlyViewedBook = (book) => {
  const userId = getStoredItem("id");
  const role = getStoredItem("role");

  if (!book?._id || !userId || role !== "user") return;

  const storageKey = `recentlyViewedBooks_${userId}`;

  let viewed = JSON.parse(localStorage.getItem(storageKey)) || [];

  viewed = viewed.filter((item) => item._id !== book._id);

  viewed.unshift({
    _id: book._id,
    title: book.title,
    author: book.author,
    url: book.url,
    price: book.price,
    originalPrice: book.originalPrice,
    stock: book.stock,
  });

  viewed = viewed.slice(0, 8);

  localStorage.setItem(storageKey, JSON.stringify(viewed));
};
const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Data, setData] = useState();
  const [authorData, setAuthorData] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [alertLoading, setAlertLoading] = useState(false);
  const [subscribedAlert, setSubscribedAlert] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  const currentUserId = getStoredItem("id");

  const hasDiscount =
    Data?.originalPrice && Number(Data.originalPrice) > Number(Data.price);

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

  const fetchBook = async () => {
    const response = await axios.get(
      `http://localhost:1000/api/v1/get-book-by-id/${id}`
    );
    const bookData = response.data.data;
    setData(bookData);

    if (bookData?.author) {
      try {
        const authorRes = await axios.get(
          `http://localhost:1000/api/v1/get-author/${encodeURIComponent(
            bookData.author
          )}`
        );
        setAuthorData(authorRes.data.data || null);
      } catch (error) {
        setAuthorData(null);
      }
    } else {
      setAuthorData(null);
    }
  };

  const fetchRelatedBooks = async (category, currentId) => {
    try {
      const res = await axios.get("http://localhost:1000/api/v1/get-all-books");

      const books = res.data.data || [];

      const currentCategories = category
        ?.toLowerCase()
        .split(",")
        .map((c) => c.trim());

      const filtered = books.filter((book) => {
        if (book._id === currentId) return false;

        const bookCategories = book.category
          ?.toLowerCase()
          .split(",")
          .map((c) => c.trim());

        return bookCategories?.some((c) => currentCategories?.includes(c));
      });

      setRelatedBooks(filtered.slice(0, 4));
    } catch (error) {
      console.log("Related books error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const response = await axios.get(
        `http://localhost:1000/api/v1/get-book-by-id/${id}`
      );

      const bookData = response.data.data;

      setData(bookData);

      /* NEW */
      saveRecentlyViewedBook(bookData);

      if (bookData?.author) {
        try {
          const authorRes = await axios.get(
            `http://localhost:1000/api/v1/get-author/${encodeURIComponent(
              bookData.author
            )}`
          );
          setAuthorData(authorRes.data.data || null);
        } catch (error) {
          setAuthorData(null);
        }
      } else {
        setAuthorData(null);
      }

      if (bookData?.category) {
        fetchRelatedBooks(bookData.category, bookData._id);
      }
    };

    loadData();
  }, [id]);

  const myReview = useMemo(() => {
    if (!Data?.reviews || !currentUserId) return null;
    return (
      Data.reviews.find(
        (review) => String(review.user) === String(currentUserId)
      ) || null
    );
  }, [Data, currentUserId]);

  useEffect(() => {
    if (myReview) {
      setReviewText(myReview.comment || "");
      setSelectedRating(myReview.rating || 0);
    } else {
      setReviewText("");
      setSelectedRating(0);
    }
  }, [myReview]);

  const headers = {
    id: getStoredItem("id"),
    authorization: `Bearer ${getStoredItem("token")}`,
    bookid: id,
  };

  const handleFavourite = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-favourite",
        {},
        { headers }
      );
      toast.success(response.data.message, toastStyle);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add to favourite",
        errorToastStyle
      );
    }
  };

  const handleCart = async () => {
    try {
      if (Data?.stock <= 0) {
        toast.error("This book is out of stock", errorToastStyle);
        return;
      }

      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-cart",
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

  const handleAvailabilityAlert = async () => {
  try {
    setAlertLoading(true);

    const response = await axios.post(
      `http://localhost:1000/api/v1/availability-alert/${id}`,
      {},
      { headers }
    );

    toast.success(response.data.message, toastStyle);
    setSubscribedAlert(true);
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to request availability alert",
      errorToastStyle
    );
  } finally {
    setAlertLoading(false);
  }
};

  const deleteBook = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:1000/api/v1/delete-book",
        { headers }
      );
      toast.success(response.data.message, toastStyle);
      navigate("/all-books");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete book",
        errorToastStyle
      );
    }
  };

  const submitRating = async () => {
    try {
      if (!selectedRating) {
        toast("Please select a rating", toastStyle);
        return;
      }

      const response = await axios.put(
        "http://localhost:1000/api/v1/rate-book",
        { rating: selectedRating },
        { headers }
      );

      toast.success(response.data.message, toastStyle);
      await fetchBook();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to rate book",
        errorToastStyle
      );
    }
  };

  const submitReview = async () => {
    try {
      if (reviewText.trim() === "") {
        toast("Please write a review", toastStyle);
        return;
      }

      if (!selectedRating) {
        toast("Please select a rating before submitting your review", toastStyle);
        return;
      }

      await axios.put(
        "http://localhost:1000/api/v1/rate-book",
        { rating: selectedRating },
        { headers }
      );

      const response = await axios.put(
        "http://localhost:1000/api/v1/add-review",
        {
          comment: reviewText,
          rating: selectedRating,
        },
        { headers }
      );

      toast.success(response.data.message, toastStyle);
      await fetchBook();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save review",
        errorToastStyle
      );
    }
  };

  const handleDeleteReview = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:1000/api/v1/delete-review",
        { headers }
      );

      toast.success(response.data.message, toastStyle);
      setReviewText("");
      setSelectedRating(0);
      await fetchBook();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete review",
        errorToastStyle
      );
    }
  };

  const handleAuthorClick = async () => {
    try {
      if (!Data?.author) return;

      const response = await axios.get(
        `http://localhost:1000/api/v1/get-author/${encodeURIComponent(
          Data.author
        )}`
      );

      const author = response.data.data;

      if (author?._id) {
        navigate(`/author/${author._id}`);
      } else {
        toast.error("Author page not found", errorToastStyle);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Author page not found",
        errorToastStyle
      );
    }
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating || 0);
    return [1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        className={star <= rounded ? "text-[#C9A24E]" : "text-[#D6C4A8]"}
      />
    ));
  };

  const getStockBadge = () => {
    if (Data?.stock === 0)
      return (
        <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold">
          Out of Stock
        </span>
      );

    if (Data?.stock <= 5)
      return (
        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
          Low Stock
        </span>
      );

    return (
      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
        In Stock
      </span>
    );
  };

  return (
    <>
      {Data && (
        <div className="px-4 md:px-12 py-8 bg-[#F5F1E6]">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-3/6">
              <div className="flex flex-col lg:flex-row justify-around bg-[#EDE6DA] py-12 rounded shadow-md">
                <img
                  src={Data?.url}
                  alt={Data?.title}
                  className="h-[50vh] md:h-[60vh] lg:h-[70vh] rounded"
                />

                    {isLoggedIn === true && role === "user" && (
                     <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0">
                      <button className="bg-white rounded lg:rounded-full text-3xl p-3 text-red-500 flex items-center justify-center shadow"
                        onClick={handleFavourite} >
                          <FaHeart />
                          </button>

                            <button
                      disabled={Data?.stock <= 0}className={`rounded mt-8 md:mt-0 lg:rounded-full text-3xl p-3 lg:mt-8 flex items-center justify-center transition ${
                      Data?.stock <= 0
                     ? "bg-gray-300 text-gray-500" : "bg-[#C9A24E] text-white hover:bg-[#B68F3E]"}`}
                       onClick={handleCart} >
                  <FaShoppingCart />
                  </button>

               {/* 🔔 Shows only when the book is out of stock */}
                 {Data?.stock <= 0 && (
               <button
               disabled={alertLoading || subscribedAlert}
               onClick={handleAvailabilityAlert}
                className="mt-4 lg:mt-8 bg-[#3B2218] text-[#F5F1E6] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#5C3B1E] transition disabled:bg-gray-400">
                  {alertLoading? "Saving...": subscribedAlert? "Subscribed ✅": "Notify me"}
                    </button>
                  )}
              </div>
                 )}

                {isLoggedIn === true && role === "admin" && (
                  <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0">
                    <Link
                      to={`/update-book/${id}`}
                      className="bg-[#4A2414] text-white rounded lg:rounded-full text-3xl p-3 flex items-center justify-center shadow hover:bg-[#B68F3E] transition"
                    >
                      <FaEdit />
                    </Link>

                    <button
                      onClick={deleteBook}
                      className="bg-[#c72222] text-[#F5F1E6] rounded mt-8 md:mt-0 lg:rounded-full text-3xl p-3 lg:mt-8 flex items-center justify-center shadow hover:bg-[#3B2218] transition"
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 w-full lg:w-3/6">
              <h1 className="text-4xl text-[#5C3B1E] font-semibold">
                {Data?.title}
              </h1>

              <div className="mt-2 flex items-center gap-3">
                {authorData?.image && (
                  <button onClick={handleAuthorClick}>
                    <img
                      src={authorData.image}
                      alt={Data?.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </button>
                )}

                <p className="text-[#7A5C3E]">
                  by{" "}
                  <button
                    onClick={handleAuthorClick}
                    className="text-[#2B5D87] hover:underline font-medium"
                  >
                    {Data?.author}
                  </button>
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex gap-1">
                  {renderStars(Data?.avgRating)}
                </div>
                <p>{Data?.avgRating?.toFixed?.(1) || "0.0"} /5</p>
              </div>

              <p className="text-[#6B4F35] mt-4 text-lg">{Data?.desc}</p>

              <p className="flex mt-4 items-center text-[#7A5C3E]">
                <GrLanguage className="me-3" />
                {Data?.language}
              </p>

              <div className="mt-6 flex gap-4 items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-semibold text-[#3B2218]">
                      Price : ${Data?.price}
                    </span>

                    {hasDiscount && (
                      <span className="text-xl text-[#9C8875] line-through">
                        ${Data?.originalPrice}
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <p className="text-sm text-[#C5A059] font-semibold mt-1">
                      You save ${Number(Data.originalPrice) - Number(Data.price)}
                    </p>
                  )}
                </div>

                {/* ✅ FIXED STOCK UI */}
                <div className="flex items-center gap-2">
                  {getStockBadge()}

                  {Data?.stock > 0 && Data.stock <= 5 && (
                    <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold">
                      Only {Data.stock} left
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ RATE AND REVIEW SECTION ADDED BACK */}
          {isLoggedIn && role === "user" && (
            <div className="mt-12 bg-[#FBF7EF] border border-[#E5D3B3] rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-serif font-semibold text-[#3B2218] mb-6">
                Rate & Review
              </h2>

              <div className="flex gap-2 mb-6 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className={
                      star <= selectedRating
                        ? "text-[#C5A059]"
                        : "text-[#D6C4A8]"
                    }
                  >
                    <FaStar />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="5"
                placeholder="Share your thoughts about this book..."
                className="w-full border border-[#D8C5AA] rounded-xl p-4 bg-white text-[#3B2218] outline-none"
              />

              <div className="flex flex-wrap gap-4 mt-5">
                <button
                  onClick={submitReview}
                  className="bg-[#C5A059] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#ad8b45] transition"
                >
                  {myReview ? "Update Review" : "Submit Review"}
                </button>

                {myReview && (
                  <button
                    onClick={handleDeleteReview}
                    className="bg-[#c53f3f] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a83232] transition"
                  >
                    Delete Review
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ✅ REVIEWS DISPLAY SECTION ADDED BACK */}
          <div className="mt-10 bg-[#FBF7EF] border border-[#E5D3B3] rounded-2xl p-8 shadow-sm">
            <h2 className="text-3xl font-serif font-semibold text-[#3B2218] mb-6">
              Reviews
            </h2>

            {Data?.reviews && Data.reviews.length > 0 ? (
              <div className="space-y-4">
                {Data.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-5 border border-[#D8C5AA]"
                  >
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h4 className="text-lg font-semibold text-[#3B2218]">
                        {review.username}
                      </h4>

                      <p className="text-sm text-[#7A5C3E]">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>

                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={
                            star <= review.rating
                              ? "text-[#C5A059]"
                              : "text-[#D6C4A8]"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-[#5A4034] leading-7">
                      {review.comment}
                    </p>

                    {String(review.user) === String(currentUserId) && (
                      <p className="mt-3 text-sm text-[#8B5E3C] font-medium">
                        This is your review.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#7A5C3E]">No reviews yet.</p>
            )}
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-semibold text-[#5C3B1E] mb-6">
              Related Books
            </h2>

            {relatedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedBooks.map((book, i) => (
                  <BookCard key={i} data={book} />
                ))}
              </div>
            ) : (
              <p>No related books found.</p>
            )}
          </div>
        </div>
      )}

      {!Data && (
        <div className="h-screen bg-[#F5F1E6] flex items-center justify-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;