import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import {
  FaMapMarkerAlt,
  FaGlobe,
  FaCity,
  FaMapPin,
  FaHome,
  FaTrash,
  FaStar,
  FaEdit,
} from "react-icons/fa";
import toast from "react-hot-toast";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const Address = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "Turkey",
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1000/api/v1/get-addresses",
          { headers }
        );
        setAddresses(res.data.addresses || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "Turkey",
    });
    setEditingAddressId(null);
  };

  const submitAddress = async () => {
    try {
      setSaving(true);

      const fullAddress = [
        formData.address1,
        formData.address2,
        formData.city,
        formData.state,
        formData.zip,
        formData.country,
      ]
        .filter((i) => i && i.trim() !== "")
        .join(", ");

      if (editingAddressId) {
        const res = await axios.put(
          `http://localhost:1000/api/v1/edit-address/${editingAddressId}`,
          { ...formData, fullAddress },
          { headers }
        );

        toast.success(res.data.message, toastStyle);
        setAddresses(res.data.addresses);
        resetForm();
      } else {
        const res = await axios.post(
          "http://localhost:1000/api/v1/add-address",
          { ...formData, fullAddress },
          { headers }
        );

        toast.success(res.data.message, toastStyle);
        setAddresses(res.data.addresses);
        resetForm();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (editingAddressId ? "Failed to update address" : "Failed to add address"),
        errorToastStyle
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setFormData({
      address1: addr.address1 || "",
      address2: addr.address2 || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      country: addr.country || "Turkey",
    });
  };

  const deleteAddress = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:1000/api/v1/delete-address/${id}`,
        { headers }
      );
      setAddresses(res.data.addresses);
      toast.success("Address deleted", toastStyle);

      if (editingAddressId === id) {
        resetForm();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed",
        errorToastStyle
      );
    }
  };

  const setDefault = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:1000/api/v1/set-default-address/${id}`,
        {},
        { headers }
      );
      setAddresses(res.data.addresses);
      toast.success("Default updated", toastStyle);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to set default",
        errorToastStyle
      );
    }
  };

  return (
    <>
      {loading && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      )}

      {!loading && (
        <div className="w-full bg-[#F8F4EC] p-4 md:p-6">
          <div className="mb-7 flex items-center gap-4">
            <h1 className="text-3xl md:text-[44px] font-serif text-[#6A4A3A] leading-[1]">
              ADDRESS
            </h1>
          </div>

          {addresses.length > 0 && (
            <div className="mb-6 space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[18px] shadow-[0_8px_24px_rgba(90,64,50,0.08)] p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="text-[#5A4032] text-base md:text-lg font-medium">
                      {addr.fullAddress}
                    </p>
                    {addr.isDefault && (
                      <p className="text-green-600 text-sm font-semibold mt-1">
                        Default Address
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="text-[#8A674F] hover:text-[#6A4A3A] transition"
                      title="Edit Address"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => setDefault(addr._id)}
                      className="text-yellow-500 hover:text-yellow-600 transition"
                      title="Set Default"
                    >
                      <FaStar />
                    </button>

                    <button
                      onClick={() => deleteAddress(addr._id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Delete Address"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[18px] shadow-[0_8px_24px_rgba(90,64,50,0.08)] p-5 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-[#8A674F] text-lg md:text-xl" />
              <h2 className="text-[24px] md:text-[28px] font-semibold text-[#5A4032]">
                {editingAddressId ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
              </h2>
            </div>

            <div className="h-[2px] bg-[#D8C3AB] mb-6"></div>

            <div className="space-y-5">
              <div>
                <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                  Address Line 1
                </label>
                <div className="relative">
                  <FaHome className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6D5A]" />
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={change}
                    placeholder="Street address, building, apartment"
                    className="w-full h-12 md:h-14 pl-12 pr-4 rounded-[14px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] placeholder:text-[#8B6D5A] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                  Address Line 2
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6D5A]" />
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={change}
                    placeholder="Extra details (optional)"
                    className="w-full h-12 md:h-14 pl-12 pr-4 rounded-[14px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] placeholder:text-[#8B6D5A] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                    City
                  </label>
                  <div className="relative">
                    <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6D5A]" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={change}
                      placeholder="City"
                      className="w-full h-12 md:h-14 pl-12 pr-4 rounded-[14px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] placeholder:text-[#8B6D5A] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                    State / Province
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6D5A]" />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={change}
                      placeholder="State / Province"
                      className="w-full h-12 md:h-14 pl-12 pr-4 rounded-[14px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] placeholder:text-[#8B6D5A] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                    Zip / Postal Code
                  </label>
                  <div className="relative">
                    <FaMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6D5A]" />
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={change}
                      placeholder="Zip / Postal Code"
                      className="w-full h-12 md:h-14 pl-12 pr-4 rounded-[14px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] placeholder:text-[#8B6D5A] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6D5A]" />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={change}
                      className="w-full h-12 md:h-14 pl-12 pr-4 rounded-[14px] bg-[#F8F4EC] border border-[#E7DCCD] text-[#5A4032] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                    >
                      <option>Turkey</option>
                      <option>Somalia</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                      <option>Italy</option>
                      <option>Poland</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-4">
                <button
                  onClick={submitAddress}
                  disabled={saving}
                  className="bg-[#6A4A3A] text-[#FFF8F0] px-8 py-3 rounded-[14px] hover:bg-[#5C4032] transition text-base md:text-lg font-semibold disabled:opacity-60"
                >
                  {saving
                    ? editingAddressId
                      ? "Updating..."
                      : "Saving..."
                    : editingAddressId
                    ? "Update Address"
                    : "Add Address"}
                </button>

                {editingAddressId && (
                  <button
                    onClick={resetForm}
                    type="button"
                    className="bg-[#F8F4EC] text-[#5A4032] px-8 py-3 rounded-[14px] border border-[#E7DCCD] hover:bg-[#EEE7DC] transition text-base md:text-lg font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Address;