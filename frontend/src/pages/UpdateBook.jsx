import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    originalPrice: "",
    stock: "",
    desc: "",
    language: "",
    category: "",
    popular: false,
    trending: false,
    classic: false,
    booksWeLove: false,
  });

  const headers = {
    id: getStoredItem("id"),
    authorization: `Bearer ${getStoredItem("token")}`,
    bookid: id,
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

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      if (
        Data.url === "" ||
        Data.title === "" ||
        Data.author === "" ||
        Data.price === "" ||
        Data.stock === "" ||
        Data.desc === "" ||
        Data.language === "" ||
        Data.category === ""
      ) {
        toast("All fields are required", toastStyle);
      } else {
        const response = await axios.put(
          "http://localhost:1000/api/v1/update-book",
          {
            ...Data,
            price: Number(Data.price),
            originalPrice: Number(Data.originalPrice || 0),
            stock: Number(Data.stock),
          },
          { headers }
        );

        toast.success(response.data.message, toastStyle);
        navigate(`/view-book-details/${id}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong",
        errorToastStyle
      );
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v1/get-book-by-id/${id}`
        );
        setData({
          url: response.data.data.url || "",
          title: response.data.data.title || "",
          author: response.data.data.author || "",
          price: response.data.data.price ?? "",
          originalPrice: response.data.data.originalPrice ?? "",
          stock: response.data.data.stock ?? "",
          desc: response.data.data.desc || "",
          language: response.data.data.language || "",
          category: response.data.data.category || "",
          popular: response.data.data.popular || false,
          trending: response.data.data.trending || false,
          classic: response.data.data.classic || false,
          booksWeLove: response.data.data.booksWeLove || false,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, [id]);

  return (
    <div className="bg-[#F5F1E6] w-full py-4">
      <h1 className="text-4xl md:text-5xl font-semibold text-[#4A3428] mb-8">
        Update Book
      </h1>

      <div className="p-6 bg-[#FBF7EF] rounded shadow-md w-full border border-[#E4D6BD]">
        <div>
          <label className="text-[#5A4335] font-medium">Image</label>
          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="url of image"
            name="url"
            required
            value={Data.url}
            onChange={change}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">Title of book</label>
          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="title of book"
            name="title"
            required
            value={Data.title}
            onChange={change}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">Author of book</label>
          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="author of book"
            name="author"
            required
            value={Data.author}
            onChange={change}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">Category</label>
          <select
            name="category"
            value={Data.category}
            onChange={change}
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            required
          >
            <option value="">Select category</option>
            <option value="novel">Novel</option>
            <option value="romance">Romance</option>
            <option value="fantasy">Fantasy</option>
            <option value="mystery">Mystery</option>
            <option value="thriller">Thriller</option>
            <option value="horror">Horror</option>
            <option value="children">Children</option>
            <option value="young-adult">Young Adult</option>
            <option value="history">History</option>
            <option value="biography">Biography</option>
            <option value="cookbooks">Cookbooks</option>
            <option value="science">Science</option>
            <option value="travel">Travel</option>
            <option value="business">Business</option>
            <option value="technology">Technology</option>
            <option value="education">Education</option>
            <option value="islamic">Islamic</option>
          </select>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="w-3/6">
            <label className="text-[#5A4335] font-medium">Language</label>
            <input
              type="text"
              className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
              placeholder="language of book"
              name="language"
              required
              value={Data.language}
              onChange={change}
            />
          </div>

          <div className="w-3/6">
            <label className="text-[#5A4335] font-medium">Price</label>
            <input
              type="number"
              className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
              placeholder="price of book"
              name="price"
              required
              value={Data.price}
              onChange={change}
              onWheel={(e) => e.target.blur()}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Original Price (Optional)
          </label>
          <input
            type="number"
            min="0"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="original price before discount"
            name="originalPrice"
            value={Data.originalPrice}
            onChange={change}
            onWheel={(e) => e.target.blur()}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">Stock Quantity</label>
          <input
            type="number"
            min="0"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="available stock"
            name="stock"
            required
            value={Data.stock}
            onChange={change}
            onWheel={(e) => e.target.blur()}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Description of book
          </label>
          <textarea
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            rows="5"
            placeholder="description of book"
            name="desc"
            required
            value={Data.desc}
            onChange={change}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            name="popular"
            checked={Data.popular}
            onChange={(e) =>
              setData({ ...Data, popular: e.target.checked })
            }
            className="w-4 h-4 accent-[#C5A059]"
          />
          <label className="text-[#5A4335] font-medium">
            Mark as Popular Book
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            name="trending"
            checked={Data.trending}
            onChange={(e) =>
              setData({ ...Data, trending: e.target.checked })
            }
            className="w-4 h-4 accent-[#C5A059]"
          />
          <label className="text-[#5A4335] font-medium">
            Mark as Trending Book
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            name="classic"
            checked={Data.classic}
            onChange={(e) =>
              setData({ ...Data, classic: e.target.checked })
            }
            className="w-4 h-4 accent-[#C5A059]"
          />
          <label className="text-[#5A4335] font-medium">
            Mark as Classic Book
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            name="booksWeLove"
            checked={Data.booksWeLove}
            onChange={(e) =>
              setData({ ...Data, booksWeLove: e.target.checked })
            }
            className="w-4 h-4 accent-[#C5A059]"
          />
          <label className="text-[#5A4335] font-medium">
            Mark as Books We Love
          </label>
        </div>

        <button
          className="mt-6 bg-[#3B2218] text-[#F5F1E6] rounded px-6 py-3 font-semibold hover:bg-[#5a3a2a] transition"
          onClick={submit}
        >
          Update Book
        </button>
      </div>
    </div>
  );
};

export default UpdateBook;