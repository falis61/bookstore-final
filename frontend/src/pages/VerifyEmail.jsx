import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `https://bookstore-backend-x6dx.onrender.com/api/v1/verify-email/${token}`
        );

        setSuccess(true);
        setMessage(response.data.message);
      } catch (error) {
        setSuccess(false);
        setMessage(error.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#EDE6DA] rounded-xl shadow-md p-8 text-center">
        {loading ? (
          <>
            <h1 className="text-3xl font-semibold text-[#5C3B1E] mb-3">
              Verifying Email
            </h1>
            <p className="text-[#7A5C3E] text-sm">
              Please wait while we verify your email...
            </p>
          </>
        ) : success ? (
          <>
            <h1 className="text-3xl font-semibold text-[#5C3B1E] mb-3">
              Email Verified
            </h1>
            <p className="text-[#7A5C3E] text-sm mb-6">{message}</p>
            <Link
              to="/logIn"
              className="inline-block bg-[#C9A24E] text-white rounded px-6 py-3 font-semibold hover:bg-[#B68F3E] transition"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-[#5C3B1E] mb-3">
              Verification Failed
            </h1>
            <p className="text-[#7A5C3E] text-sm mb-6">{message}</p>
            <Link
              to="/signUp"
              className="inline-block bg-[#C9A24E] text-white rounded px-6 py-3 font-semibold hover:bg-[#B68F3E] transition"
            >
              Back to Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;