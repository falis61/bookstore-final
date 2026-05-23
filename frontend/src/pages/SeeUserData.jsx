import React from "react";
import { RxCross1 } from "react-icons/rx";

const SeeUserData = ({ userDivData, userDiv, setUserDiv }) => {

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`${userDiv} top-0 left-0 h-screen w-full bg-[#3B2218] opacity-70`}
      ></div>

      {/* MODAL */}
      <div
        className={`${userDiv} top-0 left-0 h-screen w-full flex items-center justify-center`}
      >
        <div className="bg-[#FBF7EF] border border-[#D6C4A8] rounded p-4 w-[80%] md:w-[50%] lg:w-[40%] text-[#3B2218] shadow-lg">

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">User Information</h1>

            <button
              onClick={() => setUserDiv("hidden")}
              className="text-[#4B2E1F] hover:text-[#C5A059] transition"
            >
              <RxCross1 />
            </button>
          </div>

          <div className="mt-2">
            <label>
              Username :{" "}
              <span className="font-semibold">{userDivData.username}</span>
            </label>
          </div>

          <div className="mt-4">
            <label>
              Email :{" "}
              <span className="font-semibold">{userDivData.email}</span>
            </label>
          </div>

          <div className="mt-4">
            <label>
              Address :{" "}
              <span className="font-semibold">{userDivData.address}</span>
            </label>
          </div>

        </div>
      </div>
    </>
  );
};

export default SeeUserData;