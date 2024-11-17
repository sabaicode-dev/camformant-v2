"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import socket from "@/utils/socketClient";
import { Socket } from "socket.io-client";
// interface SocketContextType {
//   onlineUsers: any[];
//   socket: any;
// }
//SocketContextType | undefined
const SocketContext = createContext<any>(undefined);

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sockets, setSockets] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAuth();
  const userId = user?._id;
  useEffect(() => {
    if (userId) {
      setSockets(socket);
      socket.on("getOnlineUsers", (users: string[]) => {
        console.log("socket online users:", users);

        setOnlineUsers(users);
      });

      return () => {
        socket.close();
      };
    } else {
      if (sockets) {
        socket.close();
        setSockets(null);
      }
    }
  }, [userId]);
  console.log("online:::", onlineUsers);

  return (
    <SocketContext.Provider value={{ sockets, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
