import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddAuthor = () => {
  const [Data, setData] = useState({
    name: "",
    image: "",
    born: "",
    died: "",
    nationality: "",
    genre: "",
    description: "",
  });

  const [savedBookAuthors, setSavedBookAuthors] = useState([]);

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
    const fetchBookAuthors = async () => {
      try {
        const res = await axios.get("https://bookstore-backend-x6dx.onrender.com/api/v1/get-all-books");
        const books = res.data.data || [];

        const uniqueAuthors = [
          ...new Set(
            books
              .map((book) => book.author?.trim())
              .filter((author) => author && author !== "")
          ),
        ];

        setSavedBookAuthors(uniqueAuthors.sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.log("Book authors fetch error:", error);
      }
    };

    fetchBookAuthors();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      if (Data.name === "" || Data.description === "") {
        toast("Name and description are required", toastStyle);
        return;
      }

      const response = await axios.post(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/add-author",
        Data,
        { headers }
      );

      setData({
        name: "",
        image: "",
        born: "",
        died: "",
        nationality: "",
        genre: "",
        description: "",
      });

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
        Add Author
      </h1>

      <div className="p-6 bg-[#FBF7EF] rounded shadow-md w-full border border-[#E4D6BD]">
        {/* IMAGE */}
        <div>
          <label className="text-[#5A4335] font-medium">
            Author Image
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="image url"
            name="image"
            value={Data.image}
            onChange={change}
          />
        </div>

        {/* NAME */}
        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Select Author From Saved Book Authors
          </label>

          <select
            name="name"
            value={Data.name}
            onChange={change}
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
          >
            <option value="">Select saved author</option>
            {savedBookAuthors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>

          <p className="text-sm text-[#6B5748] mt-2">
            Or type the author name manually below.
          </p>

          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="author name"
            name="name"
            value={Data.name}
            onChange={change}
          />
        </div>

        {/* BORN */}
        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Birth Year
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="e.g. 1977"
            name="born"
            value={Data.born}
            onChange={change}
          />
        </div>

        {/* DIED */}
        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Death Year
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="leave empty if alive"
            name="died"
            value={Data.died}
            onChange={change}
          />
        </div>

        {/* NATIONALITY */}
        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Nationality
          </label>

          <select
            name="nationality"
            value={Data.nationality}
            onChange={change}
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
          >
            <option value="">Select Nationality</option>
            <option value="American">American</option>
            <option value="British">British</option>
            <option value="Canadian">Canadian</option>
            <option value="Turkish">Turkish</option>
            <option value="Somali">Somali</option>
            <option value="Indian">Indian</option>
            <option value="Swedish">Swedish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Spanish">Spanish</option>
            <option value="Russian">Russian</option>
            <option value="Egyptian">Egyptian</option>
            <option value="Nigerian">Nigerian</option>
            <option value="Pakistani">Pakistani</option>
            <option value="Iranian">Iranian</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Brazilian">Brazilian</option>
            <option value="Mexican">Mexican</option>
            <option value="Roman">Roman</option>
            <option value="Irish">Irish</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">
            Author Description
          </label>
          <textarea
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            rows="5"
            placeholder="short description about the author"
            name="description"
            value={Data.description}
            onChange={change}
          />
        </div>

        <button
          className="mt-6 bg-[#3B2218] text-[#F5F1E6] rounded px-6 py-3 font-semibold hover:bg-[#5a3a2a] transition"
          onClick={submit}
        >
          Add Author
        </button>
      </div>
    </div>
  );
};

export default AddAuthor;