import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/home";
import AboutUs from "./pages/AboutUs";
import Footer from "./components/Footer/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import AllBooks from "./pages/AllBooks";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ViewBookDetails from "./components/ViewBookDetails/ViewBookDetails";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./Store/auth";
import PersonalInfo from "./components/Profile/PersonalInfo";
import Address from "./components/Profile/Address";
import Favourites from "./components/Profile/Favourites";
import UserOrderHistory from "./components/Profile/UserOrderHistory";
import Settings from "./components/Profile/Setting";
import AllOrders from "./pages/AllOrders";
import AddBook from "./pages/AddBook";
import AddAuthor from "./pages/AddAuthor";
import UpdateBook from "./pages/UpdateBook";
import Categories from "./pages/Categories";
import CategoryBooks from "./pages/CategoryBooks";
import Contact from "./pages/Contact";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AllUsers from "./pages/AllUsers";
import axios from "axios";
import VerifyEmail from "./pages/VerifyEmail";
import Unsubscribe from "./pages/Unsubscribe";
import Search from "./pages/Search";
import ManageAuthors from "./pages/ManageAuthors";
import EditAuthor from "./pages/EditAuthor";
import AuthorDetails from "./pages/AuthorDetails";
import Subjects from "./pages/Subjects";
import ScrollToTop from "./components/ScrollToTop";
import BundleDetails from "./pages/BundleDetails";
import AddBundle from "./pages/AddBundle";
import ManageBundles from "./pages/ManageBundles";
import Deals from "./pages/Deals";
import Bundles from "./pages/Bundles";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const id = getStoredItem("id");
        const token = getStoredItem("token");

        if (!id || !token || role !== "user") {
          dispatch(authActions.setFavourites([]));
          return;
        }

        const res = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-favourite-books",
          {
            headers: {
              id,
              authorization: `Bearer ${token}`,
            },
          }
        );

        const favIds = res.data.data.map((book) => book._id);
        dispatch(authActions.setFavourites(favIds));
      } catch (err) {
        console.log("Fav fetch error", err);
        dispatch(authActions.setFavourites([]));
      }
    };

    if (isLoggedIn) {
      fetchFavourites();
    } else {
      dispatch(authActions.setFavourites([]));
    }
  }, [dispatch, isLoggedIn, role]);

  return (
    <div>
      <Navbar />
      <Toaster position="top-right" />

      {/* ✅ THIS IS THE FIX */}
      <ScrollToTop />

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/category/:name" element={<CategoryBooks />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/search" element={<Search />} />
        <Route path="/bundle/:id" element={<BundleDetails />} />
        <Route path="/bundles" element={<Bundles />} />
        <Route path="/author/:id" element={<AuthorDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/logIn" replace />}
        >
          <Route
            index
            element={
              role === "user" ? <PersonalInfo /> : <AdminDashboard />
            }
          />

          <Route path="address" element={role === "user" ? <Address /> : <Navigate to="/profile" replace />} />
          <Route path="favourites" element={role === "user" ? <Favourites /> : <Navigate to="/profile" replace />} />
          <Route path="orders" element={role !== "user" ? <AllOrders /> : <Navigate to="/profile" replace />} />
          <Route path="users" element={role !== "user" ? <AllUsers /> : <Navigate to="/profile" replace />} />
          <Route path="add-book" element={role !== "user" ? <AddBook /> : <Navigate to="/profile" replace />} />
          <Route path="add-author" element={role !== "user" ? <AddAuthor /> : <Navigate to="/profile" replace />} />
          <Route path="add-bundle" element={role !== "user" ? <AddBundle /> : <Navigate to="/profile" replace />} />
          <Route path="manage-bundles" element={role !== "user" ? <ManageBundles /> : <Navigate to="/profile" replace />} />

          <Route path="manage-authors" element={role !== "user" ? <ManageAuthors /> : <Navigate to="/profile" replace />} />
          <Route path="edit-author/:id" element={role !== "user" ? <EditAuthor /> : <Navigate to="/profile" replace />} />

          <Route path="orderHistory" element={<UserOrderHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/signUp" element={<SignUp />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/unsubscribe/:token" element={<Unsubscribe />} />
        <Route path="/update-book/:id" element={<UpdateBook />} />
        <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;