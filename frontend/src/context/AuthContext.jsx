import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(() => {

      const savedUser =
        localStorage.getItem(
          "restaurant_user"
        );

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    });

  // LOGIN
  const login = (
    role
  ) => {

    const mockNames = { admin: "Admin User", staff: "Alex", chef: "Chef Gordon", cashier: "Sarah" };
    const name = mockNames[role] || "System User";

    const userData = {
      role,
      name,
    };

    setUser(userData);

    localStorage.setItem(
      "restaurant_user",
      JSON.stringify(userData)
    );
  };

  // LOGOUT
  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      "restaurant_user"
    );
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

export const useAuth = () =>
  useContext(AuthContext);