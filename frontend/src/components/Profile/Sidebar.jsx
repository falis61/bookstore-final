import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../Store/auth";

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const role = useSelector((state) => state.auth.role);

  return (
    <div className="bg-[#3B2218] p-5 rounded flex flex-col min-h-screen lg:min-h-[105vh]">
      <div className="flex flex-col flex-1">
        {/* PROFILE */}
        <div className="flex flex-col items-center text-center">
          <img
            src={data.profileImage || data.avatar}
            alt="profile"
            className="h-[12vh] w-[12vh] rounded-full object-cover border-2 border-[#E6C89A]"
          />

          <p className="mt-3 text-xl text-[#F3E7C8] font-semibold">
            {data.username}
          </p>

          <p className="mt-1 text-sm text-[#F3E7C8] break-all">
            {data.email}
          </p>
        </div>

        <div className="w-full mt-6 mb-4 h-px bg-[#E6C89A] hidden lg:block"></div>

        {/* MENU */}
        {role === "user" && (
          <div className="flex flex-col flex-1 space-y-3">
            <Link to="/profile" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Personal Info
            </Link>

            <Link to="/profile/address" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Address
            </Link>

            <Link to="/profile/favourites" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Favourites
            </Link>

            <Link to="/profile/orderHistory" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Order History
            </Link>

            <Link to="/profile/settings" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Settings
            </Link>
          </div>
        )}

        {role === "admin" && (
          <div className="flex flex-col flex-1 space-y-3">
            <Link to="/profile" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Dashboard
            </Link>

            <Link to="/profile/orders" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              All Orders
            </Link>

            <Link to="/profile/add-book" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Add Book
            </Link>

            <Link to="/profile/add-author" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Add Author
            </Link>

            <Link to="/profile/manage-authors" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Manage Authors
            </Link>

            <Link to="/profile/add-bundle" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Add Bundle
            </Link>

            <Link to="/profile/manage-bundles" className="text-[#F3E7C8] font-semibold py-3 px-4 hover:bg-[#F5E6D3] hover:text-[#3B2218] rounded">
              Manage Bundles
            </Link>
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <button
        className="bg-[#E6C89A] text-[#3B2218] w-full mt-6 font-semibold flex items-center justify-center py-3 rounded hover:bg-[#F5E6D3] transition"
        onClick={() => {
          dispatch(authActions.logout());
          dispatch(authActions.ChangeRole("user"));

          localStorage.removeItem("id");
          localStorage.removeItem("token");
          localStorage.removeItem("role");

          sessionStorage.removeItem("id");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("role");

          history("/");
        }}
      >
        Log out <FaArrowRightFromBracket className="ms-3" />
      </button>
    </div>
  );
};

export default Sidebar;