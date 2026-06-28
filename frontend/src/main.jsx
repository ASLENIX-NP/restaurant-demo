import React from"react";
import ReactDOM from"react-dom/client";

import App from"./App";

import"./index.css";

import { SocketProvider } from "./context/SocketContext";

import {
 OrderProvider,
} from"./context/OrderContext";

import {
 AuthProvider,
} from"./context/AuthContext";

import {
 TableProvider,
} from"./context/TableContext";

import { ToastProvider } from "./context/ToastContext";

ReactDOM.createRoot(
 document.getElementById("root")
).render(

 <React.StrictMode>

  <SocketProvider>

   <AuthProvider>

    <OrderProvider>

     <TableProvider>

      <ToastProvider>

       <App />

      </ToastProvider>

     </TableProvider>

    </OrderProvider>

   </AuthProvider>

  </SocketProvider>

 </React.StrictMode>
);
