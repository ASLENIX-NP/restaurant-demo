import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  getUsers,
} from "../../utils/users";

import "../../styles/login.css";

const Login = () => {

  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  // LOGIN
  const handleLogin = () => {

    const users =
      getUsers();

    const foundUser =
      users.find(
        (user) =>
          user.username ===
            username &&
          user.password ===
            password
      );

    // INVALID LOGIN
    if (!foundUser) {

      setError(
        "Invalid username or password"
      );

      return;
    }

    // SAVE LOGIN
    login(
      foundUser.role
    );

    // REDIRECT
    navigate(
      `/${foundUser.role}`
    );
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>
          ASLENIX ERP
        </h1>

        <p>
          Restaurant Management System
        </p>

        {/* USERNAME */}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        {/* ERROR */}

        {error && (

          <div className="login-error">
            {error}
          </div>

        )}

        {/* LOGIN BUTTON */}

        <button
          onClick={handleLogin}
        >
          Login
        </button>

        {/* DEMO USERS */}

        <div className="demo-users">

          <h3>
            Default Accounts
          </h3>

          <p>
            admin / admin123
          </p>

          <p>
            staff / staff123
          </p>

          <p>
            chef / chef123
          </p>

          <p>
            cashier / cashier123
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;