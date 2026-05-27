import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import SeeUserData from "./SeeUserData";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(true);
  const [userDiv, setUserDiv] = useState("hidden");
  const [userDivData, setUserDivData] = useState({});

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-all-users",
          { headers }
        );
        setUsers(response.data.data);
        setLoader(false);
      } catch (error) {
        console.log(error);
        setLoader(false);
      }
    };

    fetchUsers();
  }, []);

  const normalUsers = useMemo(() => {
    return users.filter((item) => item.role === "user");
  }, [users]);

  const usersWithOrders = useMemo(() => {
    return normalUsers
      .filter((item) => item.orders && item.orders.length > 0)
      .sort((a, b) => (b.orders?.length || 0) - (a.orders?.length || 0));
  }, [normalUsers]);

  const totalUsers = normalUsers.length;
  const totalUsersWithOrders = usersWithOrders.length;
  const totalOrdersPlaced = usersWithOrders.reduce(
    (total, item) => total + (item.orders ? item.orders.length : 0),
    0
  );

  if (loader) return <Loader />;

  return (
    <div className="w-full p-4 md:p-6 bg-[#F5F1E6] min-h-screen text-[#3B2218]">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">All Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#FFF8ED] border border-[#EAD7B8] rounded p-4 shadow">
          <p className="text-sm text-[#8B5E3C]">Total Users</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">{totalUsers}</h2>
        </div>

        <div className="bg-[#FFF8ED] border border-[#EAD7B8] rounded p-4 shadow">
          <p className="text-sm text-[#8B5E3C]">Users With Orders</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">
            {totalUsersWithOrders}
          </h2>
        </div>

        <div className="bg-[#FFF8ED] border border-[#EAD7B8] rounded p-4 shadow">
          <p className="text-sm text-[#8B5E3C]">Total Orders Placed</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">
            {totalOrdersPlaced}
          </h2>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Users With Orders
        </h2>

        {usersWithOrders.length === 0 ? (
          <div className="bg-[#FFF8ED] border border-[#EAD7B8] rounded p-4 shadow text-lg">
            No users with orders yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usersWithOrders.map((item, i) => (
              <div
                key={i}
                className="bg-[#FFF8ED] border border-[#EAD7B8] rounded p-4 shadow hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.profileImage || item.avatar}
                    alt="user"
                    className="w-14 h-14 rounded-full object-cover border border-[#D6C4A8]"
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.username}</h2>
                    <p className="text-sm break-all">{item.email}</p>
                    <p className="text-sm mt-1 text-[#8B5E3C] font-medium">
                      Orders: {item.orders ? item.orders.length : 0}
                    </p>
                  </div>
                </div>

                <button
                  className="mt-4 w-full bg-[#3B2218] text-[#F3E7C8] py-2 rounded hover:bg-[#4B2E1F] transition-all"
                  onClick={() => {
                    setUserDiv("fixed");
                    setUserDivData(item);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">All Users</h2>

        {normalUsers.length === 0 ? (
          <div className="text-lg">No users found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {normalUsers.map((item, i) => (
              <div
                key={i}
                className="bg-[#FFF8ED] border border-[#EAD7B8] rounded p-4 shadow hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.profileImage || item.avatar}
                    alt="user"
                    className="w-14 h-14 rounded-full object-cover border border-[#D6C4A8]"
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.username}</h2>
                    <p className="text-sm break-all">{item.email}</p>
                    <p className="text-sm mt-1 text-[#8B5E3C]">
                      Orders: {item.orders ? item.orders.length : 0}
                    </p>
                  </div>
                </div>

                <button
                  className="mt-4 w-full bg-[#3B2218] text-[#F3E7C8] py-2 rounded hover:bg-[#4B2E1F] transition-all"
                  onClick={() => {
                    setUserDiv("fixed");
                    setUserDivData(item);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SeeUserData
        userDivData={userDivData}
        userDiv={userDiv}
        setUserDiv={setUserDiv}
      />
    </div>
  );
};

export default AllUsers;