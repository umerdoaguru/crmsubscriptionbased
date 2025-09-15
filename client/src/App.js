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
import GoogleOAuthCallback from "./components/GoogleOAuthCallback";
import SuperDash from "./pages/superAdmin/SuperDash";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import EmployeeDashboard from "./pages/Employees/EmployeeDashboard";
import OneLoginOnly from "./utils/OneLoginOnly";
import ResetPasswordOnly from "./utils/ResetPasswordOnly";

function App() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <Routes>
          {/* main page routes */}
          {/* <Route path="/main_page_crm" element={<Landingpage />} /> */}

          {/* Common routes */}
          <Route path="/" element={<OneLoginOnly />} />
          <Route path="/reset-password" element={<ResetPasswordOnly />} />

          <Route path="/SuperAdmin-login" element={<SuperAdminLogin />} />
          <Route
            path="/google-oauth-callback"
            element={<GoogleOAuthCallback />}
          />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route
            path="/employee-reset-password"
            element={<EmployeeResetPassword />}
          />
          <Route
            path="/admin-reset-password"
            element={<AdminResetPassword />}
          />
          <Route
            path="/superadmin-reset-password"
            element={<SuperAdminResetPassword />}
          />

          {user?.staff_role === "superadmin" ? (
            <Route path="/*" element={<SuperAdminRoutes />} />
          ) : user?.staff_role === "admin" ? (
            <Route path="/*" element={<AdminRoutes />} />
          ) : user?.staff_role === "employee" ? (
            <Route path="/*" element={<EmployeeRoutes />} />
          ) : (
            <Route path="/" element={<OneLoginOnly />} />
          )}

          {/* <Route
            path="/dashboard"
            element={
              user?.staff_role === "superadmin" ? (
                <SuperDash />
              ) : user?.staff_role === "admin" ? (
                <AdminDashboard />
              ) : user?.staff_role === "employee" ? (
                <EmployeeDashboard />
              ) : (
                <OneLoginOnly />
              )
            }
          /> */}

          {/* Catch-all route to redirect unauthorized users */}
          <Route path="*" element={<OneLoginOnly />} />

          <Route path="/admincrmdoaguru" element={<Registration />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
