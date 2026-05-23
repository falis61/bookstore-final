import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManageAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-all-authors",
        { headers }
      );
      setAuthors(response.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load authors",
        errorToastStyle
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleEdit = (authorId) => {
    navigate(`/profile/edit-author/${authorId}`);
  };

  const confirmDelete = (authorId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <span className="font-medium">Delete this author?</span>

          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleDelete(authorId);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Yes
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-[#E6C89A] text-[#3B2218] px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      toastStyle
    );
  };

  const handleDelete = async (authorId) => {
    try {
      const response = await axios.delete(
        `http://localhost:1000/api/v1/delete-author/${authorId}`,
        { headers }
      );

      toast.success(response.data.message, toastStyle);
      fetchAuthors();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete author",
        errorToastStyle
      );
    }
  };

  return (
    <div className="w-full bg-[#F5F1E6]">
      <h1 className="text-5xl font-semibold text-[#4A3428] mb-8">
        Manage Authors
      </h1>

      <div className="p-6 bg-[#FBF7EF] rounded shadow-md w-full border border-[#E4D6BD]">
        {loading ? (
          <p className="text-[#5A4335]">Loading authors...</p>
        ) : authors.length === 0 ? (
          <p className="text-[#5A4335]">No authors found.</p>
        ) : (
          <div className="space-y-4">
            {authors.map((author) => (
              <div
                key={author._id}
                className="border border-[#D6C4A8] rounded p-4 bg-white flex flex-col md:flex-row md:items-start gap-4"
              >
                <div className="w-full md:w-[110px] h-[140px] bg-[#F5F1E6] rounded overflow-hidden border border-[#D6C4A8] flex items-center justify-center">
                  {author.image ? (
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#7B6253] text-sm">No Image</span>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-[#4A3428]">
                    {author.name}
                  </h2>

                  <p className="text-[#7B6253] mt-1">
                    {author.born || "?"}
                    {author.died
                      ? ` - ${author.died}`
                      : author.born
                      ? " -"
                      : ""}
                  </p>

                  {(author.nationality || author.genre) && (
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      {author.nationality && (
                        <span className="bg-[#F5F1E6] text-[#5A4335] border border-[#D6C4A8] rounded-full px-3 py-1">
                          Nationality: {author.nationality}
                        </span>
                      )}

                      {author.genre && (
                        <span className="bg-[#F5F1E6] text-[#5A4335] border border-[#D6C4A8] rounded-full px-3 py-1">
                          Genre: {author.genre}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-[#5A4335] mt-3 leading-7">
                    {author.description}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(author._id)}
                      className="bg-[#3B2218] text-[#F5F1E6] rounded px-5 py-2 font-semibold hover:bg-[#5a3a2a] transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => confirmDelete(author._id)}
                      className="bg-red-600 text-white rounded px-5 py-2 font-semibold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAuthors;