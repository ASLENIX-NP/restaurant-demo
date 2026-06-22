import React, { createContext, useContext, useEffect, useState } from"react";
import { io } from"socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
 const [socket, setSocket] = useState(null);

 useEffect(() => {
 // Initialize the socket connection once globally
 const newSocket = io("http://localhost:5001");
 setSocket(newSocket);

 // Clean up the connection when the app is closed
 return () => newSocket.disconnect();
 }, []);

 return (
 <SocketContext.Provider value={socket}>
 {children}
 </SocketContext.Provider>
 );
};

export const useSocket = () => {
 return useContext(SocketContext);
};
