import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const categories = [
  {
    name: "novel",
    label: "Novel",
    description: "Timeless stories, deep characters, and unforgettable journeys.",
    image: "cover1.jpg",
  },
  {
    name: "romance",
    label: "Romance",
    description: "Love stories filled with emotion, passion, and connection.",
    image: "cover2.jpg",
    featured: true,
  },
  {
    name: "education",
    label: "Education",
    description: "Books that support learning, growth, and knowledge.",
    image: "cover3.jpg",
  },
  {
    name: "islamic",
    label: "Islamic",
    description: "Faith-based books focused on guidance and reflection.",
    image: "cover4.jpg",
  },
  {
    name: "children",
    label: "Children",
    description: "Fun, inspiring, and delightful books for young readers.",
    image: "cover5.jpg",
  },
  {
    name: "technology",
    label: "Technology",
    description: "Books about innovation, coding, systems, and digital life.",
    image: "cover6.jpg",
    featured: true,
  },
  {
    name: "science",
    label: "Science",
    description: "Curious, educational, and mind-opening discoveries.",
    image: "cover7.jpg",
  },
  {
    name: "mystery",
    label: "Mystery",
    description: "Suspenseful plots, hidden clues, and thrilling discoveries.",
    image: "cover8.jpg",
    featured: true,
  },
];

const Categories = () => {
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("https://bookstore-backend-x6dx.onrender.com/api/v1/get-all-books");
        const fetchedBooks = res.data.data || res.data.books || res.data || [];
        setAllBooks(fetchedBooks);
      } catch (error) {
        console.log("Category fetch error:", error);
      }
    };

    fetchBooks();
  }, []);

  const categoryData = useMemo(() => {
    return categories.map((category) => {
      const matchedBooks = allBooks.filter((book) =>
        book.category
          ?.toLowerCase()
          .split(",")
          .map((c) => c.trim())
          .includes(category.name)
      );

      const featuredBook = matchedBooks[0] || null;

      return {
        ...category,
        count: matchedBooks.length,
        featuredImage: category.image || featuredBook?.url || null,
      };
    });
  }, [allBooks]);

  const featuredCategories = categoryData.filter((category) => category.featured);
  const regularCategories = categoryData.filter((category) => !category.featured);

  return (
    <div className="bg-[#F5F1E6] min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* NEW BANNER */}
        <div className="relative rounded-3xl overflow-hidden mb-10 h-[260px] md:h-[320px] shadow-md">
          <img
            src="/cat2.jpg"
            alt="Categories"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              animation: "slowZoom 20s ease-in-out infinite alternate",
              transformOrigin: "center center",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>

          <div className="relative z-10 h-full flex flex-col justify-end p-8">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-3">
              Explore Categories
            </h1>

            <p className="text-white/90 max-w-2xl">
              Discover books by genre, topic, and interest. Find your next read across a wide range of categories.
            </p>
          </div>
        </div>

        {/* FEATURED CATEGORIES */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-3xl font-semibold text-[#3B2218]">
              Featured Categories
            </h2>
            <p className="text-sm text-[#7A5C3E]">
              Discover popular collections at a glance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name}`}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 min-h-[340px]"
              >
                {category.featuredImage ? (
                  <img
                    src={category.featuredImage}
                    alt={category.label}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#F1ECE4]"></div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#C5A059] text-white text-sm font-semibold shadow-sm w-fit mb-4">
                    {category.count} {category.count === 1 ? "Book" : "Books"}
                  </span>

                  <h3 className="text-3xl font-serif text-white mb-3">
                    {category.label}
                  </h3>

                  <p className="text-white/90 text-sm leading-6 max-w-sm">
                    {category.description}
                  </p>

                  <p className="mt-4 text-[#F3D18A] font-semibold group-hover:translate-x-1 transition">
                    Explore Category →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ALL CATEGORIES */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-3xl font-semibold text-[#3B2218]">
              All Categories
            </h2>
            <p className="text-sm text-[#7A5C3E]">
              Browse every collection in the store
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {regularCategories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name}`}
                className="group bg-[#F8F4EC] border border-[#D6C4A8] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="relative h-[240px] overflow-hidden bg-white">
                  {category.featuredImage ? (
                    <img
                      src={category.featuredImage}
                      alt={category.label}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#F1ECE4]">
                      <p className="text-[#7A614D] text-sm">No cover available</p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent"></div>

                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#C5A059] text-white text-sm font-semibold shadow-sm">
                      {category.count} {category.count === 1 ? "Book" : "Books"}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <h2 className="text-2xl font-semibold text-[#3B2218]">
                    {category.label}
                  </h2>

                  <p className="text-[#6B4B3E] text-sm leading-6 flex-1">
                    {category.description}
                  </p>

                  <p className="text-sm text-[#C5A059] font-semibold">
                    Explore Category →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;