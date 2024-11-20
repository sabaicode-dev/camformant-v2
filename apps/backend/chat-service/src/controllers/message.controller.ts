import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Queries,
  Request,
  Route,
} from "tsoa";
import express from "express";
import { MessageService } from "../services/message.service";
import {
  query,
  QueryGetUserConversations,
} from "./types/message.controller.types";

// declare namespace Express {
//   export interface Request {
//     currentUser?: { role: string[]; username: string };
//   }
// }

@Route("v1/messages")
export class MessageController extends Controller {
  MessageService = new MessageService();
  @Post("/send/{receiverId}")
  public async sendMessage(
    @Path() receiverId: string,
    @Body() reqBody: { message: string },
    @Request() request: express.Request
  ) {
    try {
      console.log("0:");

      const { message } = reqBody;
      console.log("1:::", message);

      const cookieHeader = request.headers.cookie;
      const currentUser = JSON.parse(request.headers.currentuser as string) as {
        username?: string;
        role?: string[];
      };

      console.log("2:::", currentUser);

      const result = await this.MessageService.sendMessaage(
        message,
        cookieHeader!,
        receiverId,
        currentUser
      );

      return result;
    } catch (error) {
      console.error("error:::", error);
      throw error;
    }
  }
  @Get("{userToChatId}")
  public async getMessages(
    @Path() userToChatId: string,
    @Request() request: express.Request,
    @Queries() query: query
  ) {
    try {
      const cookieHeader = request.headers.cookie;
      const currentUser = JSON.parse(request.headers.currentuser as string) as {
        username?: string;
        role?: string[];
      };
      const result = await this.MessageService.getMessage(
        userToChatId,
        cookieHeader!,
        query,
        currentUser
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
  @Get("/conversation/{conversationId}")
  public async getConversationById(@Path() conversationId: string) {
    try {
      const result =
        await this.MessageService.getConversationById(conversationId);
      return result;
    } catch (error) {
      throw error;
    }
  }
  @Get("/get/conversations")
  //get all conversations with user Id
  public async getUserConversations(
    @Request() request: express.Request,
    @Queries() query: QueryGetUserConversations
  ) {
    try {
      const cookieHeader = request.headers.cookie;

      const currentUser = JSON.parse(request.headers.currentuser as string) as {
        username?: string;
        role?: string[];
      };

      const result = await this.MessageService.getUserConversations(
        cookieHeader!,
        currentUser,
        query
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
