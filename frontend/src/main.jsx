import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { OrderProvider } from "./context/OrderContext";

import "./styles/globals.css";
import "./styles/login.css";
import "./styles/sidebar.css";
import "./styles/navbar.css";
import "./styles/dashboard.css";
import "./styles/staff.css";
import "./styles/chef.css";
import "./styles/cashier.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <OrderProvider>
      <App />
    </OrderProvider>
  </React.StrictMode>
);