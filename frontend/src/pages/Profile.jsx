import React, { useEffect, useState } from "react";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import MobileNav from "../components/Profile/MobileNav";
import { useDispatch } from "react-redux";
import { authActions } from "../Store/auth";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const Profile = () => {
  const [Profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      const id = getStoredItem("id");
      const token = getStoredItem("token");

      if (!id || !token) {
        setLoading(false);
        navigate("/logIn");
        return;
      }

      const headers = {
        id,
        authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/get-user-information",
          { headers }
        );
        setProfile(response.data);
      } catch (error) {
        console.log(error);

        localStorage.removeItem("id");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        sessionStorage.removeItem("id");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");

        dispatch(authActions.logout());
        dispatch(authActions.ChangeRole("user"));
        navigate("/logIn");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [dispatch, navigate]);

  return (
    <div className="bg-[#F5F1E6] px-2 md:px-12 flex flex-col md:flex-row py-8 gap-4 text-white">
      {loading && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      )}

      {!loading && Profile && (
        <>
          <div className="w-full md:w-1/6">
            <Sidebar data={Profile} />
            <MobileNav />
          </div>
          <div className="w-full md:w-5/6">
            <Outlet context={{ Profile, setProfile }} />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;