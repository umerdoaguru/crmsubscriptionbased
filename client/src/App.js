import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import "./index.css";
// Routes
import AdminRoutes from "./routes/AdminRoutes";
import EmployeeRoutes from "./routes/EmployeeRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

// Auth Components
import GoogleOAuthCallback from "./components/GoogleOAuthCallback";
import OneLoginOnly from "./utils/OneLoginOnly";
import ResetPasswordOnly from "./utils/ResetPasswordOnly";

function App() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <Routes>
          {/* Common routes */}
          <Route path="/" element={<OneLoginOnly />} />
          <Route path="/reset-password" element={<ResetPasswordOnly />} />
          <Route
            path="/google-oauth-callback"
            element={<GoogleOAuthCallback />}
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

          {/* Catch-all route to redirect unauthorized users */}
          <Route path="*" element={<OneLoginOnly />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
