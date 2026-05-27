import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../Store/auth";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const getAddressKey = (address) =>
    address?._id || address?.id || address?.fullAddress || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const cartRes = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-user-cart",
          { headers }
        );

        const userRes = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-user-information",
          { headers }
        );

        const addressRes = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-addresses",
          { headers }
        );

        setCart(cartRes.data.data || []);
        setUserInfo(userRes.data || {});

        const addresses = addressRes.data.addresses || [];
        setSavedAddresses(addresses);

        const defaultAddress = addresses.find((a) => a.isDefault);

        if (defaultAddress) {
          setSelectedAddressId(getAddressKey(defaultAddress));
          setShippingAddress(defaultAddress.fullAddress);
          setBillingAddress(defaultAddress.fullAddress);
        } else if (addresses.length > 0) {
          setSelectedAddressId(getAddressKey(addresses[0]));
          setShippingAddress(addresses[0].fullAddress);
          setBillingAddress(addresses[0].fullAddress);
        } else {
          setSelectedAddressId("");
          setShippingAddress("");
          setBillingAddress("");
        }

        dispatch(authActions.setCartCount((cartRes.data.data || []).length));
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to load checkout data",
          errorToastStyle
        );
        setCart([]);
        setUserInfo({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (cart && cart.length > 0) {
      let totalAmount = 0;

      cart.forEach((item) => {
        const quantity = item.quantity || 1;

        if (item.itemType === "bundle") {
          totalAmount += Number(item.bundlePrice || 0) * quantity;
        } else {
          const bookData = item.book || item;
          totalAmount += Number(bookData.price || 0) * quantity;
        }
      });

      setTotal(totalAmount);
    } else {
      setTotal(0);
    }
  }, [cart]);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress);
    }
  }, [sameAsShipping, shippingAddress]);

  const shippingCost = total > 100 ? 0 : 5;
  const finalTotal = total + shippingCost;

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleSelectSavedAddress = (address) => {
    setSelectedAddressId(getAddressKey(address));
    setShippingAddress(address.fullAddress);

    if (sameAsShipping) {
      setBillingAddress(address.fullAddress);
    }
  };

  const validateCheckout = () => {
    const rawCardNumber = cardNumber.replace(/\s/g, "");
    const rawCvv = cvv.replace(/\D/g, "");

    if (!cart || cart.length === 0) {
      toast("Your cart is empty", toastStyle);
      return false;
    }

    if (!shippingAddress.trim()) {
      toast("Please enter a shipping address", toastStyle);
      return false;
    }

    if (!billingAddress.trim()) {
      toast("Please enter a billing address", toastStyle);
      return false;
    }

    if (!cardName.trim()) {
      toast("Please enter the cardholder name", toastStyle);
      return false;
    }

    if (rawCardNumber.length !== 16) {
      toast("Card number must be 16 digits", toastStyle);
      return false;
    }

    if (expiry.length !== 5) {
      toast("Expiry date must be in MM/YY format", toastStyle);
      return false;
    }

    const expiryParts = expiry.split("/");
    if (expiryParts.length !== 2) {
      toast("Expiry date must be in MM/YY format", toastStyle);
      return false;
    }

    const month = Number(expiryParts[0]);
    const year = Number(expiryParts[1]);

    if (month < 1 || month > 12) {
      toast("Invalid expiry month", toastStyle);
      return false;
    }

    if (String(expiryParts[1]).length !== 2) {
      toast("Invalid expiry year", toastStyle);
      return false;
    }

    const fullYear = 2000 + year;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (
      fullYear < currentYear ||
      (fullYear === currentYear && month < currentMonth)
    ) {
      toast("Card expiry date has passed", toastStyle);
      return false;
    }

    if (rawCvv.length < 3 || rawCvv.length > 4) {
      toast("CVV must be 3 or 4 digits", toastStyle);
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    try {
      if (!validateCheckout()) return;

      setIsSubmitting(true);

      const response = await axios.post(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/place-order",
        {
          order: cart,
          shippingAddress,
          billingAddress,
          paymentMethod: "Card",
          cardLast4: cardNumber.replace(/\s/g, "").slice(-4),
        },
        { headers }
      );

      toast.success(response.data.message, toastStyle);
      dispatch(authActions.setCartCount(0));
      navigate("/profile/orderHistory");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to place order",
        errorToastStyle
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F4EC] min-h-screen px-4 md:px-12 py-8">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#3B2218] mb-8">
            Secure Checkout
          </h1>

          {cart && cart.length === 0 ? (
            <div className="bg-[#FCF9F4] rounded-[16px] border border-[#E7DCCD] p-8 text-center text-[#5A4032]">
              Your cart is empty.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8">
              <div className="space-y-6">
                <div className="bg-[#FCF9F4] rounded-[16px] border border-[#E7DCCD] p-6">
                  <h2 className="text-2xl font-semibold text-[#5A4032] mb-4">
                    Shipping Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#7B6253] mb-2 font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userInfo?.username || ""}
                        readOnly
                        className="w-full bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3 outline-none text-[#5A4032]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#7B6253] mb-2 font-medium">
                        Email
                      </label>
                      <input
                        type="text"
                        value={userInfo?.email || ""}
                        readOnly
                        className="w-full bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3 outline-none text-[#5A4032]"
                      />
                    </div>

                    {savedAddresses.length > 0 && (
                      <div>
                        <label className="block text-[#7B6253] mb-3 font-medium">
                          Choose Saved Address
                        </label>

                        <div className="space-y-3">
                          {savedAddresses.map((address) => (
                            <button
                              key={getAddressKey(address)}
                              type="button"
                              onClick={() => handleSelectSavedAddress(address)}
                              className={`w-full text-left rounded-[12px] border px-4 py-3 transition ${
                                selectedAddressId === getAddressKey(address)
                                  ? "border-[#8A674F] bg-[#F3E8D7]"
                                  : "border-[#E7DCCD] bg-[#F8F4EC]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex gap-3">
                                  <FaMapMarkerAlt className="mt-1 text-[#8A674F]" />
                                  <div>
                                    <p className="text-[#5A4032] font-medium">
                                      {address.fullAddress}
                                    </p>
                                    {address.isDefault && (
                                      <p className="text-sm text-green-600 font-semibold mt-1">
                                        Default Address
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {selectedAddressId === getAddressKey(address) && (
                                  <FaCheckCircle className="text-[#8A674F] mt-1" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[#7B6253] mb-2 font-medium">
                        Shipping Address
                      </label>
                      <textarea
                        rows="4"
                        value={shippingAddress}
                        onChange={(e) => {
                          setSelectedAddressId("");
                          setShippingAddress(e.target.value);
                        }}
                        className="w-full bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3 outline-none text-[#5A4032]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#FCF9F4] rounded-[16px] border border-[#E7DCCD] p-6">
                  <h2 className="text-2xl font-semibold text-[#5A4032] mb-4">
                    Payment Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#7B6253] mb-2 font-medium">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        className="w-full bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3 outline-none text-[#5A4032]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#7B6253] mb-2 font-medium">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3 outline-none text-[#5A4032]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#7B6253] mb-2 font-medium">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) =>
                            setExpiry(formatExpiry(e.target.value))
                          }
                          placeholder="MM/YY"
                          className="w-full bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3 outline-none text-[#5A4032]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#7B6253] mb-2 font-medium">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 4)
                            )
                          }
                          placeholder="123"
                          className="w-full bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3 outline-none text-[#5A4032]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FCF9F4] rounded-[16px] border border-[#E7DCCD] p-6">
                  <h2 className="text-2xl font-semibold text-[#5A4032] mb-4">
                    Billing Address
                  </h2>

                  <div className="mb-4 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="accent-[#8A674F]"
                    />
                    <label className="text-[#7B6253] font-medium">
                      Same as shipping address
                    </label>
                  </div>

                  <textarea
                    rows="4"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    disabled={sameAsShipping}
                    className="w-full bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3 outline-none text-[#5A4032] disabled:bg-[#EEE7DC]"
                  />
                </div>
              </div>

              <div className="bg-[#FCF9F4] rounded-[16px] border border-[#E7DCCD] p-6 h-fit">
                <h2 className="text-2xl font-semibold text-[#5A4032] mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                  {cart &&
                    cart.map((item, index) => {
                      const isBundle = item.itemType === "bundle";
                      const bookData = item.book || item;
                      const bundleData = item.bundle;
                      const quantity = item.quantity || 1;

                      return (
                        <div
                          key={index}
                          className="flex gap-4 items-center bg-[#F8F4EC] rounded-[12px] p-3 border border-[#E7DCCD]"
                        >
                          <img
                            src={isBundle ? bundleData?.image : bookData.url}
                            alt={isBundle ? bundleData?.title : bookData.title}
                            className="h-20 w-16 object-cover rounded"
                          />

                          <div className="flex-1">
                            <h3 className="text-[#5A4032] font-semibold">
                              {isBundle ? bundleData?.title : bookData.title}
                            </h3>

                            <p className="text-sm text-[#7B6253]">
                              {isBundle
                                ? `${bundleData?.books?.length || 0} books bundle`
                                : bookData.author}
                            </p>

                            <p className="text-sm text-[#7B6253]">
                              Quantity: {quantity}
                            </p>

                            {isBundle && (
                              <p className="text-sm text-green-700 font-semibold">
                                You saved $
                                {(
                                  (Number(item.bundleOriginalPrice || 0) -
                                    Number(item.bundlePrice || 0)) *
                                  quantity
                                ).toFixed(2)}
                              </p>
                            )}
                          </div>

                          <p className="text-[#5A4032] font-semibold">
                            $
                            {isBundle
                              ? (Number(item.bundlePrice || 0) * quantity).toFixed(2)
                              : (Number(bookData.price || 0) * quantity).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                </div>

                <div className="mt-6 border-t border-[#E7DCCD] pt-4">
                  <div className="flex justify-between text-[#5A4032] text-lg mb-2">
                    <span>Items</span>
                    <span>
                      {cart
                        ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
                        : 0}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#5A4032] text-lg mb-2">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#5A4032] text-lg mb-2">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#5A4032] text-lg mb-2">
                    <span>Payment</span>
                    <span>Card</span>
                  </div>

                  <div className="flex justify-between text-[#5A4032] text-2xl font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="mt-6 w-full bg-[#3B2218] text-[#FFF8F0] rounded-[12px] px-4 py-3 font-semibold hover:bg-[#5a3a2a] transition disabled:opacity-60"
                  >
                    {isSubmitting ? "Processing..." : "Pay & Place Order"}
                  </button>

                  <button
                    onClick={() => navigate("/cart")}
                    className="mt-3 w-full bg-[#F6EEDF] text-[#5A4032] rounded-[12px] px-4 py-3 font-semibold border border-[#E7DCCD] transition"
                  >
                    Back to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;