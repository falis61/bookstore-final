import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";
import { useLocation } from "react-router-dom";
import {
  FaBook,
  FaTags,
  FaUserEdit,
  FaBoxOpen,
} from "react-icons/fa";

const AllBooks = () => {
  const [Data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = (searchParams.get("search") || "").toLowerCase().trim();
  const stockFilter = searchParams.get("stock");

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/get-all-books"
      );
      setData(response.data.data);
    };
    fetch();
  }, []);

  const authors = useMemo(() => {
    if (!Data) return [];
    const uniqueAuthors = [
      ...new Set(Data.map((book) => book.author).filter(Boolean)),
    ];
    return uniqueAuthors.sort();
  }, [Data]);

  const filteredBooks = useMemo(() => {
    if (!Data) return [];

    let books = [...Data];

    // LOW STOCK FILTER FROM DASHBOARD
    if (stockFilter === "low") {
      books = books.filter((book) => Number(book.stock) < 5);
    }

    // SEARCH BY TITLE OR AUTHOR
    if (searchTerm !== "") {
      books = books.filter((book) => {
        const title = (book.title || "").toLowerCase();
        const author = (book.author || "").toLowerCase();

        return title.includes(searchTerm) || author.includes(searchTerm);
      });
    }

    // CATEGORY
    if (selectedCategory !== "all") {
      books = books.filter((book) => {
        const category = (book.category || "").toLowerCase();

        if (selectedCategory === "fiction") {
          return [
            "novel",
            "romance",
            "fantasy",
            "mystery",
            "thriller",
            "horror",
            "young-adult",
          ].includes(category);
        }

        if (selectedCategory === "non-fiction") {
          return [
            "history",
            "biography",
            "cookbooks",
            "science",
            "travel",
            "business",
            "technology",
            "education",
            "islamic",
          ].includes(category);
        }

        if (selectedCategory === "children") {
          return category === "children";
        }

        return true;
      });
    }

    // AUTHOR
    if (selectedAuthor !== "all") {
      books = books.filter((book) => book.author === selectedAuthor);
    }

    // PRICE
    if (minPrice !== "") {
      books = books.filter((book) => Number(book.price) >= Number(minPrice));
    }

    if (maxPrice !== "") {
      books = books.filter((book) => Number(book.price) <= Number(maxPrice));
    }

    // AVAILABILITY
    if (inStock && !outOfStock) {
      books = books.filter((book) => Number(book.stock) > 0);
    }

    if (outOfStock && !inStock) {
      books = books.filter((book) => Number(book.stock) <= 0);
    }

    return books;
  }, [
    Data,
    searchTerm,
    stockFilter,
    selectedCategory,
    selectedAuthor,
    minPrice,
    maxPrice,
    inStock,
    outOfStock,
  ]);

  return (
    <div className="bg-[#F5F1E6] min-h-screen px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-serif text-[#4B2E1F] mb-8">
          {stockFilter === "low" ? "LOW STOCK BOOKS" : "SHOP ALL BOOKS"}
        </h1>

        {searchTerm && (
          <p className="mb-4 text-[#6B5748] text-lg">
            Search results for:{" "}
            <span className="font-semibold text-[#4B2E1F]">{searchTerm}</span>
          </p>
        )}

        {stockFilter === "low" && (
          <p className="mb-4 text-[#6B5748] text-lg">
            Showing books with stock under 5
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* SIDEBAR */}
          <div className="bg-[#FBF7EF] border border-[#D6C4A8] rounded-[16px] p-5 h-fit shadow-sm">
            <h2 className="text-2xl font-semibold text-[#3B2218] mb-5">
              SHOP FILTERS
            </h2>

            <div className="space-y-5 text-[#4B2E1F]">
              {/* CATEGORY */}
              <div className="border-b pb-3">
                <button
                  onClick={() => setSelectedCategory("fiction")}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <FaBook /> FICTION
                </button>
                <button
                  onClick={() => setSelectedCategory("non-fiction")}
                  className="flex items-center gap-2 w-full text-left mt-2"
                >
                  <FaBook /> NON-FICTION
                </button>
                <button
                  onClick={() => setSelectedCategory("children")}
                  className="flex items-center gap-2 w-full text-left mt-2"
                >
                  <FaBook /> CHILDREN
                </button>
              </div>

              {/* PRICE RANGE */}
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaTags /> PRICE RANGE
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full accent-[#C5A059]"
                />

                <div className="flex gap-2 mt-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              </div>

              {/* AUTHOR */}
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaUserEdit /> AUTHOR
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  <button
                    onClick={() => setSelectedAuthor("all")}
                    className="block w-full text-left"
                  >
                    All Authors
                  </button>

                  {authors.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedAuthor(a)}
                      className="block w-full text-left"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* AVAILABILITY */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaBoxOpen /> AVAILABILITY
                </div>

                <label className="block">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={() => {
                      setInStock(true);
                      setOutOfStock(false);
                    }}
                  />{" "}
                  In Stock
                </label>

                <label className="block">
                  <input
                    type="checkbox"
                    checked={outOfStock}
                    onChange={() => {
                      setOutOfStock(true);
                      setInStock(false);
                    }}
                  />{" "}
                  Out of Stock
                </label>
              </div>

              {/* CLEAR */}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedAuthor("all");
                  setMinPrice("");
                  setMaxPrice("");
                  setInStock(false);
                  setOutOfStock(false);
                }}
                className="w-full mt-4 bg-[#4B2E1F] text-[#F3E7C8] py-2 rounded-[10px] hover:bg-[#341d12] transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* BOOKS */}
          <div>
            {!Data && (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}

            {Data && (
              <p className="mb-4 text-[#6B5748]">
                Showing {filteredBooks.length} books
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((item, i) => (
                <BookCard key={i} data={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBooks;