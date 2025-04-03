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
    setIsMobile(window.innerWidth <= 1280); // Adjust threshold as needed
  };

  useEffect(() => {
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize); // Listen for window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup listener on unmount
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
    // Add your logic for the power button here
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
        // <FaPowerOff
        //   className=" text font-bold py-2 px-4 rounded"
        //   onClick={handlePower}
        // />
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
