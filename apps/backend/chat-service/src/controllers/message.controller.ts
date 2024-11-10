import { Body, Controller, Get, Path, Post, Request, Route } from "tsoa";
import sendResponse from "../utils/send-response";
import express from "express";
import ConversationModel from "../database/models/conversation.model";
import MessageModel from "../database/models/message.model";
import mongoose from "mongoose";

interface conversation {
  _id: string;
  participants: mongoose.Types.ObjectId[];
  messages: {
    _id: string;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

@Route("v1/messages")
export class MessageController extends Controller {
  @Post("/send/{receiverId}")
  public async sendMessage(
    @Path() receiverId: string,
    @Body() reqBody: { message: string },
    @Request() request: express.Request
  ): Promise<{ message: string; data: any }> {
    try {
      const { message } = reqBody;
      //   console.log(id);
      const cookieHeader = request.headers.cookie;

      const cookies = deCookies(cookieHeader);
      const senderId = cookies.userId;
      console.log("1:::");
      console.log("receiverId:::", receiverId);

      let conversation = await ConversationModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });
      console.log("2:::");
      //BUG:
      if (!conversation) {
        conversation = await ConversationModel.create({
          participants: [senderId, receiverId],
        });
        console.log("3:::");
      }
      const newMessage = await new MessageModel({
        senderId,
        receiverId,
        message,
      });
      console.log("4:::");
      console.log(newMessage);

      if (newMessage) {
        conversation.messages.push(
          newMessage._id as unknown as mongoose.Schema.Types.ObjectId
        );
      }
      //todo: socket

      //save to DB
      //   await conversation.save();
      //   await newMessage.save();
      await Promise.all([conversation.save(), newMessage.save()]); //run in same time

      return sendResponse({ message: "OK", data: newMessage });
    } catch (error) {
      console.error("error:::", error);
      throw error;
    }
  }
  @Get("{Id}")
  public async getMessages(
    @Path() Id: string,
    @Request() request: express.Request
  ): Promise<conversation | null> {
    try {
      const userToChatId = Id;
      const cookies = deCookies(request.headers.cookie);
      const senderId = cookies.userId;

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
