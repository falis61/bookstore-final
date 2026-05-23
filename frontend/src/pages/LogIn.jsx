import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../Store/auth";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaSignInAlt, FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

// ✅ small safe addition (no removal, just improves behavior)
provider.setCustomParameters({
  prompt: "select_account",
});

const Login = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(true);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const syncAutofill = () => {
      const autofilledUsername = usernameRef.current?.value || "";
      const autofilledPassword = passwordRef.current?.value || "";

      if (autofilledUsername || autofilledPassword) {
        setValues({
          username: autofilledUsername,
          password: autofilledPassword,
        });
      }
    };

    const timer = setTimeout(syncAutofill, 300);
    return () => clearTimeout(timer);
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const submit = async (e) => {
    if (e) e.preventDefault();

    try {
      if (values.username === "" || values.password === "") {
        toast("All fields are required", toastStyle);
      } else {
        const response = await axios.post(
          "http://localhost:1000/api/v1/sign-in",
          values
        );

        dispatch(authActions.login());
        dispatch(authActions.ChangeRole(response.data.role));

        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem("id", response.data.id);
        storage.setItem("token", response.data.token);
        storage.setItem("role", response.data.role);

        if (rememberMe) {
          sessionStorage.removeItem("id");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("role");
        } else {
          localStorage.removeItem("id");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }

        toast.success("Login successful", toastStyle);
        navigate("/profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed",
        errorToastStyle
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await axios.post(
        "http://localhost:1000/api/v1/google-sign-in",
        {
          token: idToken,
        }
      );

      dispatch(authActions.login());
      dispatch(authActions.ChangeRole(response.data.role));

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("id", response.data.id);
      storage.setItem("token", response.data.token);
      storage.setItem("role", response.data.role);

      if (rememberMe) {
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
      } else {
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }

      toast.success("Google login successful", toastStyle);
      navigate("/profile");
    } catch (error) {
      // ✅ improved debug (no removal, just added logs + better message)
      console.log("GOOGLE LOGIN FRONTEND ERROR:", error);
      console.log("GOOGLE LOGIN RESPONSE:", error?.response?.data);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Google login failed",
        errorToastStyle
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-[#FCF9F4] border border-[#E7DCCD] rounded-[18px] shadow-[0_8px_24px_rgba(90,64,50,0.08)] p-6 md:p-8">
        <h1 className="text-3xl md:text-[44px] font-serif text-[#6A4A3A] mb-6">
          LOGIN
        </h1>

        <form onSubmit={submit} autoComplete="on">
          <div className="space-y-4">
            <input
              ref={usernameRef}
              type="text"
              name="username"
              value={values.username}
              onChange={change}
              autoComplete="username"
              placeholder="Enter your email or username"
              className="w-full h-12 px-4 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px]"
            />

            <input
              ref={passwordRef}
              type="password"
              name="password"
              value={values.password}
              onChange={change}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full h-12 px-4 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px]"
            />

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm text-[#6A4A3A]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="accent-[#6A4A3A]"
                />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-[#6A4A3A] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#3B2218] text-[#FFF8F0] py-3 rounded-[12px]"
          >
            LOGIN
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-[2px] bg-[#E7DCCD]"></div>
          <p className="text-[#6A4A3A]">or login with:</p>
          <div className="flex-1 h-[2px] bg-[#E7DCCD]"></div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoogleLogin}
            className="w-14 h-14 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] flex items-center justify-center"
          >
            <FcGoogle className="text-3xl" />
          </button>

          <button className="w-14 h-14 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] flex items-center justify-center">
            <FaFacebookF />
          </button>

          <button className="w-14 h-14 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] flex items-center justify-center">
            <FaApple />
          </button>
        </div>

        <p className="mt-6 text-center text-[#6A4A3A]">
          Don’t have an account?{" "}
          <Link to="/signUp" className="underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;