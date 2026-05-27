import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditAuthor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [Data, setData] = useState({
    name: "",
    image: "",
    born: "",
    died: "",
    nationality: "",
    genre: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

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
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(
          `https://bookstore-backend-x6dx.onrender.com/api/v1/get-author-by-id/${id}`,
          { headers }
        );

        setData({
          name: response.data.data.name || "",
          image: response.data.data.image || "",
          born: response.data.data.born || "",
          died: response.data.data.died || "",
          nationality: response.data.data.nationality || "",
          genre: response.data.data.genre || "",
          description: response.data.data.description || "",
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load author",
          errorToastStyle
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  const submit = async () => {
    try {
      if (Data.name === "" || Data.description === "") {
        toast("Name and description are required", toastStyle);
        return;
      }

      const response = await axios.put(
        `https://bookstore-backend-x6dx.onrender.com/api/v1/update-author/${id}`,
        Data,
        { headers }
      );

      toast.success(response.data.message, toastStyle);
      navigate("/profile/manage-authors");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong",
        errorToastStyle
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-[#F5F1E6]">
        <h1 className="text-5xl font-semibold text-[#4A3428] mb-8">
          Edit Author
        </h1>
        <div className="p-6 bg-[#FBF7EF] rounded shadow-md w-full border border-[#E4D6BD]">
          <p className="text-[#5A4335]">Loading author...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5F1E6]">
      <h1 className="text-5xl font-semibold text-[#4A3428] mb-8">
        Edit Author
      </h1>

      <div className="p-6 bg-[#FBF7EF] rounded shadow-md w-full border border-[#E4D6BD]">
        <div>
          <label className="text-[#5A4335] font-medium">Author Image</label>
          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="image url"
            name="image"
            value={Data.image}
            onChange={change}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">Author Name</label>
          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="author name"
            name="name"
            value={Data.name}
            onChange={change}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">Birth Year</label>
          <input
            type="text"
            className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
            placeholder="e.g. 1977"
            name="born"
            value={Data.born}
            onChange={change}
          />
        </div>

        <div className="mt-4">
          <label className="text-[#5A4335] font-medium">Death Year</label>
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
  </select>
</div>

        {/* GENRE */}
<div className="mt-4">
  <label className="text-[#5A4335] font-medium">
    Genre
  </label>

  <select
    name="genre"
    value={Data.genre}
    onChange={change}
    className="w-full mt-2 bg-white text-[#2D1B10] p-3 outline-none rounded border border-[#D6C4A8]"
  >
    <option value="">Select Genre</option>
    <option value="Poetry">Poetry</option>
    <option value="Fiction">Fiction</option>
    <option value="Romance">Romance</option>
    <option value="Mystery">Mystery</option>
    <option value="Thriller">Thriller</option>
    <option value="Fantasy">Fantasy</option>
    <option value="Science Fiction">Science Fiction</option>
    <option value="Historical Fiction">Historical Fiction</option>
    <option value="Biography">Biography</option>
    <option value="Philosophy">Philosophy</option>
    <option value="Psychology">Psychology</option>
    <option value="Children's Literature">Children's Literature</option>
    <option value="Self Help">Self Help</option>
    <option value="Technology">Technology</option>
    <option value="Islamic">Islamic</option>
  </select>
</div>
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
          Update Author
        </button>
      </div>
    </div>
  );
};

export default EditAuthor;