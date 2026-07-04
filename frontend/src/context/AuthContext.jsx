import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  fetchMe,
} from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const userData = await fetchMe();
      setUser(userData.data);
    } catch (err) {
      setUser(null);
      setError(err.message || "Not authenticated");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const userData = await authLogin(credentials);
    setUser(userData.data);
    return userData;
  };

  const register = async (payload) => {
    const userData = await authRegister(payload);
    // setUser(userData);
    return userData;
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
