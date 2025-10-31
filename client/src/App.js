import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import AdminRoutes from "./routes/AdminRoutes";
import EmployeeRoutes from "./routes/EmployeeRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import GoogleOAuthCallback from "./components/GoogleOAuthCallback";
import OneLoginOnly from "./utils/OneLoginOnly";
import ResetPasswordOnly from "./utils/ResetPasswordOnly";
import axios from "axios";
import UniSubPage from "./pages/UniSubPage";
import { logoutUser } from "./store/UserSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSubActive, setIsSubActive] = useState(false);

  const checkSubStatus = async () => {
    if (!user?.token || !user?.staff_org_id) {
      setIsTokenValid(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/checkSubscriptionValidity/${user.staff_org_id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setIsTokenValid(true);

      // ✅ Check subscription status
      if (Array.isArray(data) && data.length > 0) {
        setIsSubActive(data[0].sub_status === "active");
      } else {
        setIsSubActive(false);
      }
    } catch (error) {
      console.error("checkSubStatus error:", error);

      // ✅ Token expired or unauthorized → logout
      if (error?.response?.data?.message === "Unauthorized - Token Expired") {
        dispatch(logoutUser());
        navigate("/");
      }

      setIsTokenValid(false);
      setIsSubActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      checkSubStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  console.log(isTokenValid, user);

  const renderRoutes = () => {
    // 🧩 Not logged in or invalid token
    if (!isTokenValid || !user) {
      return (
        <>
          <Route path="/" element={<OneLoginOnly />} />
          <Route path="/reset-password" element={<ResetPasswordOnly />} />
          <Route
            path="/google-oauth-callback"
            element={<GoogleOAuthCallback />}
          />
          <Route path="*" element={<OneLoginOnly />} />
        </>
      );
    }

    // 🧩 Token valid → Check subscription
    if (isSubActive) {
      switch (user?.staff_role) {
        case "superadmin":
          return <Route path="/*" element={<SuperAdminRoutes />} />;
        case "admin":
          return <Route path="/*" element={<AdminRoutes />} />;
        case "employee":
          return <Route path="/*" element={<EmployeeRoutes />} />;
        default:
          return <Route path="/" element={<OneLoginOnly />} />;
      }
    } else {
      return <Route path="/*" element={<UniSubPage />} />;
    }
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Routes>{renderRoutes()}</Routes>
    </div>
  );
}

export default App;
