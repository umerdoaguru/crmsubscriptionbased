import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/UserSlice";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1280);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      dispatch(logoutUser());
      navigate("/");
    }
  };

  const handlePower = () => {
    console.log("Power button clicked");
  };

  return (
    <div>
      {isMobile ? (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold w-8 h-8  rounded-full"
          onClick={handleLogout}
        >
          <FaPowerOff className="ms-2" />
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Logout;
