import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "admin") {
      navigate("/admin");
    }

    if (role === "staff") {
      navigate("/staff");
    }

    if (role === "cashier") {
      navigate("/cashier");
    }

    if (role === "chef") {
      navigate("/chef");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LEFT SIDE */}
        <div className="login-left">
          <h1>ASLENIX ERP</h1>

          <p>
            Restaurant Management System
          </p>

          <div className="role-preview">
            <div className="preview-card">
              👑 Admin Panel
            </div>

            <div className="preview-card">
              👨‍💼 Staff Panel
            </div>

            <div className="preview-card">
              💰 Cashier Panel
            </div>

            <div className="preview-card">
              👨‍🍳 Kitchen Panel
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="input-group">
              <label>Select Role</label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >
                <option value="admin">
                  Admin
                </option>

                <option value="staff">
                  Staff
                </option>

                <option value="cashier">
                  Cashier
                </option>

                <option value="chef">
                  Chef
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;