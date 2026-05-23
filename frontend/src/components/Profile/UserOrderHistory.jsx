import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import {
  FaCreditCard,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaClipboardCheck,
  FaCogs,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const UserOrderHistory = () => {
  const [OrderHistory, setOrderHistory] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-user-orders",
          { headers }
        );
        setOrderHistory(response.data.data || []);
      } catch (error) {
        console.log(error);
        setOrderHistory([]);
      }
    };

    fetch();
  }, []);

  const getDaysLeft = (deliveryDate) => {
    if (!deliveryDate) return null;

    const today = new Date();
    const delivery = new Date(deliveryDate);

    const diffTime = delivery - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const getStatusStyle = (status) => {
    if (status === "Order Placed") {
      return "bg-[#F6EEDF] text-[#6A4A3A]";
    }
    if (status === "Processing") {
      return "bg-yellow-100 text-yellow-700";
    }
    if (status === "Shipped") {
      return "bg-blue-100 text-blue-700";
    }
    if (status === "Delivered") {
      return "bg-green-100 text-green-700";
    }
    if (status === "Cancelled") {
      return "bg-red-100 text-red-600";
    }
    return "bg-[#F6EEDF] text-[#5A4032]";
  };

  const trackingSteps = [
    {
      label: "Order Placed",
      icon: FaClipboardCheck,
    },
    {
      label: "Processing",
      icon: FaCogs,
    },
    {
      label: "Shipped",
      icon: FaTruck,
    },
    {
      label: "Delivered",
      icon: FaCheckCircle,
    },
  ];

  const getCurrentStepIndex = (status) => {
    return trackingSteps.findIndex((step) => step.label === status);
  };

  return (
    <div className="bg-[#F8F4EC] min-h-screen p-4 md:p-6">
      {!OrderHistory && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader />
        </div>
      )}

      {OrderHistory && OrderHistory.length === 0 && (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#5A4032]">
          <h1 className="text-3xl md:text-5xl font-semibold text-[#6A4A3A] mb-8">
            No Order History
          </h1>
          <img
            src="https://cdn-icons-png.flaticon.com/128/9961/9961218.png"
            alt="No orders"
            className="h-[20vh] mb-8"
          />
          <p className="text-[#7B6253] text-lg">
            Your placed orders will appear here.
          </p>
        </div>
      )}

      {OrderHistory && OrderHistory.length > 0 && (
        <div className="text-[#5A4032]">
          <div className="mb-8">
            <h1 className="text-3xl md:text-[44px] font-serif text-[#5A4032]">
              Your Order History
            </h1>
            <p className="mt-2 text-[#7B6253] text-base md:text-lg">
              Track your books, payment details, and delivery information.
            </p>
          </div>

          <div className="grid gap-6">
            {OrderHistory.map((items, i) => {
              const currentStepIndex = getCurrentStepIndex(items.status);

              const isBundle = items.itemType === "bundle";
              const orderTitle = isBundle
                ? items.bundle?.title
                : items.book?.title;
              const orderImage = isBundle
                ? items.bundle?.image
                : items.book?.url;
              const orderDesc = isBundle
                ? items.bundle?.description
                : items.book?.desc;
              const orderPrice = isBundle
                ? items.bundlePrice
                : items.book?.price;
              const orderLink = isBundle
                ? `/bundle/${items.bundle?._id}`
                : `/view-book-details/${items.book?._id}`;

              return (
                <div
                  key={i}
                  className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[18px] shadow-sm p-4 md:p-6"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* IMAGE */}
                    <div className="w-full lg:w-[170px] flex-shrink-0">
                      <Link to={orderLink}>
                        <div className="bg-[#FFFFFF] border border-[#E7DCCD] rounded-[12px] p-3 flex items-center justify-center h-[220px]">
                          <img
                            src={orderImage}
                            alt={orderTitle}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </Link>
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <p className="text-sm text-[#8B6D5A] font-medium mb-1">
                            Order #{i + 1}
                          </p>

                          <Link
                            to={orderLink}
                            className="text-xl md:text-2xl font-semibold text-[#5A4032] hover:text-[#6A4A3A] transition"
                          >
                            {orderTitle}
                          </Link>

                          {isBundle && (
                            <p className="text-sm text-[#8B6D5A] mt-2">
                              {items.bundle?.books?.length || 0} books bundle
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                              items.status
                            )}`}
                          >
                            {items.status}
                          </span>

                          <p className="text-xl md:text-2xl font-bold text-[#5A4032]">
                            ${Number(orderPrice || 0).toFixed(2)}
                          </p>

                          {isBundle && (
                            <p className="text-sm text-green-700 font-semibold">
                              Save {items.bundleDiscountPercent || 0}%
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ORDER TRACKER */}
                      <div className="mt">
                        <h3 className="text-[#6A4A3A] font-semibold mb-1">
                          Order Tracking
                        </h3>
                                      
                                      <div className="mb-4">
                            {items.estimatedDeliveryDate && (
                              <p className="text-sm text-[#C9A24E] font-semibold mb-1">
                                {getDaysLeft(items.estimatedDeliveryDate) > 0
                                   ? `Arriving in ${getDaysLeft(items.estimatedDeliveryDate
                                      )} days`
                                    : "Arriving today"}
                                </p>
                              )}

                              <p className="text-sm text-[#8B6D5A]">
                                Estimated delivery:{" "}
                                {items.estimatedDeliveryDate
                                  ? new Date(
                                      items.estimatedDeliveryDate
                                    ).toLocaleDateString()
                                  : "Not set yet"}
                              </p>

                              {items.deliveryNote && (
                                <div className="mt-3 bg-[#F6EEDF] border border-[#E7DCCD] rounded-lg px-3 py-2">
                                  <p className="text-sm text-[#5A4032]">
                                    <span className="font-semibold">
                                      Delivery Note:
                                    </span>{" "}
                                    {items.deliveryNote}
                                  </p>
                                </div>
                              )}
                            </div>


                        {items.status === "Cancelled" ? (
                          <div className="bg-red-50 border border-red-200 rounded-[12px] px-4 py-4 flex items-center gap-3">
                            <FaTimesCircle className="text-red-500 text-xl" />
                            <p className="text-red-600 font-semibold">
                              This order has been cancelled.
                            </p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <div className="flex items-center min-w-[620px]">
                              {trackingSteps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                  <React.Fragment key={step.label}>
                                    <div className="flex flex-col items-center min-w-[110px]">
                                      <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-base border-2 transition-all duration-300 ${
                                          isCompleted
                                            ? "bg-[#C9A24E] border-[#C9A24E] text-white"
                                            : "bg-white border-[#E6C89A] text-[#9A7F6A]"
                                        } ${
                                          isCurrent
                                            ? "scale-105 shadow-sm animate-pulse"
                                            : ""
                                        }`}
                                      >
                                        <Icon />
                                      </div>

                                      <p
                                        className={`mt-2 text-sm text-center font-medium transition-colors duration-300 ${
                                          isCurrent
                                            ? "text-[#6A4A3A]"
                                            : isCompleted
                                            ? "text-[#5A4032]"
                                            : "text-[#8B6D5A]"
                                        }`}
                                      >
                                        {step.label}
                                      </p>
                                    </div>

                                    {index !== trackingSteps.length - 1 && (
                                      <div
                                        className={`flex-1 h-[3px] mx-2 rounded-full transition-colors duration-300 ${
                                          index < currentStepIndex
                                            ? "bg-[#C9A24E]"
                                            : "bg-[#E6C89A]"
                                        }`}
                                      ></div>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="mt-6 text-[#7B6253] leading-7 max-w-3xl">
                        {orderDesc}
                      </p>

                      {isBundle && items.bundle?.books?.length > 0 && (
                        <div className="mt-4 bg-[#F6EEDF] border border-[#E7DCCD] rounded-[12px] p-4">
                          <div className="flex items-center gap-2 text-[#5A4032] mb-2">
                            <FaBoxOpen className="text-[#8A674F]" />
                            <h3 className="font-semibold">Books Included</h3>
                          </div>

                          <ul className="list-disc pl-5 text-[#7B6253] space-y-1">
                            {items.bundle.books.map((book) => (
                              <li key={book._id}>
                                {book.title} — {book.author}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* INFO GRID */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#F6EEDF] border border-[#E7DCCD] rounded-[12px] p-4">
                          <div className="flex items-center gap-2 text-[#5A4032] mb-2">
                            <FaCreditCard className="text-[#8A674F]" />
                            <h3 className="font-semibold">Payment</h3>
                          </div>

                          <p>{items.paymentMethod || "Card"}</p>

                          {items.cardLast4 && (
                            <p className="text-[#7B6253] mt-1">
                              Card ending in **** {items.cardLast4}
                            </p>
                          )}
                        </div>

                        <div className="bg-[#F6EEDF] border border-[#E7DCCD] rounded-[12px] p-4">
                          <div className="flex items-center gap-2 text-[#5A4032] mb-2">
                            <FaBoxOpen className="text-[#8A674F]" />
                            <h3 className="font-semibold">Order Date</h3>
                          </div>

                          <p>
                            {items.createdAt
                              ? new Date(items.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* SHIPPING */}
                      <div className="mt-4 bg-[#F6EEDF] border border-[#E7DCCD] rounded-[12px] p-4">
                        <div className="flex items-center gap-2 text-[#5A4032] mb-2">
                          <FaMapMarkerAlt className="text-[#8A674F]" />
                          <h3 className="font-semibold">Shipping Address</h3>
                        </div>

                        <p className="leading-7">
                          {items.shippingAddress || "No shipping address saved"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;