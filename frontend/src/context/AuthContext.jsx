import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("restaurant_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // LOGIN
  const login = async (username, password) => {
    // Hardcoded local mock users for testing
    const validUsers = {
      admin: {
        id: "u1",
        name: "Admin Account",
        role: "admin",
        username: "admin",
        password: "admin123",
      },
      chef: {
        id: "u2",
        name: "Chef Account",
        role: "chef",
        username: "chef",
        password: "chef123",
      },
      staff: {
        id: "u3",
        name: "Staff Account",
        role: "staff",
        username: "staff",
        password: "staff123",
      },
      cashier: {
        id: "u4",
        name: "Cashier Account",
        role: "cashier",
        username: "cashier",
        password: "cashier123",
      },
    };

    const foundUser = validUsers[username.toLowerCase()];

    // Check against individual role passwords
    if (foundUser && password === foundUser.password) {
      setUser(foundUser);
      localStorage.setItem("restaurant_user", JSON.stringify(foundUser));
      return { success: true, role: foundUser.role };
    }

    return { success: false, message: "Invalid credentials" };
  };

  // LOGOUT
  const logout = () => {
    setUser(null);

    localStorage.removeItem("restaurant_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
