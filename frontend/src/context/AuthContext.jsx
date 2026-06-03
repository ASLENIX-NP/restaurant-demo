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
<<<<<<< HEAD
  const login = (
    role
  ) => {

    const mockNames = { admin: "Admin User", staff: "Alex", chef: "Chef Gordon", cashier: "Sarah" };
    const name = mockNames[role] || "System User";

    const userData = {
      role,
      name,
    };

=======
  const login = (userData) => {
>>>>>>> 288d8c3d545681d2924d369e795704171b09bb88
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