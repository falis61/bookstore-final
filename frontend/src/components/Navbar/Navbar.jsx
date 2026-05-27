import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaGripLines,
  FaSearch,
  FaShoppingCart,
  FaChevronDown,
  FaUserCircle,
  FaHeart,
} from "react-icons/fa";
import { Feather } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { authActions } from "../../Store/auth";
import { useTranslation } from "react-i18next";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const cartCount = useSelector((state) => state.auth.cartCount);
  const favCount = useSelector(
    (state) =>
      state.auth.favourites.length + state.auth.favouriteBundles.length
  );

  const { i18n, t } = useTranslation();
  const [openLang, setOpenLang] = useState(false);

  const [MobileNav, setMobileNav] = useState("hidden");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [allBooks, setAllBooks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await axios.get("https://bookstore-backend-x6dx.onrender.com/api/v1/get-all-books");
      setAllBooks(res.data.data || []);
    } catch (err) {
      console.log("Search fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchProfile = async () => {
    try {
      const id = getStoredItem("id");
      const token = getStoredItem("token");

      if (!id || !token || !isLoggedIn) {
        setProfile(null);
        return;
      }

      const response = await axios.get(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/get-user-information",
        {
          headers: {
            id,
            authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);
    } catch (error) {
      console.log(error);
      setProfile(null);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const id = getStoredItem("id");
        const token = getStoredItem("token");

        if (!id || !token || !isLoggedIn || role !== "user") {
          dispatch(authActions.setCartCount(0));
          return;
        }

        const response = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-user-cart",
          {
            headers: {
              id,
              authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(authActions.setCartCount(response.data.data.length));
      } catch (error) {
        console.log(error);
        dispatch(authActions.setCartCount(0));
      }
    };

    fetchCart();
  }, [isLoggedIn, role, dispatch]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const id = getStoredItem("id");
        const token = getStoredItem("token");

        if (!id || !token || !isLoggedIn || role !== "user") {
          dispatch(authActions.setFavourites([]));
          dispatch(authActions.setFavouriteBundles([]));
          return;
        }

        const booksResponse = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-favourite-books",
          {
            headers: {
              id,
              authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(
          authActions.setFavourites(
            (booksResponse.data.data || []).map((book) => book._id)
          )
        );

        const bundlesResponse = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-favourite-bundles",
          {
            headers: {
              id,
              authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(
          authActions.setFavouriteBundles(
            (bundlesResponse.data.data || []).map((bundle) => bundle._id)
          )
        );
      } catch (error) {
        console.log(error);
        dispatch(authActions.setFavourites([]));
        dispatch(authActions.setFavouriteBundles([]));
      }
    };

    fetchFavourites();
  }, [isLoggedIn, role, dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      setProfile(null);
      return;
    }

    fetchProfile();
  }, [isLoggedIn, role]);

  useEffect(() => {
    const handleProfileImageUpdated = () => {
      fetchProfile();
    };

    window.addEventListener("profileImageUpdated", handleProfileImageUpdated);

    return () => {
      window.removeEventListener(
        "profileImageUpdated",
        handleProfileImageUpdated
      );
    };
  }, [isLoggedIn, role]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();

    if (trimmed !== "") {
      navigate(
        `/all-books?search=${encodeURIComponent(trimmed)}&type=${searchType}`
      );
      setShowSuggestions(false);
    } else {
      navigate("/all-books");
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const val = value.toLowerCase();

    const filtered = allBooks.filter((book) => {
      const title = book.title?.toLowerCase() || "";
      const author = book.author?.toLowerCase() || "";
      const category = book.category?.toLowerCase() || "";
      const desc = book.desc?.toLowerCase() || "";
      const language = book.language?.toLowerCase() || "";

      if (searchType === "title") return title.includes(val);
      if (searchType === "author") return author.includes(val);
      if (searchType === "subject") return category.includes(val);
      if (searchType === "list") return desc.includes(val);

      return (
        title.includes(val) ||
        author.includes(val) ||
        category.includes(val) ||
        desc.includes(val) ||
        language.includes(val)
      );
    });

    setSuggestions(filtered.slice(0, 5));
    setShowSuggestions(filtered.length > 0);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="bg-[#3B2218] text-[#F3E7C8]">
      <nav className="z-50 relative flex px-8 py-4 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <Feather
            size={34}
            strokeWidth={1.6}
            className="text-[#E8D8B5] group-hover:text-[#C5A059] transition duration-300"
          />

          <h1 className="text-2xl font-semibold tracking-wide text-[#E8D8B5] group-hover:text-[#C5A059] transition duration-300">
            BookNest
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-[#E6C89A]">
            {t("home")}
          </Link>

          <div className="relative">
            <div className="flex items-center gap-1">
              <Link to="/categories" className="hover:text-[#E6C89A]">
                {t("category")}
              </Link>

              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="hover:text-[#E6C89A]"
              >
                <FaChevronDown
                  className={`text-xs mt-1 transition-transform ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {categoryOpen && (
              <div className="absolute top-full left-0 mt-2 bg-[#F5E6D3] text-[#3B2218] rounded shadow-lg w-52 z-50">
                <Link to="/category/novel" className="block px-4 py-2 hover:bg-[#EAD7B8]">
                  {t("novel")}
                </Link>
                <Link to="/category/romance" className="block px-4 py-2 hover:bg-[#EAD7B8]">
                  {t("romance")}
                </Link>
                <Link to="/category/education" className="block px-4 py-2 hover:bg-[#EAD7B8]">
                  {t("education")}
                </Link>
                <Link to="/category/islamic" className="block px-4 py-2 hover:bg-[#EAD7B8]">
                  {t("islamic")}
                </Link>
                <Link to="/category/children" className="block px-4 py-2 hover:bg-[#EAD7B8]">
                  {t("children")}
                </Link>
                <Link to="/category/technology" className="block px-4 py-2 hover:bg-[#EAD7B8]">
                  {t("technology")}
                </Link>
              </div>
            )}
          </div>

          <Link to="/all-books" className="hover:text-[#E6C89A]">
            {t("shop")}
          </Link>
          <Link to="/about" className="hover:text-[#E6C89A]">
            {t("about us")}
          </Link>
          <Link to="/contact" className="hover:text-[#E6C89A]">
            {t("contact")}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setOpenLang(!openLang)}
                className="hover:text-[#E6C89A] flex items-center gap-1"
              >
                {i18n.language.toUpperCase()}
                <FaChevronDown
                  className={`text-xs mt-1 transition-transform ${
                    openLang ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {openLang && (
              <div className="absolute right-0 mt-2 bg-[#F5E6D3] text-[#3B2218] rounded shadow-lg w-24 z-50">
                <button
                  onClick={() => {
                    i18n.changeLanguage("en");
                    setOpenLang(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-[#EAD7B8]"
                >
                  EN
                </button>

                <button
                  onClick={() => {
                    i18n.changeLanguage("tr");
                    setOpenLang(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-[#EAD7B8]"
                >
                  TR
                </button>

                <button
                  onClick={() => {
                    i18n.changeLanguage("ar");
                    setOpenLang(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-[#EAD7B8]"
                >
                  AR
                </button>
              </div>
            )}
          </div>

          <div className="relative w-60 xl:w-64">
            <div className="flex items-center bg-[#F5E6D3] rounded-full overflow-hidden shadow-sm border border-[#E8D8B5]">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-[#EAD7B8] text-black px-2 py-2 text-sm outline-none cursor-pointer w-[60px]"
              >
                <option value="all">{t("all")}</option>
                <option value="title">{t("title")}</option>
                <option value="author">{t("author")}</option>
                <option value="subject">{t("subject")}</option>
                <option value="list">{t("list")}</option>
              </select>

              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                  fetchBooks();
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                className="w-full px-3 py-2 bg-transparent text-black focus:outline-none"
              />

              <FaSearch
                className="px-3 text-gray-600 cursor-pointer hover:text-[#8B5E3C] transition"
                onClick={handleSearch}
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white text-black rounded shadow-lg mt-2 z-50 max-h-72 overflow-y-auto">
                {suggestions.map((book) => (
                  <div
                    key={book._id}
                    onClick={() => {
                      navigate(`/view-book-details/${book._id}`);
                      setShowSuggestions(false);
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#F5E6D3]"
                  >
                    <img
                      src={book.url}
                      alt={book.title}
                      className="w-8 h-10 object-cover rounded"
                    />

                    <div>
                      <p className="text-sm font-medium">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isLoggedIn && role === "user" && (
            <Link
              to="/profile/favourites"
              className="relative text-xl hover:text-[#E6C89A] hover:scale-110 transition duration-300"
            >
              <FaHeart />

              {favCount > 0 && (
                <span className="absolute -top-2 -right-1 bg-[#E6C89A] text-[#3B2218] w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold">
                  {favCount}
                </span>
              )}
            </Link>
          )}

          {isLoggedIn && role === "user" && (
            <Link
              to="/cart"
              className="relative text-xl hover:text-[#E6C89A] hover:scale-110 transition duration-300"
            >
              <FaShoppingCart />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-1 bg-[#E6C89A] text-[#3B2218] w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {!isLoggedIn && (
            <Link
              to="/logIn"
              className="px-4 py-1 border border-[#E6C89A] rounded hover:bg-[#F5E6D3] hover:text-[#3B2218]"
            >
              {t("login")}
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/profile" className="ml-2 hover:text-[#E6C89A]">
              {profile?.profileImage || profile?.avatar ? (
                <img
                  src={profile?.profileImage || profile?.avatar}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#E6C89A]"
                />
              ) : (
                <FaUserCircle className="text-3xl" />
              )}
            </Link>
          )}
        </div>

        <button
          className="block md:hidden text-[#F3E7C8] text-2xl"
          onClick={() =>
            setMobileNav(MobileNav === "hidden" ? "block" : "hidden")
          }
        >
          <FaGripLines />
        </button>
      </nav>

      <div
        className={`${MobileNav} bg-[#2B1812] h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}
      >
        <Link to="/" className="text-[#F3E7C8] text-4xl mb-8">
          {t("home")}
        </Link>
        <Link to="/categories" className="text-[#F3E7C8] text-4xl mb-8">
          {t("category")}
        </Link>
        <Link to="/all-books" className="text-[#F3E7C8] text-4xl mb-8">
          {t("shop")}
        </Link>
        <Link to="/about" className="text-[#F3E7C8] text-4xl mb-8">
          {t("about")}
        </Link>
        <Link to="/contact" className="text-[#F3E7C8] text-4xl mb-8">
          {t("contact")}
        </Link>
      </div>
    </section>
  );
};

export default Navbar;