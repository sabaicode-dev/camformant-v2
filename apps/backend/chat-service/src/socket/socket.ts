import { Server, Socket } from "socket.io";
import axios from "axios";
import configs from "../config";
interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  conversationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSocketMap: { [key: string]: string } = {}; //{userId:value}

const setupSocketIO = (io: Server) => {
  const online = Object.keys(userSocketMap);
  io.emit("getOnlineUsers", online);
  io.on("connection", (socket: Socket) => {
    // console.log("user socket id:::", socket.id);

    const cookies = socket.handshake.headers["cookie"];

    if (cookies) {
      const userIdCookie = cookies
        .split("; ")
        .find((cookie) => cookie.startsWith("user_id="));
      if (userIdCookie) {
        const userId = userIdCookie.split("=")[1];

        socket.data.userId = userId;
        userSocketMap[userId] = socket.id;
      } else {
        console.error("user_id cookie not found.");
        return socket.disconnect(true);
      }
    } else {
      console.error("No cookies found in the handshake headers");
      return socket.disconnect(true);
    }

    const userId = socket.data.userId;
    if (userId) {
      const online = Object.keys(userSocketMap);
      io.emit("getOnlineUsers", online);
      console.log("user is online:::", online);
    }

    socket.on("sendMessage", async (data: Message) => {
      const cookies = socket.handshake.headers["cookie"];
      try {
        if (cookies) {
          const response = await axios.post(
            `${configs.MessageUrl}/send/${data.receiverId}`,
            {
              message: data.message,
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Cookie: cookies,
              },
            }
          );

          const savedMessage = response.data.data;
          const receiverSocketId = userSocketMap[data.receiverId];

          if (savedMessage && receiverSocketId) {
            console.log("Message delivered to:", receiverSocketId);
            io.to(receiverSocketId).emit("receiveMessage", data);
          }
        }
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("error", "Failed to process message");
      }
    });

    socket.on("disconnect", () => {
      if (userId) {
        delete userSocketMap[userId];
        const online = Object.keys(userSocketMap);
        console.log("after dis::", online);

        io.emit("getOnlineUsers", online);
      }
      console.log("User disconnected:", socket.id);
    });
  });
};

export default setupSocketIO;
