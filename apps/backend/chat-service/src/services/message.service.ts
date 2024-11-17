import express from "express";
import { MessageRepository } from "../database/repositories/message.repository";
import {
  GetMessageRespond,
  messages,
  query,
  QueryGetUserConversations,
  RespondGetConversations,
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
  ): Promise<{ message: string; data: messages }> {
    try {
      const cookies = deCookies(cookieHeader);
      const senderId = cookies.user_id;
      const senderRole = currentUser.role![0] === "user" ? "User" : "Company";
      const receiverRole = currentUser.role![0] === "user" ? "Company" : "User";

      const participants = [
        {
          participantType: senderRole,
          participantId: senderId,
        },
        { participantType: receiverRole, participantId: receiverId },
      ];

      const roomId = [senderId, receiverId].sort().join("_");

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
      const cookies = deCookies(cookieHeader);
      const senderId = cookies.user_id;
      const senderRole =
        currentUser.role![0] === "company" ? "Company" : "User";
      const receiverRole = senderRole === "User" ? "Company" : "User";

      const result = await this.MessageRepository.getMessage(
        userToChatId,
        senderId,
        query,
        senderRole,
        receiverRole
      );

      return result as unknown as GetMessageRespond;
    } catch (error) {
      console.error("error:::", error);
      throw error;
    }
  }
  //todo::Type of return
  async getConversationById(conversationId: string): Promise<any> {
    try {
      const result =
        await this.MessageRepository.getConversationById(conversationId);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getUserConversations(
    cookieHeader: string,
    currentUser: { username?: string; role?: string[] },
    query: QueryGetUserConversations
  ): Promise<RespondGetConversations> {
    const { page = 1, limit = 8 } = query;
    const skip = (page - 1) * limit;
    try {
      const cookies = deCookies(cookieHeader);
      const senderId = cookies.user_id;
      const senderRole =
        currentUser.role![0] === "company" ? "Company" : "User";
      const result = await this.MessageRepository.getUserConversations(
        senderId,
        senderRole,
        page,
        limit,
        skip
      );
      return result as unknown as RespondGetConversations;
    } catch (error) {
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
