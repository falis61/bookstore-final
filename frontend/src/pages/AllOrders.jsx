import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { Link, useLocation } from "react-router-dom";
import { IoOpenOutline } from "react-icons/io5";
import SeeUserData from "./SeeUserData";
import toast from "react-hot-toast";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const AllOrders = () => {
  const location = useLocation();

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [openStatusIndex, setOpenStatusIndex] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [estimatedDate, setEstimatedDate] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [userDiv, setUserDiv] = useState("hidden");
  const [userDivData, setUserDivData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const headers = {
    id: getStoredItem("id"),
    authorization: `Bearer ${getStoredItem("token")}`,
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");

    if (statusParam === "pending") {
      setFilterStatus("Pending");
    } else if (statusParam === "delivered") {
      setFilterStatus("Delivered");
    } else if (statusParam === "cancelled") {
      setFilterStatus("Cancelled");
    } else {
      setFilterStatus("All");
    }
  }, [location.search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setFetchError("");

      const response = await axios.get(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/get-all-orders",
        { headers }
      );

      setAllOrders(response.data.data || []);
    } catch (error) {
      console.error("fetch orders error:", error.response?.data || error);
      setFetchError(
        error.response?.data?.message || "Failed to load orders"
      );
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openStatusEditor = (
    index,
    currentStatus,
    currentEstimatedDate,
    currentNote
  ) => {
    setOpenStatusIndex(index);
    setSelectedStatus(currentStatus);
    setEstimatedDate(
      currentEstimatedDate
        ? new Date(currentEstimatedDate).toISOString().split("T")[0]
        : ""
    );
    setDeliveryNote(currentNote || "");
  };

  const submitChanges = async (index) => {
    try {
      if (!selectedStatus) return;

      const orderId = filteredOrders[index]._id;

      const response = await axios.put(
        `https://bookstore-backend-x6dx.onrender.com/api/v1/update-status/${orderId}`,
        {
          status: selectedStatus,
          estimatedDeliveryDate: estimatedDate || null,
          deliveryNote: deliveryNote,
        },
        { headers }
      );

      setAllOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: response.data.data?.status || selectedStatus,
                estimatedDeliveryDate:
                  response.data.data?.estimatedDeliveryDate ||
                  (estimatedDate || null),
                deliveryNote:
                  response.data.data?.deliveryNote ?? deliveryNote,
              }
            : order
        )
      );

      setOpenStatusIndex(-1);
      setSelectedStatus("");
      setEstimatedDate("");
      setDeliveryNote("");
      toast.success("Order status updated");
    } catch (error) {
      console.error("status update error:", error.response?.data || error);
      toast.error("Failed to update status");
    }
  };

  const handleRemove = async (orderId) => {
    try {
      await axios.put(
        `https://bookstore-backend-x6dx.onrender.com/api/v1/hide-order/${orderId}`,
        {},
        { headers }
      );

      setAllOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("Order removed from admin view");
    } catch (error) {
      console.error("remove order error:", error.response?.data || error);
      toast.error("Failed to remove order");
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`https://bookstore-backend-x6dx.onrender.com/api/v1/delete-order/${orderId}`, {
        headers,
      });

      setAllOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("Order deleted permanently");
    } catch (error) {
      console.error("delete order error:", error.response?.data || error);
      toast.error("Delete failed");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Order Placed") return "text-[#C5A059]";
    if (status === "Processing") return "text-yellow-600";
    if (status === "Shipped") return "text-blue-600";
    if (status === "Delivered") return "text-green-600";
    if (status === "Cancelled") return "text-red-500";
    return "text-gray-500";
  };

  const filteredOrders = useMemo(() => {
    return allOrders.filter((item) => {
      const matchesSearch =
        item?.user?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.book?.title?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;

      if (filterStatus === "Pending") {
        matchesStatus = ["Order Placed", "Processing", "Shipped"].includes(
          item.status
        );
      } else if (filterStatus === "All") {
        matchesStatus = true;
      } else {
        matchesStatus = item.status === filterStatus;
      }

      return matchesSearch && matchesStatus;
    });
  }, [allOrders, searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F5F1E6] min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="h-full p-0 md:p-4 bg-[#F5F1E6] text-[#4A3428] min-h-screen">
        <h1 className="text-3xl md:text-5xl font-semibold mb-8">
          All Orders
        </h1>

        {fetchError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded p-4 mb-6">
            {fetchError}
          </div>
        )}

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by customer name, email, or book title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-2/3 px-4 py-3 rounded border border-[#D6C4A8] bg-[#FBF7EF]"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 rounded border border-[#D6C4A8] bg-[#FBF7EF]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mt-4 bg-[#3B2218] text-[#F3E7C8] w-full rounded py-2 px-4 flex gap-2">
          <div className="w-[5%] text-center">Sr.</div>
          <div className="w-[25%] md:w-[18%]">Books</div>
          <div className="w-0 md:w-[22%] hidden md:block">Customer</div>
          <div className="w-0 md:w-[20%] hidden md:block">Description</div>
          <div className="w-[18%] md:w-[10%]">Price</div>
          <div className="w-[20%] md:w-[12%]">Status</div>
          <div className="w-[15%] md:w-[10%] text-center">Actions</div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-[#FBF7EF] mt-4 rounded p-6 text-center shadow">
            No orders found.
          </div>
        ) : (
          filteredOrders.map((items, i) => (
            <div
              key={items._id}
              className="bg-[#FBF7EF] w-full rounded py-3 px-4 flex gap-2 hover:bg-[#F8F1E5] transition shadow-sm mt-3"
            >
              <div className="w-[5%] text-center">{i + 1}</div>

             <div className="w-[25%] md:w-[18%] flex items-center gap-3">
                {items.itemType === "bundle" ? (
                  <>
                    {items.bundle?.image && (
                      <img
                        src={items.bundle.image}
                        alt={items.bundle.title}
                        className="h-12 w-10 object-cover rounded"
                      />
                    )}

                    {items.bundle ? (
                      <Link
                        to={`/bundle/${items.bundle._id}`}
                        className="hover:text-[#C5A059]"
                      >
                        {items.bundle.title}
                      </Link>
                    ) : (
                      <span className="text-red-500">Bundle Deleted</span>
                    )}
                  </>
                ) : (
                  <>
                    {items.book && (
                      <img
                        src={items.book.url}
                        alt={items.book.title}
                        className="h-12 w-10 object-cover rounded"
                      />
                    )}

                    {items.book ? (
                      <Link
                        to={`/view-book-details/${items.book._id}`}
                        className="hover:text-[#C5A059]"
                      >
                        {items.book.title}
                      </Link>
                    ) : (
                      <span className="text-red-500">Book Deleted</span>
                    )}
                  </>
                )}
              </div>
              
               <div className="hidden md:block w-[22%]">
                {items.user ? (
                  <>
                    <p className="font-semibold">{items.user.username}</p>
                    <p className="text-sm text-[#6B5748] break-all">
                      {items.user.email}
                    </p>
                  </>
                ) : (
                  <span className="text-red-500">User Deleted</span>
                )}
            </div>
                            
             <div className="hidden md:block w-[20%]">
              {items.itemType === "bundle"
                ? items.bundle?.description
                  ? items.bundle.description.slice(0, 40) + "..."
                  : "No description"
                : items.book?.desc
                ? items.book.desc.slice(0, 40) + "..."
                : "No description"}
            </div>
              

             <div className="w-[18%] md:w-[10%]">
                ${items.itemType === "bundle" ? items.bundlePrice || 0 : items.book?.price || 0}
              </div>

              <div className="w-[20%] md:w-[12%]">
                <button
                  type="button"
                  onClick={() =>
                    openStatusEditor(
                      i,
                      items.status,
                      items.estimatedDeliveryDate,
                      items.deliveryNote
                    )
                  }
                  className="text-left"
                >
                  <span className={`font-semibold ${getStatusStyle(items.status)}`}>
                    {items.status}
                  </span>
                </button>

                {openStatusIndex === i && (
                  <div className="mt-2 space-y-2">
                    <select
                      className="w-full bg-[#F5F1E6] border border-[#D6C4A8] rounded px-2 py-2"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <input
                      type="date"
                      value={estimatedDate}
                      onChange={(e) => setEstimatedDate(e.target.value)}
                      className="w-full bg-[#F5F1E6] border border-[#D6C4A8] rounded px-2 py-2"
                    />

                    <textarea
                      placeholder="Add delivery note (optional)"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      className="w-full bg-[#F5F1E6] border border-[#D6C4A8] rounded px-2 py-2"
                      rows={2}
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => submitChanges(i)}
                        className="bg-[#3B2218] text-[#F5F1E6] px-3 py-1 rounded hover:bg-[#5a3a2a] transition"
                      >
                        Apply
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOpenStatusIndex(-1);
                          setSelectedStatus("");
                          setEstimatedDate("");
                          setDeliveryNote("");
                        }}
                        className="bg-[#FBF7EF] text-[#3B2218] px-3 py-1 rounded border border-[#D6C4A8] hover:bg-[#F3E7C8] transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-[#6B5748] mt-1">
                  {new Date(items.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="w-[15%] md:w-[10%] flex justify-center items-start">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRemove(items._id)}
                      className="text-xs px-3 py-1 bg-[#E6D4B7] text-[#3B2218] rounded hover:bg-[#d9c4a3] min-w-[78px]"
                    >
                      Remove
                    </button>

                    <button
                      onClick={() => handleDelete(items._id)}
                      className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 min-w-[78px]"
                    >
                      Delete
                    </button>
                  </div>

                  <button
                    type="button"
                    className="text-2xl hover:text-[#C5A059] mt-1"
                    onClick={() => {
                      setUserDiv("fixed");
                      setUserDivData(items.user);
                    }}
                  >
                    <IoOpenOutline />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setUserDiv={setUserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;