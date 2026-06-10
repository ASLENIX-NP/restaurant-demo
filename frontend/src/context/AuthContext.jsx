import { createContext, useContext, useState } from "react";
import {
  getUsers,
  saveUsers,
  getPendingApplications,
  savePendingApplications,
} from "../utils/users";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("restaurant_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username, password) => {
    const normalizedUsername = username?.trim().toLowerCase();
    const users = getUsers() || [];
    const pendingApplications = getPendingApplications() || [];

    const pendingUser = pendingApplications.find(
      (app) => app?.username?.toLowerCase() === normalizedUsername
    );

    if (pendingUser) {
      return {
        success: false,
        message: "Your account is pending admin approval.",
      };
    }

    const foundUser = users.find(
      (u) => u?.username?.toLowerCase() === normalizedUsername
    );

    if (foundUser && password === foundUser.password) {
      setUser(foundUser);
      localStorage.setItem("restaurant_user", JSON.stringify(foundUser));
      return { success: true, role: foundUser.role };
    }

    return { success: false, message: "Invalid credentials" };
  };

  const register = async ({ username, password, name, email, phone, role }) => {
    const trimmedUsername = username?.trim().toLowerCase();
    if (!trimmedUsername || !password || !name || !email || !phone || !role) {
      return { success: false, message: "Please fill in all required fields." };
    }

    const users = getUsers() || [];
    const pendingApplications = getPendingApplications() || [];

    const usernameExists = users.some(
      (user) => user?.username?.toLowerCase() === trimmedUsername
    );

    const pendingExists = pendingApplications.some(
      (app) => app?.username?.toLowerCase() === trimmedUsername
    );

    if (usernameExists || pendingExists) {
      return {
        success: false,
        message: "That username is already taken or waiting for approval.",
      };
    }

    const application = {
      id: `app-${Date.now()}`,
      username: trimmedUsername,
      password,
      name,
      email,
      phone,
      role,
      status: "Pending Approval",
      requestedAt: new Date().toISOString(),
    };

    savePendingApplications([...pendingApplications, application]);
    return {
      success: true,
      message: "Registration request submitted. Please wait for admin approval.",
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("restaurant_user");
    window.location.href = "/"; // Force a hard reload to clear any mock DB cache
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
