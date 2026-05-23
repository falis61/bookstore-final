import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddBook = () => {
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    originalPrice: "",
    stock: "",
    desc: "",
    language: "",
    category: [],
    popular: false,
    trending: false,
    classic: false,
    booksWeLove: false,
  });

  const [authors, setAuthors] = useState([]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
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

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1000/api/v1/get-all-authors",
          { headers }
        );
        setAuthors(res.data.data || []);
      } catch (error) {
        console.log("Author fetch error:", error);
      }
    };

    fetchAuthors();
  }, []);

   const toggleCategory = (categoryName) => {
  if (Data.category.includes(categoryName)) {
    setData({
      ...Data,
      category: Data.category.filter((item) => item !== categoryName),
    });
  } else {
    setData({
      ...Data,
      category: [...Data.category, categoryName],
    });
  }
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
        Data.category.length === 0
      ) {
        toast("All fields are required", toastStyle);
      } else {
        const response = await axios.post(
          "http://localhost:1000/api/v1/add-book",
          {
            ...Data,
            category: Data.category.join(", "),
            price: Number(Data.price),
            originalPrice: Number(Data.originalPrice || 0),
            stock: Number(Data.stock),
          },
          { headers }
        );

        setData({
          url: "",
          title: "",
          author: "",
          price: "",
          originalPrice: "",
          stock: "",
          desc: "",
          language: "",
          category: [],
          popular: false,
          trending: false,
          classic: false,
          booksWeLove: false,
        });

        toast.success(response.data.message, toastStyle);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong",
        errorToastStyle
      );
    }
  };

  return (
    <div className="w-full bg-[#F5F1E6]">
      <h1 className="text-5xl font-semibold text-[#4A3428] mb-8">
        Add Book
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

          <select
            name="author"
            value={authors.some((author) => author.name === Data.author) ? Data.author : ""}
            onChange={change}
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            required
          >
            <option value="">Select author</option>
            {authors.map((author) => (
              <option key={author._id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>

          <p className="text-sm text-[#6B5748] mt-2">
            Or type the author name manually below.
          </p>

          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="type author name manually"
            name="author"
            required
            value={Data.author}
            onChange={change}
          />
        </div>

        <div className="mt-4">
  <label className="text-[#5A4335] font-medium">
    Categories
  </label>

  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 bg-white p-4 rounded border border-[#D6C4A8]">

    {[
      "novel",
      "romance",
      "fantasy",
      "mystery",
      "thriller",
      "horror",
      "children",
      "young-adult",
      "history",
      "biography",
      "cookbooks",
      "science",
      "travel",
      "business",
      "technology",
      "cybersecurity",
      "programming",
      "artificial intelligence",
      "machine learning",
      "data science",
      "networking",
      "software engineering",
      "web development",
      "database",
      "poetry",
      "short stories",
      "classic",
      "crime",
      "education",
      "islamic",
      "psychology",
      "spiratuality",
      "philosophy"
    ].map((cat) => (
      <label
        key={cat}
        className="flex items-center gap-3 text-[#3B2218] cursor-pointer"
      >
        <input
          type="checkbox"
          checked={Data.category.includes(cat)}
          onChange={() => toggleCategory(cat)}
          className="w-4 h-4 accent-[#C5A059]"
        />

        <span className="capitalize">
          {cat.replace("-", " ")}
        </span>
      </label>
    ))}

  </div>

  <p className="text-sm text-[#6B5748] mt-2">
    Select any categories you want — no Ctrl key needed.
  </p>
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
          Add Book
        </button>
      </div>
    </div>
  );
};

export default AddBook;