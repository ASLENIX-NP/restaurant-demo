import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("restaurant_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  const socket = useSocket();

  function logout() {
    setUser(null);
    localStorage.removeItem("restaurant_user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    window.location.href = "/login";
  }

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      if (user && !token) {
        logout();
      } else if (token) {
        try {
          await apiClient.get("/api/auth/profile");
        } catch (error) {
          console.error("Session verification failed:", error);
        }
      }
    };
    verifySession();
  }, [user]);

  useEffect(() => {
    if (user?.role !== "Admin") {
      setPendingUsersCount(0);
      return;
    }
    const fetchPendingCount = async () => {
      try {
        const { data } = await apiClient.get("/api/auth/users");
        const usersArray = data.users || data;
        const pending = usersArray.filter((u) => u.status === "Pending");
        setPendingUsersCount(pending.length);
      } catch (error) {
        console.error("Error fetching pending users:", error);
      }
    };
    fetchPendingCount();

    if (!socket) return;
    socket.on("newUserPending", fetchPendingCount);
    return () => socket.off("newUserPending", fetchPendingCount);
  }, [user, socket]);

  const login = async (username, password) => {
    try {
      const { data } = await apiClient.post("/api/auth/login", { username, password });
      setUser(data.user);
      localStorage.setItem("restaurant_user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      toast.success(data.message || "Logged in successfully!");
      return { success: true, role: data.user.role };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await apiClient.post("/api/auth/register", payload);
      toast.success(data.message || "Registration successful!");
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await apiClient.post("/api/auth/forgot-password", { email });
      toast.success(data.message || "Check your email for reset instructions.");
      return { success: true, message: data.message, previewUrl: data.previewUrl };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const { data } = await apiClient.post("/api/auth/reset-password", { email, otp, newPassword });
      toast.success(data.message || "Password reset successful.");
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        pendingUsersCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
