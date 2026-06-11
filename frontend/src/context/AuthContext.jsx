import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("restaurant_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Verify token validity on app load
  useEffect(() => {
    const verifySession = async () => {
      const token = sessionStorage.getItem("token");
      if (user && !token) {
        logout();
      } else if (token) {
        try {
          const response = await fetch(
            "http://localhost:5001/api/auth/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) {
            // Token expired or invalid
            logout();
          }
        } catch (error) {
          console.error("Session verification failed:", error);
        }
      }
    };
    verifySession();
  }, []);

  // Real-time notifications for Admin
  useEffect(() => {
    if (user?.role !== "Admin") {
      setPendingUsersCount(0);
      return;
    }

    const socket = io("http://localhost:5001");

    const fetchPendingCount = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("http://localhost:5001/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const users = await response.json();
          const pendingCount = users.filter(
            (u) => u.status === "Pending"
          ).length;
          setPendingUsersCount(pendingCount);
        }
      } catch (error) {
        console.error("Failed to fetch pending users count:", error);
      }
    };

    fetchPendingCount(); // Initial fetch

    socket.on("newRegistration", (data) => {
      setPendingUsersCount((prev) => prev + 1);
      setToastMessage(data.message || "New user registered!");
      setTimeout(() => setToastMessage(null), 5000); // Auto-hide after 5 seconds
    });
    socket.on("userStatusUpdated", () => fetchPendingCount()); // Re-fetch to get accurate count

    return () => socket.disconnect();
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // On successful login
      setUser(data.user);
      sessionStorage.setItem("token", data.token); // Save the JWT token
      sessionStorage.setItem("restaurant_user", JSON.stringify(data.user)); // Keep user object for UI

      return { success: true, role: data.user.role };
    } catch (error) {
      console.error("Login context error:", error);
      return { success: false, message: error.message };
    }
  };

  const register = async ({
    username,
    password,
    confirmPassword,
    name,
    email,
    phone,
    role,
  }) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
          name,
          email,
          phone,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Registration context error:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("restaurant_user");
    sessionStorage.removeItem("token"); // Also remove the auth token
    window.location.href = "/"; // Force a hard reload to clear any mock DB cache
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        pendingUsersCount,
      }}
    >
      {children}

      {/* Global Real-Time Toast Notification for Admins */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#10b981", // Emerald 500
            color: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            zIndex: 99999,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "20px" }}>🔔</span>
          {toastMessage}
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              marginLeft: "10px",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
