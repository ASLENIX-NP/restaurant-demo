import React from"react";
import ReactDOM from"react-dom/client";

import App from"./App";

import"./index.css";

import {
 OrderProvider,
} from"./context/OrderContext";

import {
 AuthProvider,
} from"./context/AuthContext";

import {
 TableProvider,
} from"./context/TableContext";

ReactDOM.createRoot(
 document.getElementById("root")
).render(

 <React.StrictMode>

 <AuthProvider>

 <OrderProvider>

 <TableProvider>

 <App />

 </TableProvider>

 </OrderProvider>

 </AuthProvider>

 </React.StrictMode>
);
