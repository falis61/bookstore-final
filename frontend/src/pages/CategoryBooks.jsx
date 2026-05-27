import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BookCard from "../components/BookCard/BookCard";

const categoryDetails = {
  novel: {
    description: "Timeless stories, deep characters, and unforgettable journeys.",
    banner: "/setcover1.jpg",
  },
  romance: {
    description: "Love stories filled with emotion, passion, and connection.",
    banner: "/setcover2.jpg",
  },
  education: {
    description: "Thoughtful books that support learning, growth, and knowledge.",
    banner: "/setcover3.jpg",
  },
  islamic: {
    description: "Faith-based books focused on guidance, reflection, and understanding.",
    banner: "/setcover4.jpg",
  },
  children: {
    description: "Fun, inspiring, and delightful books for young readers.",
    banner: "/setcover5.jpg",
  },
  technology: {
    description: "Books about innovation, coding, systems, and the digital world.",
    banner: "/setcover6.jpg",
  },
  science: {
    description: "Curious, educational, and mind-opening discoveries.",
    banner: "/setcover7.jpg",
  },
  mystery: {
    description: "Suspenseful plots, hidden clues, and thrilling discoveries.",
    banner: "/setcover8.jpg",
  },
  fantasy: {
    description: "Magical worlds, epic adventures, and imaginative storytelling.",
    banner: "/setcover1.jpg",
  },
  thriller: {
    description: "Fast-paced books that keep you on the edge of your seat.",
    banner: "/setcover8.jpg",
  },
  horror: {
    description: "Dark, chilling, and unforgettable reading experiences.",
    banner: "/setcover8.jpg",
  },
  "young-adult": {
    description: "Coming-of-age stories full of emotion, growth, and adventure.",
    banner: "/setcover5.jpg",
  },
  history: {
    description: "Powerful books that bring past events and people to life.",
    banner: "/setcover3.jpg",
  },
  biography: {
    description: "Real stories of remarkable lives and inspiring journeys.",
    banner: "/setcover3.jpg",
  },
  cookbooks: {
    description: "Flavorful ideas, recipes, and inspiration for your kitchen.",
    banner: "/setcover3.jpg",
  },
  travel: {
    description: "Stories and guides that explore places, cultures, and journeys.",
    banner: "/setcover3.jpg",
  },
  business: {
    description: "Practical and inspiring reads for growth, leadership, and success.",
    banner: "/setcover6.jpg",
  },
};

