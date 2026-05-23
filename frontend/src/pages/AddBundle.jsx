import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddBundle = () => {
  const [Data, setData] = useState({
    title: "",
    image: "",
    description: "",
    books: [],
    discountPercent: "",
  });

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:1000/api/v1/get-all-books");
        setBooks(res.data.data || []);
      } catch (error) {
        console.log("Books fetch error:", error);
      }
    };

    fetchBooks();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  // checkbox multi-select (no ctrl needed)
  const handleBookToggle = (bookId) => {
    const alreadySelected = Data.books.includes(bookId);

    if (alreadySelected) {
      setData({
        ...Data,
        books: Data.books.filter((id) => id !== bookId),
      });
    } else {
      setData({
        ...Data,
        books: [...Data.books, bookId],
      });
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submit = async () => {
    try {
      if (
        Data.title === "" ||
        Data.description === "" ||
        Data.books.length < 2
      ) {
        toast(
          "Title, description, and at least 2 books are required",
          toastStyle
        );
        return;
      }

      const response = await axios.post(
        "http://localhost:1000/api/v1/add-bundle",
        {
          ...Data,
          discountPercent: Number(Data.discountPercent || 0),
        },
        { headers }
      );

      setData({
        title: "",
        image: "",
        description: "",
        books: [],
        discountPercent: "",
      });

      setSearchTerm("");

      toast.success(response.data.message, toastStyle);
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
        Add Bundle
      </h1>

      <div className="p-6 bg-[#FBF7EF] rounded shadow-md w-full border border-[#E4D6BD]">

        <div>
          <label className="text-[#5A4335] font-medium">
            Bundle Image
          </label>

          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="bundle image url"
            name="image"
            value={Data.image}
            onChange={change}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Bundle Title
          </label>

          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="e.g. Stoicism Bundle"
            name="title"
            value={Data.title}
            onChange={change}
          />
        </div>

        {/* UPDATED BOOK SELECTION */}
        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Select Books
          </label>

          <input
            type="text"
            placeholder="Search books, authors, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mt-2 mb-3 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
          />

          <div className="h-72 overflow-y-auto border border-[#D6C4A8] rounded bg-white p-4 space-y-3">
            {filteredBooks.map((book) => (
              <label
                key={book._id}
                className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-[#F8F2E7] transition"
              >
                <input
                  type="checkbox"
                  checked={Data.books.includes(book._id)}
                  onChange={() => handleBookToggle(book._id)}
                  className="mt-1 accent-[#C5A059]"
                />

                <div>
                  <p className="text-[#2D1B10] font-medium">
                    {book.title}
                  </p>

                  <p className="text-sm text-[#6B5748]">
                    {book.author}
                    {book.category && ` • ${book.category}`}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <p className="text-sm text-[#6B5748] mt-2">
            Selected: {Data.books.length} books
          </p>
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Discount Percent
          </label>

          <input
            type="number"
            min="0"
            max="100"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="e.g. 15"
            name="discountPercent"
            value={Data.discountPercent}
            onChange={change}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Bundle Description
          </label>

          <textarea
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            rows="5"
            placeholder="short description about this bundle"
            name="description"
            value={Data.description}
            onChange={change}
          />
        </div>

        <button
          className="mt-6 bg-[#3B2218] text-[#F5F1E6] rounded px-6 py-3 font-semibold hover:bg-[#5a3a2a] transition"
          onClick={submit}
        >
          Add Bundle
        </button>
      </div>
    </div>
  );
};

export default AddBundle;