import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [Data, setData] = useState({
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      if (Data.email === "") {
        toast.error("Email is required");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/forgot-password",
        {
          email: Data.email,
        }
      );

      toast.success(response.data.message);
      navigate("/logIn");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#FCF9F4] border border-[#E7DCCD] rounded-[18px] shadow-[0_8px_24px_rgba(90,64,50,0.08)] p-8">
        <h1 className="text-3xl font-serif text-[#6A4A3A] mb-2 text-center">
          Forgot Password
        </h1>

        <p className="text-center text-[#6A4A3A] mb-6 text-sm">
          Enter your email and we will send you a password reset link if your
          account exists.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-[#6A4A3A] font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={Data.email}
              onChange={change}
              placeholder="Enter your email"
              className="w-full mt-2 bg-[#F8F4EC] text-[#2D1B10] p-3 outline-none rounded-[12px] border border-[#E7DCCD]"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className={`w-full mt-4 text-[#FFF8F0] py-3 rounded-[12px] font-semibold transition ${
              loading
                ? "bg-[#6B564C] cursor-not-allowed"
                : "bg-[#3B2218] hover:bg-[#2E1A12]"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-sm text-[#6A4A3A] mt-4">
            Remember your password?{" "}
            <Link to="/logIn" className="underline font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;