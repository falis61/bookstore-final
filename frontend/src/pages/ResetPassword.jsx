import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [Data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [success, setSuccess] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const passwordStrength = useMemo(() => {
    const password = Data.newPassword;
    if (!password) return null;

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        text: "Weak password",
        color: "text-red-600 bg-red-500",
        width: "33%",
      };
    }

    if (score <= 4) {
      return {
        text: "Medium password",
        color: "text-yellow-600 bg-yellow-500",
        width: "66%",
      };
    }

    return {
      text: "Strong password",
      color: "text-green-600 bg-green-500",
      width: "100%",
    };
  }, [Data.newPassword]);

  const passwordMatch = useMemo(() => {
    if (!Data.confirmPassword) return null;

    if (Data.newPassword === Data.confirmPassword) {
      return { text: "Passwords match ✔", color: "text-green-600" };
    }

    return { text: "Passwords do not match ✖", color: "text-red-600" };
  }, [Data.newPassword, Data.confirmPassword]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/logIn");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const submit = async () => {
    try {
      setTokenError("");

      if (!Data.newPassword || !Data.confirmPassword) {
        toast.error("All fields are required");
        return;
      }

      if (Data.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      if (Data.newPassword !== Data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setLoading(true);

      const response = await axios.put(
        `http://localhost:1000/api/v1/reset-password/${token}`,
        {
          newPassword: Data.newPassword,
          confirmPassword: Data.confirmPassword,
        }
      );

      toast.success(response.data.message);
      setSuccess(true);
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";

      if (message.toLowerCase().includes("invalid or expired token")) {
        setTokenError("This reset link is invalid or has expired.");
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#EDE6DA] rounded-xl shadow-md p-8 text-center">
          <h1 className="text-3xl font-semibold text-[#5C3B1E] mb-3">
            Password Reset Successful
          </h1>
          <p className="text-[#7A5C3E] text-sm mb-4">
            Your password has been updated successfully.
          </p>
          <p className="text-[#7A5C3E] text-sm">
            Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#EDE6DA] rounded-xl shadow-md p-8 text-center">
          <h1 className="text-3xl font-semibold text-[#5C3B1E] mb-3">
            Reset Link Expired
          </h1>
          <p className="text-[#7A5C3E] text-sm mb-6">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>

          <Link
            to="/forgot-password"
            className="inline-block bg-[#3B2218] text-[#FFF8F0] rounded-[12px] px-6 py-3 font-semibold hover:bg-[#2E1A12] transition"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#EDE6DA] rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-semibold text-[#5C3B1E] mb-2 text-center">
          Reset Password
        </h1>

        <p className="text-center text-[#7A5C3E] mb-6 text-sm">
          Enter your new password below.
        </p>

        <div className="space-y-4">
          <div className="relative">
            <label className="text-[#5C3B1E] font-medium">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={Data.newPassword}
              onChange={change}
              placeholder="Enter new password"
              className="w-full mt-2 bg-white text-[#2D1B10] p-3 pr-10 outline-none rounded border border-[#D6C4A8]"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer text-[#6A4A3A]"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {passwordStrength && (
              <div className="mt-2">
                <div className="w-full h-2 bg-[#D6C4A8] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color.split(" ")[1]}`}
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    passwordStrength.color.split(" ")[0]
                  }`}
                >
                  {passwordStrength.text}
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="text-[#5C3B1E] font-medium">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={Data.confirmPassword}
              onChange={change}
              placeholder="Confirm new password"
              className="w-full mt-2 bg-white text-[#2D1B10] p-3 pr-10 outline-none rounded border border-[#D6C4A8]"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 cursor-pointer text-[#6A4A3A]"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {passwordMatch && (
              <p className={`text-sm mt-2 ${passwordMatch.color}`}>
                {passwordMatch.text}
              </p>
            )}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-center text-sm text-[#5C3B1E] mt-4">
            Back to{" "}
            <Link to="/logIn" className="underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;