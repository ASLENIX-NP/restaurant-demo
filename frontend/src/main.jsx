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

import ErrorBoundary from "./components/ui/ErrorBoundary";

ReactDOM.createRoot(
 document.getElementById("root")
).render(

 <React.StrictMode>
  <ErrorBoundary>
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
  </ErrorBoundary>
 </React.StrictMode>
);
