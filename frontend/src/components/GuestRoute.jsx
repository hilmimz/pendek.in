import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Atau komponen loading kustom
  }

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
