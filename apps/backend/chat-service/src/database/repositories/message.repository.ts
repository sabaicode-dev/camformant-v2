import mongoose from "mongoose";
import ConversationModel from "../models/conversation.model";
import MessageModel from "../models/message.model";
import {
  conversation,
  conversationRespond,
  createdMessage,
  query,
} from "./types/messages.repository.types";

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
        conversationId: conversation._id,
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
    senderId: string,
    query: query
  ): Promise<null | conversationRespond> {
    //conversation |
    const { limit = 7, page = 1 } = query;

    const skip = (page - 1) * limit;
    try {
      const conversation = await ConversationModel.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate({
        path: "messages",
        options: { limit, skip, sort: { createdAt: 1 } },
        // model: MessageModel,
        // select: "_id senderId receiverId message createdAt updatedAt",
      });

      let totalMessages = 0;
      if (conversation) {
        // Step 2: Count total messages for the conversation separately
        totalMessages = await MessageModel.countDocuments({
          conversationId: conversation._id,
        });
      }

      const totalPage = Math.ceil(totalMessages / limit);
      if (conversation) {
        return {
          conversation: conversation as unknown as conversation,
          currentPage: page,
          totalMessages,
          totalPage,
          limit,
          skip,
        };
      }

      return null;
    } catch (error) {
      console.error("getMessage() message.service error:::", error);
      throw error;
    }
  }
}
