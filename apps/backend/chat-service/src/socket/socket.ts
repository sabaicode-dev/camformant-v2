import { Server, Socket } from "socket.io";
// import { MessageService } from "../services/message.service";
import axios from "axios";
import configs from "../config";
// import axios from "axios";
// const onlineUsers = new Map<string, Set<string>>(); //type of string or set string
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
  // const messageService = new MessageService();
  const online = Object.keys(userSocketMap);
  io.emit("getOnlineUsers", online);
  io.on("connection", (socket: Socket) => {
    console.log("user socket id:::", socket.id);

    //todo: forward current user role from request to here
    // Check if the cookies exist in the socket handshake headers
    const cookies = socket.handshake.headers["cookie"];
    // console.log("cookies:::", cookies);

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
      //todo: when done remove online.push this is for test only
      //test if this company online
      online.push("63e6a012e1234567890a1244");
      //io.emit() use to send any event to connected users
      io.emit("getOnlineUsers", online);
      console.log("user is online:::", online);
    }

    //todo: send message
    // Handle incoming messages
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
          console.log("new message:::", savedMessage);
          //todo: realtime message (wait for dashboard chat to test)
          const receiverSocketId = userSocketMap[data.receiverId];
          console.log("receverid::", receiverSocketId);

          if (savedMessage && receiverSocketId) {
            console.log("Message delivered to:", receiverSocketId);
            io.to(receiverSocketId).emit("receiveMessage", savedMessage);
          }
          //test received done
          // socket.broadcast.emit("receiveMessage", savedMessage);
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
