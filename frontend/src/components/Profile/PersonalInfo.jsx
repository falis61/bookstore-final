import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  FaUser,
  FaIdBadge,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { Profile, setProfile: setParentProfile } = useOutletContext();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingExtraInfo, setSavingExtraInfo] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    dob: "",
  });

  const headers = {
    id: getStoredItem("id"),
    authorization: `Bearer ${getStoredItem("token")}`,
  };

  useEffect(() => {
    if (Profile) {
      setProfile(Profile);
      setPreview(Profile.profileImage || Profile.avatar || "");
      setFormData({
        username: Profile.username || "",
        email: Profile.email || "",
        phone: Profile.phone || "",
        dob: Profile.dob ? String(Profile.dob).split("T")[0] : "",
      });
    }
  }, [Profile]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    setFormData(updated);

    const updatedProfile = {
      ...profile,
      ...updated,
    };

    setProfile(updatedProfile);
    setParentProfile(updatedProfile);
  };

  const handleUsernameBlur = async () => {
    try {
      if (!profile) return;

      const nextUsername = formData.username.trim();
      const currentUsername = (profile.username || "").trim();

      if (!nextUsername || nextUsername === currentUsername) return;

      setSavingUsername(true);

      const response = await axios.put(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/update-username",
        { username: nextUsername },
        { headers }
      );

      const updatedProfile = {
        ...profile,
        username: nextUsername,
      };

      setProfile(updatedProfile);
      setParentProfile(updatedProfile);

      toast.success(response.data.message || "Username updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update username"
      );
      setFormData((prev) => ({
        ...prev,
        username: profile?.username || "",
      }));
    } finally {
      setSavingUsername(false);
    }
  };

  const handleEmailBlur = async () => {
    try {
      if (!profile) return;

      const nextEmail = formData.email.trim();
      const currentEmail = (profile.email || "").trim();

      if (!nextEmail || nextEmail === currentEmail) return;

      setSavingEmail(true);

      const response = await axios.put(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/update-email",
        { email: nextEmail },
        { headers }
      );

      const updatedProfile = {
        ...profile,
        email: nextEmail,
      };

      setProfile(updatedProfile);
      setParentProfile(updatedProfile);

      toast.success(response.data.message || "Email updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update email");
      setFormData((prev) => ({
        ...prev,
        email: profile?.email || "",
      }));
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSaveExtraInfo = async () => {
    try {
      setSavingExtraInfo(true);

      const response = await axios.put(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/update-user-info",
        {
          phone: formData.phone,
          dob: formData.dob,
        },
        { headers }
      );

      const updatedProfile = {
        ...profile,
        phone: formData.phone,
        dob: formData.dob,
      };

      setProfile(updatedProfile);
      setParentProfile(updatedProfile);

      setSavedMessage(true);
      setTimeout(() => {
        setSavedMessage(false);
      }, 2000);

      toast.success(response.data.message || "Info updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update info");
    } finally {
      setSavingExtraInfo(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file");
      return;
    }

    setImage(file);

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
  };

  const handleUploadImage = async () => {
    if (!image) {
      toast.error("Please choose an image first");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    try {
      setUploading(true);

      const response = await axios.put(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/update-profile-image",
        uploadData,
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
      setPreview(response.data.profileImage);
      setImage(null);

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
        "https://bookstore-backend-x6dx.onrender.com/api/v1/remove-profile-image",
        {},
        { headers }
      );

      const updatedProfile = {
        ...profile,
        profileImage: "",
      };

      setProfile(updatedProfile);
      setParentProfile(updatedProfile);
      setPreview(updatedProfile.avatar || "");
      setImage(null);

      window.dispatchEvent(new Event("profileImageUpdated"));
      toast.success("Profile image removed!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove image");
    } finally {
      setUploading(false);
    }
  };

  const handleGoToShop = () => {
    navigate("/all-books");
  };

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "Not available";

  const accountType = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "User";

  return (
    <div className="w-full bg-[#F8F4EC] p-4 md:p-6">
      <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[22px] p-5 md:p-8 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-10">
          <div className="w-full xl:w-[320px] flex flex-col items-center text-center">
            <label htmlFor="profileUpload" className="cursor-pointer group">
              <img
                src={
                  preview ||
                  profile?.profileImage ||
                  profile?.avatar ||
                  "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                }
                alt="profile"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-[3px] border-[#D2B07A] shadow-sm group-hover:opacity-85 transition"
              />
            </label>

            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <h2 className="mt-4 text-[32px] font-semibold text-[#5A4032]">
              {formData.username}
            </h2>

            <p className="mt-2 text-[#8B6D5A] text-sm break-all">
              {formData.email}
            </p>

            <p className="mt-4 text-[#6A4A3A] text-sm">
              Click profile image to change
            </p>

            <div className="flex flex-row justify-center gap-4 mt-5 w-full">
              <button
                onClick={handleUploadImage}
                disabled={uploading || !image}
                className="bg-[#6A4A3A] text-[#FFF8F0] px-6 py-3 rounded-[14px] font-semibold hover:bg-[#5C4032] transition disabled:opacity-50 min-w-[160px]"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>

              <button
                onClick={handleRemoveImage}
                disabled={uploading}
                className="border border-[#6A4A3A] text-[#6A4A3A] px-6 py-3 rounded-[14px] font-semibold hover:bg-[#6A4A3A] hover:text-[#FFF8F0] transition disabled:opacity-50 min-w-[160px]"
              >
                Remove Image
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <FaUser className="text-[#8A674F]" />
              <h2 className="text-[28px] font-semibold text-[#5A4032]">
                PERSONAL INFORMATION
              </h2>
            </div>

            <div className="h-[2px] bg-[#D8C3AB] mb-7"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#5A4032] mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={handleUsernameBlur}
                  className="w-full h-12 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[14px] px-4 text-[#5A4032] placeholder:text-[#8B6D5A] focus:outline-none focus:ring-2 focus:ring-[#D2B07A]"
                />
                {savingUsername && (
                  <p className="mt-2 text-sm text-[#8B6D5A]">
                    Saving username...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#5A4032] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleEmailBlur}
                  className="w-full h-12 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[14px] px-4 text-[#5A4032] placeholder:text-[#8B6D5A] focus:outline-none focus:ring-2 focus:ring-[#D2B07A]"
                />
                {savingEmail && (
                  <p className="mt-2 text-sm text-[#8B6D5A]">
                    Saving email...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#5A4032] mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[14px] px-4 text-[#5A4032] placeholder:text-[#8B6D5A] focus:outline-none focus:ring-2 focus:ring-[#D2B07A]"
                />
              </div>

              <div>
                <label className="block text-[#5A4032] mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[14px] px-4 text-[#5A4032] focus:outline-none focus:ring-2 focus:ring-[#D2B07A]"
                />
              </div>

              <div>
                <label className="block text-[#5A4032] mb-2">Account Type</label>
                <input
                  type="text"
                  value={accountType}
                  readOnly
                  className="w-full h-12 bg-[#EEE7DC] border border-[#E7DCCD] rounded-[14px] px-4 text-[#5A4032]"
                />
              </div>

              <div>
                <label className="block text-[#5A4032] mb-2">Member Since</label>
                <input
                  type="text"
                  value={memberSince}
                  readOnly
                  className="w-full h-12 bg-[#EEE7DC] border border-[#E7DCCD] rounded-[14px] px-4 text-[#5A4032]"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col items-center">
              <button
                onClick={handleSaveExtraInfo}
                disabled={savingExtraInfo}
                className="bg-[#6A4A3A] text-[#FFF8F0] px-6 py-3 rounded-[14px] font-semibold hover:bg-[#5C4032] transition disabled:opacity-50 min-w-[180px]"
              >
                {savingExtraInfo ? "Saving..." : "Save"}
              </button>

              {savedMessage && (
                <p className="mt-2 text-sm text-green-600 text-center">
                  Saved ✔
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;