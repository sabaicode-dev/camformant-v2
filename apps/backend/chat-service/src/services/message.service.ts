import express from "express";
import { MessageRepository } from "../database/repositories/message.repository";
import {
  GetMessageRespond,
  messages,
  query,
} from "./types/messages.service.types";

// type ParticipantsType = [
//   { participantType: "User" | "Company"; participantId: string },
// []];

export class MessageService {
  MessageRepository = new MessageRepository();
  async sendMessaage(
    message: string,
    cookieHeader: string,
    receiverId: string,
    currentUser: {
      username?: string;
      role?: string[];
    }
  ): Promise<{ message: string; data: messages | string }> {
    try {
      const cookies = deCookies(cookieHeader);
      const senderId = cookies.user_id;
      console.log("senderId:::", senderId);
      console.log("currentUser:::", currentUser.role);
      const senderRole = currentUser.role![0] === "user" ? "User" : "Company";
      const receiverRole = currentUser.role![0] === "user" ? "Company" : "User";

      const participants = [
        {
          participantType: senderRole,
          participantId: senderId,
        },
        { participantType: receiverRole, participantId: receiverId },
      ];
      console.log("participants:::", participants);

      const roomId = [senderId, receiverId].sort().join("_");
      console.log("RoomId", roomId);

      const result = await this.MessageRepository.sendMessage({
        senderId,
        receiverId,
        message,
        participants,
        roomId,
      });
      return { message: "Message has been Created", data: result };
    } catch (error) {
      console.error("error:::", error);
      throw error;
    }
  }
  async getMessage(
    userToChatId: string,
    cookieHeader: string,
    query: query,
    currentUser: {
      username?: string;
      role?: string[];
    }
  ): Promise<GetMessageRespond | undefined> {
    try {
      console.log("1:::::");

      const cookies = deCookies(cookieHeader);
      const senderId = cookies.user_id;
      const senderRole = currentUser.role![0] === "user" ? "User" : "Company";
      const receiverRole = currentUser.role![0] === "user" ? "Company" : "User";
      console.log("2:::::");

      const participants = [
        {
          participantType: senderRole,
          participantId: senderId,
        },
        { participantType: receiverRole, participantId: userToChatId },
      ];
      console.log("3:::::", participants);

      const result = await this.MessageRepository.getMessage(
        userToChatId,
        senderId,
        query,
        participants
      );

      return result as unknown as GetMessageRespond;
    } catch (error) {
      console.error("error:::", error);
      throw error;
    }
  }
}
const deCookies = (cookies: express.Request["headers"]["cookie"]) => {
  const decodedCookie = cookies
    ? Object.fromEntries(
        cookies.split("; ").map((c) => {
          const [key, value] = c.split("=");
          return [key, decodeURIComponent(value)];
        })
      )
    : {};
  return decodedCookie;
};
