import React, { useMemo, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFeatherAlt,
  FaClock,
  FaWhatsapp,
  FaChevronDown,
  FaPaperPlane,
  FaBookOpen,
  FaHeadset,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../Store/auth";
import toast from "react-hot-toast";

const Contact = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "Order Inquiry",
    preferredReply: "Email",
    message: "",
    notRobot: false,
  });

  const [activeFaq, setActiveFaq] = useState(null);

  const topics = [
    "Order Inquiry",
    "General Question",
    "Book Suggestion",
    "Shipping Help",
    "Rare Book Request",
    "Bulk Purchase",
  ];

  const faqs = [
    {
      q: "How long does it take to get a reply?",
      a: "We usually respond within 24 hours during business days. Order-related requests are often answered sooner.",
    },
    {
      q: "Can I request a book that is not listed on the website?",
      a: "Yes. Send us the title, author, or any details you have, and we will do our best to help you find it.",
    },
    {
      q: "Do you help with reading recommendations?",
      a: "Absolutely. Tell us the genre, age group, or reading mood you want, and we can recommend books for you.",
    },
    {
      q: "Can I ask about my order here?",
      a: "Yes. Add your order number in the form if you have one, and we will help you check the status.",
    },
  ];

  const toastStyle = {
    style: {
      background: "#6A4A3A",
      color: "#FFF8F0",
      border: "1px solid #D2B07A",
    },
  };

  const emailValid = useMemo(() => {
    if (!formData.email.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  }, [formData.email]);

  const messageLimit = 700;
  const remainingChars = messageLimit - formData.message.length;

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const chooseTopic = (topic) => {
    setFormData((prev) => ({
      ...prev,
      subject: topic,
    }));
  };

  const handleEmailUs = () => {
    window.location.href = "mailto:luulmohamud865@gmail.com";
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/905385849112", "_blank");
  };

  const handleSendMessage = () => {
    if (
      formData.name.trim() === "" ||
      formData.email.trim() === "" ||
      formData.message.trim() === ""
    ) {
      toast("Please fill in your name, email, and message.", toastStyle);
      return;
    }

    if (!emailValid) {
      toast("Please enter a valid email address.", toastStyle);
      return;
    }

    if (formData.message.length > messageLimit) {
      toast(`Message must stay under ${messageLimit} characters.`, toastStyle);
      return;
    }

    if (!formData.notRobot) {
      toast("Please confirm that you are not a robot.", toastStyle);
      return;
    }

    const subject = encodeURIComponent(
      `${formData.subject}${
        formData.orderNumber ? ` - Order #${formData.orderNumber}` : ""
      }`
    );

    const body = encodeURIComponent(
      `Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "N/A"}
Preferred Reply: ${formData.preferredReply}
Order Number: ${formData.orderNumber || "N/A"}
Subject: ${formData.subject}

Message:
${formData.message}`
    );

    window.location.href = `mailto:luulmohamud865@gmail.com?subject=${subject}&body=${body}`;

    toast("Opening your email app...", toastStyle);

    setFormData({
      name: "",
      email: "",
      phone: "",
      orderNumber: "",
      subject: "Order Inquiry",
      preferredReply: "Email",
      message: "",
      notRobot: false,
    });
  };

  const handleReturnToShop = () => {
    navigate("/all-books");
  };

  const handleSignOut = () => {
    dispatch(authActions.logout());
    dispatch(authActions.ChangeRole("user"));
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="bg-[#F8F4EC] min-h-screen px-4 md:px-8 lg:px-10 py-6 md:py-8">
      <div className="max-w-7xl mx-auto bg-[#FCF9F4] border border-[#E7DCCD] rounded-[18px] shadow-[0_8px_24px_rgba(90,64,50,0.08)] overflow-hidden">
        <div className="px-5 md:px-7 lg:px-8 py-7 md:py-8 bg-[#FCF9F4] border-b border-[#E7DCCD]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-5 lg:gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E7DCCD] bg-[#F8F4EC] px-4 py-2 text-[#6A4A3A] text-sm tracking-wide">
                <FaFeatherAlt />
                The BookNestSupport
              </div>

                <h1 className="text-4xl md:text-5xl font-semibold text-[#3B2218] mb-8">
                GET IN TOUCH
              </h1>

              <p className="mt-4 text-[#7B6253] text-[15px] md:text-lg max-w-xl leading-7 md:leading-8">
                We are here to help with your orders, book questions,
                recommendations, and special requests. Reach out anytime and
                we’ll make your experience feel personal and easy.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleEmailUs}
                  className="bg-[#3B2218] text-[#FFF8F0] px-5 md:px-6 py-2.5 rounded-[12px] text-sm md:text-base font-semibold hover:bg-[#5A3A2A] transition"
                >
                  EMAIL US
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="border border-[#3B2218] text-[#3B2218] px-5 md:px-6 py-2.5 rounded-[12px] text-sm md:text-base font-semibold hover:bg-[#3B2218] hover:text-[#FFF8F0] transition"
                >
                  WHATSAPP
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F8F4EC] border border-[#E7DCCD] rounded-[14px] p-4 shadow-sm">
                <FaClock className="text-[#8A674F] text-lg md:text-xl mb-2.5" />
                <p className="text-[#8B6D5A] text-xs md:text-sm">Reply Time</p>
                <h3 className="text-[#5A4032] text-base md:text-lg font-semibold mt-1">
                  Within 24h
                </h3>
              </div>

              <div className="bg-[#F8F4EC] border border-[#E7DCCD] rounded-[14px] p-4 shadow-sm">
                <FaBookOpen className="text-[#8A674F] text-lg md:text-xl mb-2.5" />
                <p className="text-[#8B6D5A] text-xs md:text-sm">Topics</p>
                <h3 className="text-[#5A4032] text-base md:text-lg font-semibold mt-1">
                  Orders & Books
                </h3>
              </div>

              <div className="bg-[#F8F4EC] border border-[#E7DCCD] rounded-[14px] p-4 shadow-sm">
                <FaHeadset className="text-[#8A674F] text-lg md:text-xl mb-2.5" />
                <p className="text-[#8B6D5A] text-xs md:text-sm">Support</p>
                <h3 className="text-[#5A4032] text-base md:text-lg font-semibold mt-1">
                  Personal Help
                </h3>
              </div>

              <div className="bg-[#F8F4EC] border border-[#E7DCCD] rounded-[14px] p-4 shadow-sm">
                <FaMapMarkerAlt className="text-[#8A674F] text-lg md:text-xl mb-2.5" />
                <p className="text-[#8B6D5A] text-xs md:text-sm">Location</p>
                <h3 className="text-[#5A4032] text-base md:text-lg font-semibold mt-1">
                  Istanbul
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 md:px-7 lg:px-8 py-7 md:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[0.82fr_1.38fr] gap-5 lg:gap-6">
            <div className="space-y-5">
              <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-[#8A674F] text-base md:text-lg" />
                    <h2 className="text-[24px] md:text-[28px] font-semibold text-[#5A4032]">
                      OUR LOCATION
                    </h2>
                  </div>
                  <FaFeatherAlt className="text-[#AA8771] text-sm md:text-base" />
                </div>

                <div className="h-[2px] bg-[#E7DCCD] mb-4"></div>

                <p className="text-[#5A4032] text-base md:text-lg leading-7 md:leading-8 mb-4">
                  The Book Nook
                  <br />
                  İstiklal Avenue
                  <br />
                  Beyoğlu, Istanbul
                </p>

                <div className="overflow-hidden rounded-[12px] border border-[#E7DCCD] bg-[#F8F4EC]">
                  <iframe
                    title="Book Nook Location"
                    src="https://www.google.com/maps?q=Istiklal+Avenue,+Beyo%C4%9Flu,+Istanbul&output=embed"
                    className="w-full h-[210px] md:h-[220px]"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-[#8A674F] text-base md:text-lg" />
                    <h2 className="text-[24px] md:text-[28px] font-semibold text-[#5A4032]">
                      CONTACT INFORMATION
                    </h2>
                  </div>
                  <FaFeatherAlt className="text-[#AA8771] text-sm md:text-base" />
                </div>

                <div className="h-[2px] bg-[#E7DCCD] mb-4"></div>

                <div className="space-y-3.5 text-[#5A4032]">
                  <a
                    href="mailto:luulmohamud865@gmail.com"
                    className="flex items-center gap-4 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3.5 hover:bg-[#F3EEE5] transition"
                  >
                    <FaEnvelope className="text-[#8A674F] text-base" />
                    <p className="text-base md:text-lg">luulmohamud865@gmail.com</p>
                  </a>

                  <a
                    href="tel:+902123456789"
                    className="flex items-center gap-4 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3.5 hover:bg-[#F3EEE5] transition"
                  >
                    <FaPhoneAlt className="text-[#8A674F] text-base" />
                    <p className="text-base md:text-lg">+90 5385849112</p>
                  </a>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-4 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 py-3.5 hover:bg-[#F3EEE5] transition text-left"
                  >
                    <FaWhatsapp className="text-[#8A674F] text-base" />
                    <p className="text-[#5A4032] text-base md:text-lg">
                      Chat on WhatsApp
                    </p>
                  </button>
                </div>
              </div>

              <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-[#8A674F] text-base md:text-lg" />
                    <h2 className="text-[24px] md:text-[28px] font-semibold text-[#5A4032]">
                      BUSINESS HOURS
                    </h2>
                  </div>
                  <FaFeatherAlt className="text-[#AA8771] text-sm md:text-base" />
                </div>

                <div className="h-[2px] bg-[#E7DCCD] mb-4"></div>

                <div className="space-y-3 text-[#5A4032] text-sm md:text-base">
                  <div className="flex justify-between border-b border-[#E7DCCD] pb-2.5">
                    <span>Monday - Friday</span>
                    <span>09:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E7DCCD] pb-2.5">
                    <span>Saturday</span>
                    <span>10:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>11:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <FaPaperPlane className="text-[#8A674F] text-base md:text-lg" />
                  <h2 className="text-[24px] md:text-[28px] font-semibold text-[#5A4032]">
                    SEND A MESSAGE
                  </h2>
                </div>

                <div className="h-[2px] bg-[#E7DCCD] mb-4"></div>

                <p className="text-[#7B6253] text-sm md:text-base mb-5 leading-7">
                  Choose a topic to make your message faster and clearer.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-5">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => chooseTopic(topic)}
                      className={`px-4 py-2 rounded-full border text-sm md:text-[15px] font-medium transition ${
                        formData.subject === topic
                          ? "bg-[#3B2218] text-[#FFF8F0] border-[#3B2218]"
                          : "bg-[#F8F4EC] text-[#3B2218] border-[#E7DCCD] hover:bg-[#3B2218] hover:text-[#FFF8F0] hover:border-[#3B2218]"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={change}
                      placeholder="Enter your name"
                      className="w-full h-11 md:h-12 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 text-[#5A4032] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={change}
                      placeholder="you@book.com"
                      className={`w-full h-11 md:h-12 bg-[#F8F4EC] border rounded-[12px] px-4 text-[#5A4032] outline-none focus:ring-2 ${
                        emailValid
                          ? "border-[#E7DCCD] focus:ring-[#D2B07A]"
                          : "border-red-400 focus:ring-red-300"
                      }`}
                    />
                    {!emailValid && (
                      <p className="text-red-600 text-sm mt-2">
                        Please enter a valid email address.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={change}
                      placeholder="+90..."
                      className="w-full h-11 md:h-12 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 text-[#5A4032] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={change}
                      placeholder="Optional"
                      className="w-full h-11 md:h-12 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 text-[#5A4032] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={change}
                      className="w-full h-11 md:h-12 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 text-[#5A4032] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                    >
                      {topics.map((topic) => (
                        <option key={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#5A4032] text-base md:text-lg mb-2">
                      Preferred Reply
                    </label>
                    <select
                      name="preferredReply"
                      value={formData.preferredReply}
                      onChange={change}
                      className="w-full h-11 md:h-12 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] px-4 text-[#5A4032] outline-none focus:ring-2 focus:ring-[#D2B07A]"
                    >
                      <option>Email</option>
                      <option>Phone</option>
                      <option>WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[#5A4032] text-base md:text-lg">
                      Message *
                    </label>
                    <span
                      className={`text-sm ${
                        remainingChars < 0 ? "text-red-600" : "text-[#8B6D5A]"
                      }`}
                    >
                      {formData.message.length}/{messageLimit}
                    </span>
                  </div>

                  <textarea
                    rows="6"
                    name="message"
                    value={formData.message}
                    onChange={change}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] p-4 text-[#5A4032] outline-none focus:ring-2 focus:ring-[#D2B07A] resize-none leading-7"
                  />
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4 items-end">
                  <label className="flex items-center gap-3 bg-[#F8F4EC] border border-[#E7DCCD] rounded-[12px] min-h-[70px] px-4 py-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="notRobot"
                      checked={formData.notRobot}
                      onChange={change}
                      className="w-5 h-5 accent-[#8A674F]"
                    />
                    <span className="text-[#5A4032] text-sm md:text-base">
                      I'm not a robot
                    </span>
                  </label>

                  <button
                    onClick={handleSendMessage}
                    className="w-full bg-[#3B2218] text-[#FFF8F0] py-3 rounded-[12px] text-lg md:text-xl font-medium hover:bg-[#5A3A2A] transition"
                  >
                    SEND MESSAGE
                  </button>
                </div>
              </div>

              <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <FaFeatherAlt className="text-[#8A674F] text-base md:text-lg" />
                  <h2 className="text-[24px] md:text-[28px] font-semibold text-[#5A4032]">
                    FREQUENTLY ASKED QUESTIONS
                  </h2>
                </div>

                <div className="h-[2px] bg-[#E7DCCD] mb-4"></div>

                <div className="space-y-3">
                  {faqs.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[14px] border border-[#E7DCCD] bg-[#F8F4EC] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveFaq(activeFaq === index ? null : index)
                        }
                        className="w-full flex items-center justify-between px-4 py-4 text-left"
                      >
                        <span className="text-[#5A4032] text-sm md:text-base font-medium pr-4">
                          {item.q}
                        </span>
                        <FaChevronDown
                          className={`text-[#8A674F] transition ${
                            activeFaq === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {activeFaq === index && (
                        <div className="px-4 pb-4 text-[#7B6253] leading-7 text-sm md:text-base">
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[16px] px-6 py-5 flex flex-col md:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleReturnToShop}
                  className="bg-[#3B2218] text-[#FFF8F0] px-8 py-3 rounded-[12px] text-lg md:text-2xl font-semibold hover:bg-[#5A3A2A] transition"
                >
                  RETURN TO THE SHOP
                </button>

                <button
                  onClick={handleSignOut}
                  className="text-[#3B2218] text-base md:text-lg font-medium hover:text-[#5A3A2A] transition"
                >
                  [Sign Out]
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;