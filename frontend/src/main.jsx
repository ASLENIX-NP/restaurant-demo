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
   <ToastProvider>
    <AuthProvider>
     <OrderProvider>
      <TableProvider>
       <App />
      </TableProvider>
     </OrderProvider>
    </AuthProvider>
   </ToastProvider>
  </SocketProvider>

 </React.StrictMode>
);
