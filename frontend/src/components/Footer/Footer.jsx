import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import { Feather } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    try {
      if (!email || email.trim() === "") {
        toast.error("Please enter your email");
        return;
      }

      const response = await axios.post(
        "http://localhost:1000/api/v1/subscribe",
        { email }
      );

      toast.success(response.data.message);
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReturnToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#3B2218] text-white rounded-t-[20px] overflow-hidden">
      <div className="px-6 md:px-12 py-12">
        
        {/* TOP BRAND + NEWSLETTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Feather className="text-[#f3e7c8]" size={28} />
              <h2 className="text-2xl font-serif text-[#f3e7c8]">
                BookNest
              </h2>
            </div>

            <p className="text-[#dcc7ae] text-sm leading-6 max-w-md">
              A warm and thoughtful space for readers to explore stories,
              discover knowledge, and enjoy the comfort that books bring.
            </p>
          </div>

          <div className="md:text-right">
            <h3 className="text-lg font-semibold text-[#f3e7c8] mb-3">
              Stay Connected
            </h3>

            <div className="flex md:justify-end">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-full bg-[#f3e7c8] text-[#3B2218] outline-none text-sm w-[200px]"
              />
              <button
                onClick={handleSubscribe}
                className="px-5 py-2 bg-[#C5A059] text-[#1A1110] rounded-r-full text-sm font-semibold hover:scale-105 transition"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* MAIN LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-start">

          {/* DISCOVER */}
          <div>
            <h3 className="text-lg font-semibold text-[#f3e7c8] mb-4">
              Discover
            </h3>
            <ul className="space-y-2 text-sm text-[#dcc7ae]">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/all-books">Books</Link></li>
              <li><Link to="/search?type=authors">Authors</Link></li>
              <li><Link to="/subjects">Subjects</Link></li>
              <li><Link to="/categories">Collections</Link></li>
              <li>
                <button onClick={handleReturnToTop}>
                  Return to Top
                </button>
              </li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="text-lg font-semibold text-[#f3e7c8] mb-4">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-[#dcc7ae]">
              <li><Link to="/category/novel">Novel</Link></li>
              <li><Link to="/category/romance">Romance</Link></li>
              <li><Link to="/category/education">Education</Link></li>
              <li><Link to="/category/technology">Technology</Link></li>
              <li><Link to="/category/islamic">Islamic</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="text-lg font-semibold text-[#f3e7c8] mb-4">
              Help
            </h3>
            <ul className="space-y-2 text-sm text-[#dcc7ae]">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/profile">Account</Link></li>
              <li><Link to="/profile/add-book">Add a Book</Link></li>
              <li><Link to="/logIn">Login</Link></li>
            </ul>
          </div>

          {/* LANGUAGE */}
          <div>
            <h3 className="text-lg font-semibold text-[#f3e7c8] mb-4">
              Change Website Language
            </h3>
            <ul className="space-y-2 text-sm text-[#dcc7ae]">
              <li><button>English (en)</button></li>
              <li><button>العربية (ar)</button></li>
              <li><button>Français (fr)</button></li>
              <li><button>Deutsch (de)</button></li>
              <li><button>Español (es)</button></li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="lg:text-right">
            <h3 className="text-lg font-semibold text-[#f3e7c8] mb-4">
              Follow Us
            </h3>

            <div className="flex lg:justify-end gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#f3e7c8] text-[#4a1f0f] flex items-center justify-center">
                <FaFacebookF />
              </div>
              <div className="w-9 h-9 rounded-full bg-[#f3e7c8] text-[#4a1f0f] flex items-center justify-center">
                <FaTwitter />
              </div>
              <div className="w-9 h-9 rounded-full bg-[#f3e7c8] text-[#4a1f0f] flex items-center justify-center">
                <FaInstagram />
              </div>
              <div className="w-9 h-9 rounded-full bg-[#f3e7c8] text-[#4a1f0f] flex items-center justify-center">
                <FaGithub />
              </div>
            </div>

            <p className="text-sm text-[#dcc7ae]">
              Follow BookNest for updates and new arrivals.
            </p>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-[#7a4128] mt-10 pt-5 flex flex-col md:flex-row justify-between items-center text-xs text-[#d0b79e]">
          <p>© 2026 BookNest. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Crafted with ❤️ for book lovers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;