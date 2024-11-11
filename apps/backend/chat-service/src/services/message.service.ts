import express from "express";
import { MessageRepository } from "../database/repositories/message.repository";
import { messages, query } from "./types/messages.service.types";

export class MessageService {
  MessageRepository = new MessageRepository();
  async sendMessaage(
    message: string,
    cookieHeader: string,
    receiverId: string
  ): Promise<{ message: string; data: messages }> {
    try {
      const cookies = deCookies(cookieHeader);
      const senderId = cookies.userId;
      const participants = [senderId, receiverId].sort();
      const roomId = participants.join("_");
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
    query: query
  ): Promise<any> {
    try {
      const cookies = deCookies(cookieHeader);
      const senderId = cookies.userId;
      const result = await this.MessageRepository.getMessage(
        userToChatId,
        senderId,
        query
      );

      return result;
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
