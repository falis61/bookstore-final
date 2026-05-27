import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserPlus, FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const toastStyle = {
    style: {
      background: "#6A4A3A",
      color: "#FFF8F0",
      border: "1px solid #D2B07A",
    },
  };

  const errorToastStyle = {
    style: {
      background: "#6A4A3A",
      color: "#FFF8F0",
      border: "1px solid #C95A5A",
    },
  };

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const passwordsMismatch =
    values.confirmPassword !== "" && values.password !== values.confirmPassword;

  const submit = async () => {
    try {
      if (
        values.username === "" ||
        values.email === "" ||
        values.password === "" ||
        values.confirmPassword === ""
      ) {
        toast("All fields are required", toastStyle);
      } else if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match", errorToastStyle);
      } else {
        const response = await axios.post(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/sign-up",
          {
            username: values.username,
            email: values.email,
            password: values.password,
          }
        );
        toast.success(response.data.message, toastStyle);
        navigate("/logIn");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Sign up failed",
        errorToastStyle
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-[#FCF9F4] border border-[#E7DCCD] rounded-[18px] shadow-[0_8px_24px_rgba(90,64,50,0.08)] p-6 md:p-8">
        <div className="mb-7 flex items-center gap-4">
          <h1 className="text-3xl md:text-[44px] font-serif text-[#6A4A3A] leading-[1]">
            SIGNUP
          </h1>
        </div>

        <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaUserPlus className="text-[#8A674F] text-lg md:text-xl" />
            <h2 className="text-[24px] md:text-[28px] font-semibold text-[#5A4032]">
              REGISTER A NEW ACCOUNT
            </h2>
          </div>

          <div className="h-[2px] bg-[#E7DCCD] mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div>
              <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={values.username}
                onChange={change}
                className="w-full h-11 md:h-12 px-4 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] outline-none text-[#5A4032] placeholder:text-[#8B6D5A] focus:outline-none focus:ring-2 focus:ring-[#D2B07A] focus:border-[#D2B07A]"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={values.email}
                onChange={change}
                className="w-full h-11 md:h-12 px-4 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] outline-none text-[#5A4032] placeholder:text-[#8B6D5A] focus:outline-none focus:ring-2 focus:ring-[#D2B07A] focus:border-[#D2B07A]"
                placeholder="Email"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={change}
                className="w-full h-11 md:h-12 px-4 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] outline-none text-[#5A4032] placeholder:text-[#8B6D5A] focus:outline-none focus:ring-2 focus:ring-[#D2B07A] focus:border-[#D2B07A]"
                placeholder="Password"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={change}
                className={`w-full h-11 md:h-12 px-4 bg-[#F8F4EC] border rounded-[12px] outline-none text-[#5A4032] placeholder:text-[#8B6D5A] focus:outline-none focus:ring-2 ${
                  passwordsMismatch
                    ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                    : "border-[#E7DCCD] focus:ring-[#D2B07A] focus:border-[#D2B07A]"
                }`}
                placeholder="Enter your password again"
              />
              {passwordsMismatch && (
                <p className="mt-2 text-sm text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={submit}
              className="w-full mt-6 bg-[#3B2218] text-[#FFF8F0] py-3 rounded-[12px]"
            >
              SIGNUP
            </button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[2px] bg-[#E7DCCD]"></div>
            <p className="text-[#6A4A3A] text-base md:text-lg whitespace-nowrap">
              or login with:
            </p>
            <div className="flex-1 h-[2px] bg-[#E7DCCD]"></div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="w-14 h-14 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] flex items-center justify-center shadow-sm hover:bg-[#F3EEE5] transition">
              <FcGoogle className="text-3xl" />
            </button>

            <button className="w-14 h-14 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] flex items-center justify-center shadow-sm hover:bg-[#F3EEE5] transition">
              <FaFacebookF className="text-3xl text-[#1877F2]" />
            </button>

            <button className="w-14 h-14 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] flex items-center justify-center shadow-sm hover:bg-[#F3EEE5] transition">
              <FaApple className="text-3xl text-black" />
            </button>
          </div>

          <p className="mt-6 text-center text-[#6A4A3A] text-sm md:text-base">
            Already have an account?{" "}
            <Link
              to="/logIn"
              className="underline font-semibold hover:text-[#5C4032]"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;