const CategoryBooks = () => {
  const { name } = useParams();
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("https://bookstore-backend-x6dx.onrender.com/api/v1/get-all-books");

        const fetchedBooks = res.data.data || res.data.books || res.data || [];

        const filteredBooks = fetchedBooks.filter((book) =>
          book.category
            ?.toLowerCase()
            .split(",")
            .map((c) => c.trim())
            .includes(name.toLowerCase().trim())
        );

        setBooks(filteredBooks);
      } catch (error) {
        console.log("Category fetch error:", error);
      }
    };

    fetchBooks();
  }, [name]);

  const availableLanguages = useMemo(() => {
    const uniqueLanguages = [
      ...new Set(
        books
          .map((book) => book.language?.trim())
          .filter((lang) => lang && lang !== "")
      ),
    ];

    return uniqueLanguages.sort((a, b) => a.localeCompare(b));
  }, [books]);

  const visibleBooks = useMemo(() => {
    let result = [...books];

    if (stockFilter === "in-stock") {
      result = result.filter((book) => Number(book.stock) > 0);
    }

    if (stockFilter === "out-of-stock") {
      result = result.filter((book) => Number(book.stock) <= 0);
    }

    if (languageFilter !== "all") {
      result = result.filter(
        (book) =>
          book.language &&
          book.language.toLowerCase().trim() === languageFilter.toLowerCase().trim()
      );
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "rating") {
      result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    }

    if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [books, sortBy, stockFilter, languageFilter]);

  const featuredBooks = useMemo(() => {
    return visibleBooks
      .filter((book) => book.booksWeLove || book.popular || book.trending)
      .slice(0, 4);
  }, [visibleBooks]);

  const bestSellerBooks = useMemo(() => {
    const featuredIds = new Set(featuredBooks.map((b) => b._id));

    return visibleBooks
      .filter((book) => !featuredIds.has(book._id))
      .sort((a, b) => {
        const scoreA = (a.avgRating || 0) * (a.numRatings || 0);
        const scoreB = (b.avgRating || 0) * (b.numRatings || 0);
        return scoreB - scoreA;
      })
      .slice(0, 4);
  }, [visibleBooks, featuredBooks]);

  const newArrivalBooks = useMemo(() => {
    const usedIds = new Set([
      ...featuredBooks.map((b) => b._id),
      ...bestSellerBooks.map((b) => b._id),
    ]);

    return visibleBooks
      .filter((book) => !usedIds.has(book._id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [visibleBooks, featuredBooks, bestSellerBooks]);

  const remainingBooks = useMemo(() => {
    const usedIds = new Set([
      ...featuredBooks.map((b) => b._id),
      ...bestSellerBooks.map((b) => b._id),
      ...newArrivalBooks.map((b) => b._id),
    ]);

    return visibleBooks.filter((book) => !usedIds.has(book._id));
  }, [visibleBooks, featuredBooks, bestSellerBooks, newArrivalBooks]);

  const details =
    categoryDetails[name?.toLowerCase()] || {
      description: "Explore a curated collection of books in this category.",
      banner: "/setcover1.jpg",
    };

  return (
    <div className="bg-[#F5F1E6] min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* BANNER */}
        <div className="relative rounded-3xl overflow-hidden mb-8 min-h-[320px] md:min-h-[380px] shadow-md">
          <img
            src={details.banner}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              animation: "slowZoom 20s ease-in-out infinite alternate",
              transformOrigin: "center center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20"></div>

          <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
            <span className="inline-flex w-fit items-center px-4 py-2 rounded-full bg-[#C5A059] text-white text-sm font-semibold shadow-sm mb-4">
              {visibleBooks.length} {visibleBooks.length === 1 ? "Book" : "Books"}
            </span>

            <h1 className="text-4xl md:text-6xl font-serif text-white capitalize mb-3">
              {name} Books
            </h1>

            <p className="text-white/90 max-w-3xl leading-7 text-sm md:text-base">
              {details.description}
            </p>
          </div>
        </div>

        {/* FILTERS + SORT */}
        {books.length > 0 && (
          <div className="mb-10 bg-[#EDE6DA] border border-[#D6C4A8] rounded-2xl p-5">
            <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#3B2218] mb-2">
                  Sort & Filter
                </h2>
                <p className="text-sm text-[#7A5C3E]">
                  Narrow down books in this category before you browse
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                <div>
                  <label className="block text-sm font-medium text-[#5A4034] mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-[#D6C4A8] rounded-lg px-4 py-2 text-[#3B2218] outline-none min-w-[190px]"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A4034] mb-2">
                    Availability
                  </label>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="bg-white border border-[#D6C4A8] rounded-lg px-4 py-2 text-[#3B2218] outline-none min-w-[190px]"
                  >
                    <option value="all">All Books</option>
                    <option value="in-stock">In Stock Only</option>
                    <option value="out-of-stock">Out of Stock Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A4034] mb-2">
                    Language
                  </label>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="bg-white border border-[#D6C4A8] rounded-lg px-4 py-2 text-[#3B2218] outline-none min-w-[190px]"
                  >
                    <option value="all">All Languages</option>
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {books.length === 0 ? (
          <div className="bg-[#EDE6DA] border border-[#D6C4A8] rounded-xl p-6">
            <p className="text-[#5A4034]">No books found in this category.</p>
          </div>
        ) : (
          <>
            {featuredBooks.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-3xl font-semibold text-[#3B2218]">
                    Featured Books
                  </h2>
                  <p className="text-sm text-[#7A5C3E]">
                    Handpicked highlights from this category
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredBooks.map((item, i) => (
                    <BookCard key={`featured-${i}`} data={item} />
                  ))}
                </div>
              </div>
            )}

            {bestSellerBooks.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-3xl font-semibold text-[#3B2218]">
                    Best Sellers
                  </h2>
                  <p className="text-sm text-[#7A5C3E]">
                    Popular picks based on ratings and reader activity
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {bestSellerBooks.map((item, i) => (
                    <BookCard key={`bestseller-${i}`} data={item} />
                  ))}
                </div>
              </div>
            )}

            {newArrivalBooks.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-3xl font-semibold text-[#3B2218]">
                    New Arrivals
                  </h2>
                  <p className="text-sm text-[#7A5C3E]">
                    Recently added books in this category
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {newArrivalBooks.map((item, i) => (
                    <BookCard key={`new-${i}`} data={item} />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-3xl font-semibold text-[#3B2218]">
                  All {name.charAt(0).toUpperCase() + name.slice(1)} Books
                </h2>
                <p className="text-sm text-[#7A5C3E]">
                  Complete collection in this category
                </p>
              </div>

              {remainingBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {remainingBooks.map((item, i) => (
                    <BookCard key={`all-${i}`} data={item} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#EDE6DA] border border-[#D6C4A8] rounded-xl p-6">
                  <p className="text-[#5A4034]">
                    No more books left after section grouping.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryBooks;