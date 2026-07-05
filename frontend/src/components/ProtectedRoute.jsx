import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { useEffect } from "react";

export function ProtectedRoute() {
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

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
}
