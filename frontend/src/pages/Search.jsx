import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchParams] = useSearchParams();
  const [type, setType] = useState("books");
  const [results, setResults] = useState([]);
  const [authorMeta, setAuthorMeta] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

  const searchBoxRef = useRef(null);

  const highlightMatch = (text, searchValue) => {
    if (!text || !searchValue.trim()) return text;

    const parts = text.split(new RegExp(`(${searchValue})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === searchValue.toLowerCase() ? (
        <span key={index} className="bg-[#EADBC8] text-[#3B2218] font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSearch = async (customQuery = query, customType = type) => {
    try {
      if (!customQuery.trim()) {
        setResults([]);
        return;
      }

      const res = await axios.get("https://bookstore-backend-x6dx.onrender.com/api/v1/search-books", {
        params: {
          query: customQuery,
          type: customType,
        },
      });

      setResults(res.data.data || []);
    } catch (error) {
      console.log("Search error:", error);
      setResults([]);
    }
  };

  useEffect(() => {
    const urlType = searchParams.get("type");
    const urlQuery = searchParams.get("query") || "";

    const finalType = urlType === "authors" ? "authors" : "books";

    setType(finalType);
    setQuery(urlQuery);

    if (urlQuery.trim()) {
      handleSearch(urlQuery, finalType);
    } else {
      setResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchParams]);

  const groupedAuthors = useMemo(() => {
    return Object.values(
      results.reduce((acc, book) => {
        const authorName = book.author?.trim() || "Unknown Author";

        if (!acc[authorName]) {
          acc[authorName] = {
            author: authorName,
            books: [],
          };
        }

        acc[authorName].books.push(book);
        return acc;
      }, {})
    );
  }, [results]);

  const authorSuggestions = groupedAuthors.slice(0, 6);

  useEffect(() => {
    const fetchAuthorMeta = async () => {
      if (type !== "authors" || groupedAuthors.length === 0) {
        setAuthorMeta({});
        return;
      }

      try {
        const responses = await Promise.all(
          groupedAuthors.map(async (item) => {
            try {
              const res = await axios.get(
                `https://bookstore-backend-x6dx.onrender.com/api/v1/get-author/${encodeURIComponent(
                  item.author
                )}`
              );
              return [item.author, res.data.data];
            } catch {
              return [item.author, null];
            }
          })
        );

        setAuthorMeta(Object.fromEntries(responses));
      } catch (error) {
        console.log("Author fetch error:", error);
        setAuthorMeta({});
      }
    };

    fetchAuthorMeta();
  }, [groupedAuthors, type]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIndex(-1);
      return;
    }

    const delaySearch = setTimeout(async () => {
      try {
        setIsSearching(true);

        const res = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/search-books",
          {
            params: {
              query: trimmed,
              type,
            },
          }
        );

        const data = res.data.data || [];

        setResults(data);
        setSuggestions(data.slice(0, 6));
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch (error) {
        console.log("Autocomplete search error:", error);
        setSuggestions([]);
        setShowSuggestions(true);
        setActiveIndex(-1);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(delaySearch);
  }, [query, type]);

  const handleAuthorClick = async (authorName) => {
    try {
      const res = await axios.get(
        `https://bookstore-backend-x6dx.onrender.com/api/v1/get-author/${encodeURIComponent(
          authorName
        )}`
      );

      const author = res.data.data;

      if (author?._id) {
        navigate(`/author/${author._id}`);
      } else {
        console.log("Author not found");
      }
    } catch (error) {
      console.log("Author click error:", error);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/view-book-details/${bookId}`);
  };

  const switchToBooks = () => {
    setType("books");
    setResults([]);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    navigate("/search?type=books");
  };

  const switchToAuthors = () => {
    setType("authors");
    setResults([]);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    navigate("/search?type=authors");
  };

  const submitSearch = () => {
    const trimmed = query.trim();

    setShowSuggestions(false);
    setActiveIndex(-1);

    if (!trimmed) {
      setResults([]);
      navigate(`/search?type=${type}`);
      return;
    }

    navigate(`/search?type=${type}&query=${encodeURIComponent(trimmed)}`);
    handleSearch(trimmed, type);
  };

  const selectSuggestion = (index) => {
    if (type === "authors") {
      const selectedAuthor = authorSuggestions[index];

      if (!selectedAuthor) return;

      setQuery(selectedAuthor.author);
      setShowSuggestions(false);
      setActiveIndex(-1);
      navigate(
        `/search?type=authors&query=${encodeURIComponent(
          selectedAuthor.author
        )}`
      );
      handleSearch(selectedAuthor.author, "authors");
      return;
    }

    const selectedBook = suggestions[index];

    if (!selectedBook) return;

    setQuery(selectedBook.title);
    setShowSuggestions(false);
    setActiveIndex(-1);
    navigate(
      `/search?type=books&query=${encodeURIComponent(selectedBook.title)}`
    );
    handleSearch(selectedBook.title, "books");
  };

  const handleInputKeyDown = (e) => {
    const listLength =
      type === "authors" ? authorSuggestions.length : suggestions.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (listLength === 0) return;

      setShowSuggestions(true);
      setActiveIndex((prev) => (prev + 1) % listLength);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (listLength === 0) return;

      setShowSuggestions(true);
      setActiveIndex((prev) => (prev <= 0 ? listLength - 1 : prev - 1));
    }

    if (e.key === "Enter") {
      if (showSuggestions && activeIndex >= 0) {
        e.preventDefault();
        selectSuggestion(activeIndex);
      } else {
        submitSearch();
      }
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="bg-[#F5F1E6] min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif text-[#3B2218] mb-6">
          {type === "authors" ? "Search Authors" : "Search Books"}
        </h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={switchToBooks}
            className={`px-4 py-2 rounded-full text-sm ${
              type === "books"
                ? "bg-[#3B2218] text-white"
                : "bg-[#EADBC8] text-[#3B2218]"
            }`}
          >
            Books
          </button>

          <button
            onClick={switchToAuthors}
            className={`px-4 py-2 rounded-full text-sm ${
              type === "authors"
                ? "bg-[#3B2218] text-white"
                : "bg-[#EADBC8] text-[#3B2218]"
            }`}
          >
            Authors
          </button>
        </div>

        <div className="relative" ref={searchBoxRef}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (query.trim()) setShowSuggestions(true);
              }}
              onKeyDown={handleInputKeyDown}
              className="w-full px-4 py-3 rounded-[12px] border border-[#D6C3A3] bg-[#FFF8F0] text-[#3B2218] outline-none"
            />

            <button
              onClick={submitSearch}
              className="px-6 py-3 bg-[#3B2218] text-white rounded-[12px]"
            >
              Search
            </button>
          </div>

          {showSuggestions && query.trim() && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-[#D6C3A3] rounded-[14px] shadow-lg z-50 overflow-hidden">
              {isSearching ? (
                <div className="px-4 py-3 text-[#7B6253] text-sm">
                  Searching...
                </div>
              ) : type === "authors" && authorSuggestions.length > 0 ? (
                authorSuggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(index)}
                    className={`w-full text-left px-4 py-3 hover:bg-[#F5E6D3] text-[#3B2218] border-b border-[#EFE1CE] last:border-b-0 ${
                      activeIndex === index ? "bg-[#F5E6D3]" : ""
                    }`}
                  >
                    <p className="font-semibold">
                      {highlightMatch(item.author, query)}
                    </p>
                    <p className="text-xs text-[#7B6253]">
                      {item.books.length}{" "}
                      {item.books.length === 1 ? "book" : "books"}
                    </p>
                  </button>
                ))
              ) : type === "books" && suggestions.length > 0 ? (
                suggestions.map((book, index) => (
                  <button
                    key={book._id}
                    type="button"
                    onClick={() => selectSuggestion(index)}
                    className={`w-full text-left px-4 py-3 hover:bg-[#F5E6D3] text-[#3B2218] border-b border-[#EFE1CE] last:border-b-0 flex items-center gap-3 ${
                      activeIndex === index ? "bg-[#F5E6D3]" : ""
                    }`}
                  >
                    <img
                      src={book.url}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded"
                    />

                    <div>
                      <p className="font-semibold">
                        {highlightMatch(book.title, query)}
                      </p>
                      <p className="text-xs text-[#7B6253]">
                        {highlightMatch(book.author, query)}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-[#7B6253] text-sm">
                  No suggestions found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 text-[#7B6253]">
          {results.length === 0 ? (
            <p>No results found</p>
          ) : type === "authors" ? (
            <div className="space-y-5">
              {groupedAuthors.map((item, index) => {
                const meta = authorMeta[item.author] || null;
                const lifeText =
                  meta?.born && meta?.died
                    ? `${meta.born} - ${meta.died}`
                    : meta?.born
                    ? `${meta.born} -`
                    : meta?.died
                    ? `- ${meta.died}`
                    : "";

                return (
                  <div
                    key={index}
                    className="bg-[#FBF7EF] border border-[#D6C3A3] rounded-[18px] p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row gap-5">
                      <div className="w-full md:w-[95px] h-[120px] rounded-[14px] overflow-hidden bg-[#F3E7D7] border border-[#D6C3A3] flex items-center justify-center">
                        {meta?.image ? (
                          <img
                            src={meta.image}
                            alt={item.author}
                            className="w-full h-full object-cover"
                          />
                        ) : item.books[0]?.url ? (
                          <img
                            src={item.books[0].url}
                            alt={item.author}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#7B6253] text-sm">
                            Author
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <button
                            type="button"
                            onClick={() => handleAuthorClick(item.author)}
                            className="text-left text-2xl font-serif text-[#2B5D87] hover:underline"
                          >
                            {item.author}
                          </button>

                          {lifeText && (
                            <span className="text-[#7B6253] text-base">
                              {lifeText}
                            </span>
                          )}
                        </div>

                        <p className="text-[#5A4335] text-sm mt-2">
                          <span className="font-semibold">
                            {item.books.length}{" "}
                            {item.books.length === 1 ? "book" : "books"}
                          </span>{" "}
                          in BookNest
                        </p>

                        {meta?.description && (
                          <p className="text-[#6E5A4D] text-sm leading-7 mt-3">
                            {meta.description}
                          </p>
                        )}

                        <div className="mt-4">
                          <p className="text-[#5A4335] text-sm font-medium mb-2">
                            Including
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {item.books.slice(0, 3).map((book) => (
                              <span
                                key={book._id}
                                className="px-3 py-1.5 rounded-full bg-[#F5EBDD] text-[#5A4335] text-sm border border-[#E1CFB2]"
                              >
                                {book.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-5">
              {results.map((book) => (
                <div
                  key={book._id}
                  onClick={() => handleBookClick(book._id)}
                  className="bg-[#FBF7EF] border border-[#D6C3A3] rounded-[18px] p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-[95px] h-[120px] rounded-[14px] overflow-hidden bg-[#F3E7D7] border border-[#D6C3A3] flex items-center justify-center">
                      <img
                        src={book.url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => handleBookClick(book._id)}
                        className="text-left text-2xl font-serif text-[#2B5D87] hover:underline"
                      >
                        {book.title}
                      </button>

                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAuthorClick(book.author);
                          }}
                          className="text-[#5A4335] text-base hover:underline"
                        >
                          {book.author}
                        </button>
                      </div>

                      <p className="text-[#6E5A4D] text-sm leading-7 mt-3 capitalize">
                        {book.category}
                        {book.language ? ` · ${book.language}` : ""}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1.5 rounded-full bg-[#F5EBDD] text-[#5A4335] text-sm border border-[#E1CFB2]">
                          ${book.price}
                        </span>

                        {book.stock !== undefined && (
                          <span className="text-sm text-[#7B6253]">
                            Stock: {book.stock}
                          </span>
                        )}
                      </div>

                      {book.desc && (
                        <p className="text-[#6E5A4D] text-sm leading-7 mt-4 line-clamp-2">
                          {book.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;