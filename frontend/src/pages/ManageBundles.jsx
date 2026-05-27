import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ManageBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [editData, setEditData] = useState({
    title: "",
    image: "",
    description: "",
    books: [],
    discountPercent: "",
  });

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

  const fetchBundles = async () => {
    try {
      const response = await axios.get("https://bookstore-backend-x6dx.onrender.com/api/v1/get-bundles");
      setBundles(response.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load bundles",
        errorToastStyle
      );
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("https://bookstore-backend-x6dx.onrender.com/api/v1/get-all-books");
      setBooks(response.data.data || []);
    } catch (error) {
      console.log("Books fetch error:", error);
      toast.error("Failed to load books", errorToastStyle);
    }
  };

  useEffect(() => {
    fetchBundles();
    fetchBooks();
  }, []);

  const startEdit = (bundle) => {
    setEditingId(bundle._id);
    setSearchTerm("");

    setEditData({
      title: bundle.title || "",
      image: bundle.image || "",
      description: bundle.description || "",
      books: bundle.books?.map((book) => book._id) || [],
      discountPercent: bundle.discountPercent || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSearchTerm("");

    setEditData({
      title: "",
      image: "",
      description: "",
      books: [],
      discountPercent: "",
    });
  };

  const change = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleBookToggle = (bookId) => {
    const alreadySelected = editData.books.includes(bookId);

    if (alreadySelected) {
      setEditData({
        ...editData,
        books: editData.books.filter((id) => id !== bookId),
      });
      return;
    }

    if (editData.books.length >= 5) {
      toast("You can select maximum 5 books for one bundle", errorToastStyle);
      return;
    }

    setEditData({
      ...editData,
      books: [...editData.books, bookId],
    });
  };

  const updateBundle = async (bundleId) => {
    try {
      if (
        editData.title.trim() === "" ||
        editData.description.trim() === "" ||
        editData.books.length < 2
      ) {
        toast(
          "Title, description, and at least 2 books are required",
          errorToastStyle
        );
        return;
      }

      const response = await axios.put(
        `https://bookstore-backend-x6dx.onrender.com/api/v1/update-bundle/${bundleId}`,
        {
          ...editData,
          discountPercent: Number(editData.discountPercent || 0),
        },
        { headers }
      );

      toast.success(response.data.message, toastStyle);
      cancelEdit();
      fetchBundles();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update bundle",
        errorToastStyle
      );
    }
  };

  const deleteBundle = async (id) => {
    try {
      const response = await axios.delete(
        `https://bookstore-backend-x6dx.onrender.com/api/v1/delete-bundle/${id}`,
        { headers }
      );

      toast.success(response.data.message, toastStyle);
      setBundles((prev) => prev.filter((bundle) => bundle._id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete bundle",
        errorToastStyle
      );
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#F5F1E6]">
      <h1 className="text-5xl font-semibold text-[#4A3428] mb-8">
        Manage Bundles
      </h1>

      {bundles.length === 0 ? (
        <div className="p-6 bg-[#FBF7EF] rounded shadow-md border border-[#E4D6BD]">
          <p className="text-[#5A4335]">No bundles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <div
              key={bundle._id}
              className="bg-[#FBF7EF] border border-[#E4D6BD] rounded-[18px] shadow-sm overflow-hidden"
            >
              <div className="h-[220px] bg-[#EFE2D2] overflow-hidden">
                {bundle.image ? (
                  <img
                    src={bundle.image}
                    alt={bundle.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#7B6253]">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-5">
                {editingId === bundle._id ? (
                  <div>
                    <label className="text-[#5A4335] font-medium">
                      Bundle Image
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={editData.image}
                      onChange={change}
                      className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
                    />

                    <label className="block text-[#5A4335] font-medium mt-4">
                      Bundle Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={change}
                      className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
                    />

                    <label className="block text-[#5A4335] font-medium mt-4">
                      Discount Percent
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="discountPercent"
                      value={editData.discountPercent}
                      onChange={change}
                      className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
                    />

                    <label className="block text-[#5A4335] font-medium mt-4">
                      Bundle Description
                    </label>
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={change}
                      rows="4"
                      className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
                    />

                    <label className="block text-[#5A4335] font-medium mt-4">
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
                            checked={editData.books.includes(book._id)}
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
                      Selected: {editData.books.length} / 5 books
                    </p>

                    <div className="flex items-center gap-3 mt-5">
                      <button
                        onClick={() => updateBundle(bundle._id)}
                        className="inline-flex items-center gap-2 bg-[#3B2218] text-[#F5F1E6] rounded px-5 py-3 font-semibold hover:bg-[#5a3a2a] transition"
                      >
                        <FaSave />
                        Save Changes
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-2 bg-[#E8D8C3] text-[#3B2218] rounded px-5 py-3 font-semibold hover:bg-[#D6C4A8] transition"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-serif font-semibold text-[#3B2218]">
                          {bundle.title}
                        </h2>

                        <p className="text-[#6B5748] mt-2 leading-7">
                          {bundle.description}
                        </p>

                        <p className="text-[#8B5E3C] mt-3 text-sm font-semibold">
                          {bundle.books?.length || 0} books included
                        </p>

                        <p className="text-[#8B5E3C] mt-1 text-sm font-semibold">
                          Discount: {bundle.discountPercent || 0}%
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => startEdit(bundle)}
                          className="bg-[#4B2617] text-white p-3 rounded hover:bg-[#3B1D12] transition"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => deleteBundle(bundle._id)}
                          className="bg-[#FF0000] text-white p-3 rounded hover:bg-[#CC0000] transition"
                        >
                          <MdDeleteOutline />
                        </button>
                      </div>
                    </div>

                    {bundle.books && bundle.books.length > 0 && (
                      <div className="mt-5 border-t border-[#E4D6BD] pt-4">
                        <p className="text-[#5A4335] font-semibold mb-2">
                          Books:
                        </p>

                        <ul className="list-disc pl-5 text-[#6B5748] space-y-1">
                          {bundle.books.map((book) => (
                            <li key={book._id}>
                              {book.title} — {book.author}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBundles;