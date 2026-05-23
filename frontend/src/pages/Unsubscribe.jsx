import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const Unsubscribe = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        const response = await axios.put(
          `http://localhost:1000/api/v1/unsubscribe/${token}`
        );
        setSuccess(true);
        setMessage(response.data.message);
      } catch (error) {
        setSuccess(false);
        setMessage(error.response?.data?.message || "Unsubscribe failed");
      } finally {
        setLoading(false);
      }
    };

    unsubscribe();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#EDE6DA] rounded-xl shadow-md p-8 text-center">
        {loading ? (
          <>
            <h1 className="text-3xl font-semibold text-[#5C3B1E] mb-3">
              Processing
            </h1>
            <p className="text-[#7A5C3E] text-sm">
              Please wait...
            </p>
          </>
        ) : success ? (
          <>
            <h1 className="text-3xl font-semibold text-[#5C3B1E] mb-3">
              Unsubscribed
            </h1>
            <p className="text-[#7A5C3E] text-sm mb-6">{message}</p>
            <Link
              to="/"
              className="inline-block bg-[#C9A24E] text-white rounded px-6 py-3 font-semibold hover:bg-[#B68F3E] transition"
            >
              Back Home
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-[#5C3B1E] mb-3">
              Unsubscribe Failed
            </h1>
            <p className="text-[#7A5C3E] text-sm mb-6">{message}</p>
            <Link
              to="/"
              className="inline-block bg-[#C9A24E] text-white rounded px-6 py-3 font-semibold hover:bg-[#B68F3E] transition"
            >
              Back Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;