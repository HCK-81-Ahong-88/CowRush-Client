// SocketContext.jsx
import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
const SocketContext = createContext(socket);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
