import { createContext, useContext, useState, useEffect } from"react";
import { io } from"socket.io-client";
import apiClient from"../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(() => {
 const savedUser = localStorage.getItem("restaurant_user");
 return savedUser ? JSON.parse(savedUser) : null;
 });
 const [pendingUsersCount, setPendingUsersCount] = useState(0);
 const [toastMessage, setToastMessage] = useState(null);

 // Verify token validity on app load
 useEffect(() => {
 const verifySession = async () => {
 const token = localStorage.getItem("token");
 if (user && !token) {
 logout();
 } else if (token) {
 try {
 // The interceptor will automatically handle 401 Unauthorized errors
 await apiClient.get("/api/auth/profile");
 } catch (error) {
 console.error("Session verification failed:", error);
 }
 }
 };
 verifySession();
 }, []);

 // Real-time notifications for Admin
 useEffect(() => {
 if (user?.role !=="Admin") {
 setPendingUsersCount(0);
 return;
 }

 const socket = io(import.meta.env.VITE_API_URL ||"http://localhost:5001");

 const fetchPendingCount = async () => {
 const token = localStorage.getItem("token");
 if (!token) return;
 try {
 const { data: users } = await apiClient.get("/api/auth/users");
 const pendingCount = users.filter((u) => u.status ==="Pending").length;
 setPendingUsersCount(pendingCount);
 } catch (error) {
 console.error("Failed to fetch pending users count:", error);
 }
 };

 fetchPendingCount(); // Initial fetch

 socket.on("newRegistration", (data) => {
 setPendingUsersCount((prev) => prev + 1);
 setToastMessage(data.message ||"New user registered!");
 setTimeout(() => setToastMessage(null), 5000); // Auto-hide after 5 seconds
 });
 socket.on("userStatusUpdated", () => fetchPendingCount()); // Re-fetch to get accurate count

 return () => socket.disconnect();
 }, [user]);

 const login = async (username, password) => {
 try {
 const { data } = await apiClient.post("/api/auth/login", { username, password });

 // On successful login
 setUser(data.user);
 localStorage.setItem("token", data.token); // Save the JWT token
 localStorage.setItem("restaurant_user", JSON.stringify(data.user)); // Keep user object for UI

 return { success: true, role: data.user.role };
 } catch (error) {
 console.error("Login context error:", error);
 return { success: false, message: error.response?.data?.message || error.message };
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
 const { data } = await apiClient.post("/api/auth/register", {
 username,
 password,
 confirmPassword,
 name,
 email,
 phone,
 role,
 });

 return { success: true, message: data.message };
 } catch (error) {
 console.error("Registration context error:", error);
 return { success: false, message: error.response?.data?.message || error.message };
 }
 };

 const logout = () => {
 setUser(null);
 localStorage.removeItem("restaurant_user");
 localStorage.removeItem("token"); // Also remove the auth token
 window.location.href ="/"; // Force a hard reload to clear any mock DB cache
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
 position:"fixed",
 top:"20px",
 right:"20px",
 backgroundColor:"#10b981", // Emerald 500
 color:"white",
 padding:"16px 20px",
 borderRadius:"12px",
 boxShadow:"0 10px 15px -3px rgba(0, 0, 0, 0.1)",
 zIndex: 99999,
 fontWeight:"bold",
 display:"flex",
 alignItems:"center",
 gap:"12px",
 }}
 >
 <span style={{ fontSize:"20px" }}>🔔</span>
 {toastMessage}
 <button
 onClick={() => setToastMessage(null)}
 style={{
 background:"transparent",
 border:"none",
 color:"white",
 cursor:"pointer",
 marginLeft:"10px",
 fontSize:"16px",
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
