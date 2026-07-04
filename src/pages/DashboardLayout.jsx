import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, BarChart3, LogOut, Settings } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div>
      <nav className="border border-black/10">
        <div className="flex items-center justify-between font-sans px-6 max-w-6xl mx-auto py-2">
          <div className="flex items-center gap-10">
            <div className="flex flex-col h-14 max-w-6xl">
              <button
                className="text-secondary font-bold text-xl flex items-center cursor-pointer tracking-tight"
                onClick={() => navigate("/")}
              >
                PENDEKIN
              </button>
              <p className="font-sans text-xs text-muted-foreground">
                URL Management Dashboard
              </p>
            </div>
            <ul className="flex gap-1 items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  location.pathname === "/dashboard"
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </button>
              <button
                onClick={() => navigate("/analytics")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  location.pathname === "/analytics"
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <BarChart3 className="size-4" />
                Analytics
              </button>
            </ul>
          </div>

          {/* Avatar + dropdown */}
          <div className="relative" ref={menuRef}>
            <div className="flex gap-3">
              <button className="cursor-pointer hover:text-primary hover:bg-black/5 px-2 rounded-full">
                <Settings className="size-5" />
              </button>
              <div
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center justify-center size-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold cursor-pointer select-none"
              >
                {getInitials(user.name)}
              </div>
            </div>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
