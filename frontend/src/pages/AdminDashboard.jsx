import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { Link, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const AdminDashboard = () => {
  const { Profile, setProfile: setParentProfile } = useOutletContext();

  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [lowStockBooks, setLowStockBooks] = useState([]);

  const headers = {
    id: getStoredItem("id"),
    authorization: `Bearer ${getStoredItem("token")}`,
  };

  const fetchLowStockBooks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-all-books"
      );

      const lowStock = (response.data.data || []).filter(
        (book) => Number(book.stock) < 5
      );

      setLowStockBooks(lowStock);
    } catch (error) {
      console.log("Low stock books error:", error);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1000/api/v1/admin-stats",
          { headers }
        );
        setStats(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
    fetchLowStockBooks();
  }, []);

  useEffect(() => {
    if (Profile) {
      setProfile(Profile);
    }
  }, [Profile]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const response = await axios.put(
        "http://localhost:1000/api/v1/update-profile-image",
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedProfile = {
        ...profile,
        profileImage: response.data.profileImage,
      };

      setProfile(updatedProfile);
      setParentProfile(updatedProfile);

      window.dispatchEvent(new Event("profileImageUpdated"));
      toast.success("Profile image updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploading(true);

      await axios.put(
        "http://localhost:1000/api/v1/remove-profile-image",
        {},
        { headers }
      );

      const updatedProfile = {
        ...profile,
        profileImage: "",
      };

      setProfile(updatedProfile);
      setParentProfile(updatedProfile);

      window.dispatchEvent(new Event("profileImageUpdated"));
      toast.success("Profile image removed!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove image");
    } finally {
      setUploading(false);
    }
  };

  if (!stats) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F5F1E6] p-6 text-[#4A3428]">
      <h1 className="text-4xl font-semibold mb-8">Admin Dashboard</h1>

      <div className="flex flex-col items-center mb-8 mt-[-50px]">
        <label htmlFor="adminProfileUpload" className="cursor-pointer">
          <img
            src={
              profile?.profileImage ||
              profile?.avatar ||
              "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
            }
            alt="admin profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-[#C5A059] hover:opacity-80 transition"
          />
        </label>

        <input
          type="file"
          id="adminProfileUpload"
          className="hidden"
          onChange={handleImageChange}
        />

        <p className="mt-2 text-sm text-[#6B5748]">Click image to change</p>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <label
            htmlFor="adminProfileUpload"
            className={`bg-[#3B2218] text-[#F5F1E6] px-5 py-2.5 rounded-[12px] text-sm md:text-base font-semibold hover:bg-[#5a3a2a] transition cursor-pointer ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Change Image
          </label>

          <button
            onClick={handleRemoveImage}
            disabled={uploading}
            className="border border-[#3B2218] text-[#3B2218] px-5 py-2.5 rounded-[12px] text-sm md:text-base font-semibold hover:bg-[#3B2218] hover:text-[#F5F1E6] transition disabled:opacity-50"
          >
            Remove Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Link
          to="/profile/users"
          className="bg-[#FBF7EF] p-6 rounded shadow border border-[#E4D6BD] hover:shadow-lg transition-all block"
        >
          <h2 className="text-lg">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </Link>

        <Link
          to="/all-books"
          className="bg-[#FBF7EF] p-6 rounded shadow border border-[#E4D6BD] hover:shadow-lg transition-all block"
        >
          <h2 className="text-lg">Total Books</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalBooks}</p>
        </Link>

        <Link
          to="/profile/orders"
          className="bg-[#FBF7EF] p-6 rounded shadow border border-[#E4D6BD] hover:shadow-lg transition-all block"
        >
          <h2 className="text-lg">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
        </Link>

        <div className="bg-[#FBF7EF] p-6 rounded shadow border border-[#E4D6BD]">
          <h2 className="text-lg">Revenue</h2>
          <p className="text-3xl font-bold mt-2">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          to="/profile/orders?status=pending"
          className="bg-[#FBF7EF] p-6 rounded shadow border border-[#E4D6BD] hover:shadow-lg transition-all block"
        >
          <h2 className="text-lg">Pending Orders</h2>
          <p className="text-3xl font-bold mt-2">{stats.pendingOrders || 0}</p>
        </Link>

        <Link
          to="/profile/orders?status=delivered"
          className="bg-[#FBF7EF] p-6 rounded shadow border border-[#E4D6BD] hover:shadow-lg transition-all block"
        >
          <h2 className="text-lg">Delivered Orders</h2>
          <p className="text-3xl font-bold mt-2">
            {stats.deliveredOrders || 0}
          </p>
        </Link>

        <Link
          to="/profile/orders?status=cancelled"
          className="bg-[#FBF7EF] p-6 rounded shadow border border-[#E4D6BD] hover:shadow-lg transition-all block"
        >
          <h2 className="text-lg">Cancelled Orders</h2>
          <p className="text-3xl font-bold mt-2">
            {stats.cancelledOrders || 0}
          </p>
        </Link>

        <Link
          to="/all-books?stock=low"
          className="bg-[#FBF7EF] p-6 rounded shadow border border-[#E4D6BD] hover:shadow-lg transition-all block"
        >
          <h2 className="text-lg">Low Stock Books</h2>
          <p className="text-3xl font-bold mt-2">{lowStockBooks.length}</p>
          <p className="text-sm text-[#6B5748] mt-2">
            Books with stock under 5
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;