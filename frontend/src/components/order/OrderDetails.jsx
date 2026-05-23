import React from "react";
import { RxCross1 } from "react-icons/rx";

const OrderDetails = ({ orderData, orderDiv, setOrderDiv }) => {
  return (
    <>
      {/* OVERLAY */}
      <div
        className={`${orderDiv} top-0 left-0 h-screen w-full bg-black opacity-50`}
      ></div>

      {/* MODAL */}
      <div
        className={`${orderDiv} top-0 left-0 h-screen w-full flex items-center justify-center`}
      >
        <div className="bg-[#FBF7EF] border border-[#D6C4A8] rounded p-5 w-[80%] md:w-[50%] lg:w-[40%] text-[#3B2218] shadow-lg">

          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Order Details</h1>

            <button
              onClick={() => setOrderDiv("hidden")}
              className="text-[#4B2E1F] hover:text-[#C5A059]"
            >
              <RxCross1 />
            </button>
          </div>

          <div className="mt-4 space-y-3">

            <p><strong>User:</strong> {orderData?.user?.username}</p>
            <p><strong>Email:</strong> {orderData?.user?.email}</p>

            <p><strong>Book:</strong> {orderData?.book?.title}</p>
            <p><strong>Price:</strong> ${orderData?.book?.price}</p>

            <p><strong>Status:</strong> {orderData?.status}</p>

            <p><strong>Shipping Address:</strong> {orderData?.shippingAddress}</p>
            <p><strong>Billing Address:</strong> {orderData?.billingAddress}</p>

            <p><strong>Payment Method:</strong> {orderData?.paymentMethod}</p>

          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;