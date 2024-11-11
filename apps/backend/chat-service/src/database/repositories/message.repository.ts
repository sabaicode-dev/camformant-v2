import mongoose from "mongoose";
import ConversationModel from "../models/conversation.model";
import MessageModel from "../models/message.model";
import {
  conversation,
  createdMessage,
} from "./types/messages.controller.types";

export class MessageRepository {
  async sendMessage(makeMessage: {
    senderId: string;
    receiverId: string;
    message: string;
    participants: string[];
    roomId: string;
  }): Promise<createdMessage> {
    try {
      const { senderId, receiverId, message, participants, roomId } =
        makeMessage;

      let conversation = await ConversationModel.findOneAndUpdate(
        { roomId },
        { $setOnInsert: { participants, roomId } },
        { new: true, upsert: true }
      );

      const newMessage = await new MessageModel({
        senderId,
        receiverId,
        message,
        // conversationId: conversation._id,
      });

      if (newMessage) {
        conversation.messages.push(
          newMessage._id as unknown as mongoose.Schema.Types.ObjectId
        );
      }
      //todo: socket

      //save to DB
      await Promise.all([conversation.save(), newMessage.save()]); //run in same time

      return newMessage as unknown as createdMessage;
    } catch (error) {
      console.error("sendMessage() message.service error:::", error);
      throw error;
    }
  }
  async getMessage(
    userToChatId: string,
    senderId: string
  ): Promise<conversation | null> {
    try {
      const conversation = await ConversationModel.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate({
        path: "messages",
        // model: MessageModel,
        // select: "_id senderId receiverId message createdAt updatedAt",
      });
      //   console.log("conversation:::", JSON.stringify(conversation));

      if (conversation) {
        return conversation as unknown as conversation;
      }

      return null;
    } catch (error) {
      console.error("getMessage() message.service error:::", error);
      throw error;
    }
  }
}
