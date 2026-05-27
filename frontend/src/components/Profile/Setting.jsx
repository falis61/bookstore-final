import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import {
  FaUserCog,
  FaBookOpen,
  FaEnvelope,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaTrashAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const Settings = () => {
  const [Value, setValue] = useState({
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [ProfileData, setProfileData] = useState();
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const headers = {
    id: getStoredItem("id"),
    authorization: `Bearer ${getStoredItem("token")}`,
  };

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

  const deleteConfirmToastStyle = {
    duration: 8000,
    style: {
      background: "#FCF9F4",
      color: "#5A4032",
      border: "1px solid #E7DCCD",
      boxShadow: "0 8px 24px rgba(90,64,50,0.12)",
      padding: "16px",
    },
  };

  const change = (e) => {
    const { name, value } = e.target;
    setValue({ ...Value, [name]: value });
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-user-information",
          { headers }
        );

        setProfileData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  const submitEmail = async () => {
    try {
      if (Value.newEmail.trim() === "") {
        toast("Please enter a new email", toastStyle);
        return;
      }

      const response = await axios.put(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/update-email",
        { email: Value.newEmail },
        { headers }
      );

      toast.success(response.data.message, toastStyle);

      const refreshed = await axios.get(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/get-user-information",
        { headers }
      );
      setProfileData(refreshed.data);

      setValue((prev) => ({
        ...prev,
        newEmail: "",
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update email",
        errorToastStyle
      );
    }
  };

  const submitPassword = async () => {
    try {
      if (
        Value.currentPassword.trim() === "" ||
        Value.newPassword.trim() === "" ||
        Value.confirmPassword.trim() === ""
      ) {
        toast("Please fill all password fields", toastStyle);
        return;
      }

      const response = await axios.put(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/change-password",
        {
          currentPassword: Value.currentPassword,
          newPassword: Value.newPassword,
          confirmPassword: Value.confirmPassword,
        },
        { headers }
      );

      toast.success(response.data.message, toastStyle);

      setValue((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password",
        errorToastStyle
      );
    }
  };

  const handleSubscribeNewsletter = async () => {
    try {
      setNewsletterLoading(true);

      const response = await axios.put(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/subscribe-newsletter",
        {},
        { headers }
      );

      toast.success(response.data.message, toastStyle);

      setProfileData((prev) => ({
        ...prev,
        newsletterSubscribed: true,
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to subscribe",
        errorToastStyle
      );
    } finally {
      setNewsletterLoading(false);
    }
  };

const handleLogoutAllDevicesPreview = async () => {
  try {
    const response = await axios.post(
      "https://bookstore-backend-x6dx.onrender.com/api/v1/logout-all-devices",
      {},
      { headers }
    );

    toast.success(response.data.message, toastStyle);

    // clear current session
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    sessionStorage.removeItem("id");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");

    // redirect to login
    window.location.href = "/logIn";
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to logout from all devices",
      errorToastStyle
    );
  }
};

  const handleDeleteAccountPreview = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[260px]">
          <p className="text-sm text-[#5A4032] leading-6">
            Are you sure you want to delete your account? This cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm rounded-[10px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] hover:bg-[#EEE2D1] transition"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  const response = await axios.delete(
                    "https://bookstore-backend-x6dx.onrender.com/api/v1/delete-account",
                    { headers }
                  );

                  toast.success(response.data.message, toastStyle);

                  localStorage.removeItem("id");
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");

                  sessionStorage.removeItem("id");
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("role");

                  window.location.href = "/";
                } catch (error) {
                  toast.error(
                    error.response?.data?.message || "Failed to delete account",
                    errorToastStyle
                  );
                }
              }}
              className="px-4 py-2 text-sm rounded-[10px] bg-[#B64E3A] text-white hover:bg-[#9E412F] transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      deleteConfirmToastStyle
    );
  };

  return (
    <>
      {!ProfileData && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      )}

      {ProfileData && (
        <div className="w-full bg-[#F8F4EC] p-4 md:p-6">
          <div className="mb-7 flex items-center gap-4">
            <h1 className="text-3xl md:text-[44px] font-serif text-[#6A4A3A] leading-[1]">
              SETTINGS
            </h1>
          </div>

          <div className="space-y-8">
            <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[18px] shadow-[0_8px_24px_rgba(90,64,50,0.08)] p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaUserCog className="text-[#8A674F] text-lg md:text-xl" />
                <h2 className="text-[24px] md:text-[28px] font-semibold text-[#5A4032]">
                  ACCOUNT
                </h2>
              </div>

              <div className="h-[2px] bg-[#D8C3AB] mb-6"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                    Username
                  </label>
                  <div className="p-3 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] font-semibold">
                    {ProfileData.username}
                  </div>
                </div>

                <div>
                  <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                    Current Email
                  </label>
                  <div className="p-3 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] font-semibold break-all">
                    {ProfileData.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <FaEnvelope className="text-[#8A674F] text-base md:text-lg" />
                <h3 className="text-xl md:text-2xl font-semibold text-[#5A4032]">
                  CHANGE EMAIL
                </h3>
              </div>

              <div className="h-[2px] bg-[#D8C3AB] mb-4"></div>

              <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                New Email Address
              </label>
              <input
                type="email"
                name="newEmail"
                value={Value.newEmail}
                onChange={change}
                placeholder="Enter new email"
                className="w-full h-11 md:h-12 px-4 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] placeholder:text-[#8B6D5A] outline-none focus:ring-2 focus:ring-[#D2B07A]"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={submitEmail}
                  className="bg-[#6A4A3A] text-[#FFF8F0] px-6 py-3 rounded-[12px] hover:bg-[#5C4032] transition text-base md:text-lg font-semibold"
                >
                  Update Email
                </button>
              </div>
            </div>

            <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <FaLock className="text-[#8A674F] text-base md:text-lg" />
                <h3 className="text-xl md:text-2xl font-semibold text-[#5A4032]">
                  CHANGE PASSWORD
                </h3>
              </div>

              <div className="h-[2px] bg-[#D8C3AB] mb-4"></div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={Value.currentPassword}
                    onChange={change}
                    placeholder="Enter current password"
                    className="w-full h-11 md:h-12 px-4 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] placeholder:text-[#8B6D5A] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                  />
                </div>

                <div>
                  <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={Value.newPassword}
                    onChange={change}
                    placeholder="Enter new password"
                    className="w-full h-11 md:h-12 px-4 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] placeholder:text-[#8B6D5A] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                  />
                </div>

                <div>
                  <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={Value.confirmPassword}
                    onChange={change}
                    placeholder="Confirm new password"
                    className="w-full h-11 md:h-12 px-4 rounded-[12px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] placeholder:text-[#8B6D5A] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={submitPassword}
                  className="bg-[#6A4A3A] text-[#FFF8F0] px-6 py-3 rounded-[12px] hover:bg-[#5C4032] transition text-base md:text-lg font-semibold"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <FaBell className="text-[#8A674F] text-base md:text-lg" />
                <h3 className="text-xl md:text-2xl font-semibold text-[#5A4032]">
                  NOTIFICATIONS
                </h3>
              </div>

              <div className="h-[2px] bg-[#D8C3AB] mb-4"></div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-[#5A4032] font-semibold text-base md:text-lg">
                    Newsletter Subscription
                  </p>
                  <p className="text-[#7B6253] text-sm md:text-base mt-1">
                    Receive updates about new books, offers, and announcements.
                  </p>
                </div>

                <button
                  onClick={handleSubscribeNewsletter}
                  disabled={newsletterLoading || ProfileData.newsletterSubscribed}
                  className="bg-[#6A4A3A] text-[#FFF8F0] px-6 py-3 rounded-[12px] hover:bg-[#5C4032] transition text-base md:text-lg font-semibold disabled:opacity-60"
                >
                  {ProfileData.newsletterSubscribed
                    ? "Subscribed"
                    : newsletterLoading
                    ? "Subscribing..."
                    : "Subscribe"}
                </button>
              </div>
            </div>

            <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <FaShieldAlt className="text-[#8A674F] text-base md:text-lg" />
                <h3 className="text-xl md:text-2xl font-semibold text-[#5A4032]">
                  SECURITY
                </h3>
              </div>

              <div className="h-[2px] bg-[#D8C3AB] mb-4"></div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-[#5A4032] font-semibold text-base md:text-lg">
                    Log out from all devices
                  </p>
                  <p className="text-[#7B6253] text-sm md:text-base mt-1">
                    End all active sessions across every device.
                  </p>
                </div>

                <button
                  onClick={handleLogoutAllDevicesPreview}
                  className="bg-[#6A4A3A] text-[#FFF8F0] px-6 py-3 rounded-[12px] hover:bg-[#5C4032] transition text-base md:text-lg font-semibold"
                >
                  Logout All Devices
                </button>
              </div>
            </div>

            <div className="bg-[#FFF5F2] border border-[#F0C6BD] rounded-[16px] p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <FaTrashAlt className="text-[#B64E3A] text-base md:text-lg" />
                <h3 className="text-xl md:text-2xl font-semibold text-[#7A2F21]">
                  DANGER ZONE
                </h3>
              </div>

              <div className="h-[2px] bg-[#E8B5AA] mb-4"></div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-[#7A2F21] font-semibold text-base md:text-lg">
                    Delete account
                  </p>
                  <p className="text-[#9A584C] text-sm md:text-base mt-1">
                    Permanently remove your account and related data.
                  </p>
                </div>

                <button
                  onClick={handleDeleteAccountPreview}
                  className="bg-[#B64E3A] text-white px-6 py-3 rounded-[12px] hover:bg-[#9E412F] transition text-base md:text-lg font-semibold"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;