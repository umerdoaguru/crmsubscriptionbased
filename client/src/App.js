import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import "./index.css";

// Employee Module

// Routes
import AdminRoutes from "./routes/AdminRoutes";
import EmployeeRoutes from "./routes/EmployeeRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

// Auth Components
import AdminLogin from "./components/AdminLogin";
import EmployeeLogin from "./components/EmployeeModule/EmployeeLogin";
import SuperAdminLogin from "./components/SuperAdminLogin";
import Registration from "./components/Registration";

// Header & Landing Page
import Landingpage from "./pages/Landingpage";
import EmployeeResetPassword from "./components/EmployeeModule/EmployeeResetPassword";
import AdminResetPassword from "./components/AdminResetPassword";
import SuperAdminResetPassword from "./components/SuperAdminResetPassword";

function App() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <Routes>
          {/* main page routes */}
          <Route path="/main_page_crm" element={<Landingpage />} />

          {/* Common routes */}
          <Route path="/SuperAdmin-login" element={<SuperAdminLogin />} />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/employee-reset-password" element={<EmployeeResetPassword />} />
          <Route path="/admin-reset-password" element={<AdminResetPassword />} />
          <Route path="/superadmin-reset-password" element={<SuperAdminResetPassword />} />

          
          {/* Conditionally render Admin or Employee routes based on user's role
        {user?.roles === 'Admin' ? (<Route path="/*" element={<AdminRoutes />} />) : user?.roles === 'Employee' ? (<Route path="/*" element={<EmployeeRoutes />} />) :
         ( <Route path="/" element={<Navigate to="/main_page_crm" />} /> )} */}

          {user?.roles === "Super-Admin" ? (
            <Route path="/*" element={<SuperAdminRoutes />} />
          ) : user?.roles === "Admin" ? (
            <Route path="/*" element={<AdminRoutes />} />
          ) : user?.roles === "Employee" ? (
            <Route path="/*" element={<EmployeeRoutes />} />
          ) : (
            <Route path="/" element={<Navigate to="/main_page_crm" />} />
          )}
          
          {/* Catch-all route to redirect unauthorized users */}
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/admincrmdoaguru" element={<Registration />} />

        </Routes>
      </div>
    </>
  );
}

export default App;
