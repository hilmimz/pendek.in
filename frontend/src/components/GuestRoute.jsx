import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { useEffect } from "react";

NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.2,
});

export function GuestRoute() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }

    return () => {
      NProgress.done();
    };
  }, [loading]);

  if (loading) {
    return null;
  }

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
