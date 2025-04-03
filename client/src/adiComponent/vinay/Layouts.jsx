import React, { useState } from "react";
import SuperHeader from "./SuperHeader";
import SuperAdminSider from "./SuperAdminSider";

function Layouts() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    console.log("toggleSidebar clicked"); // Add this to check if it’s firing
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SuperHeader toggleSidebar={toggleSidebar} />
      <SuperAdminSider isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}

export default Layouts;
