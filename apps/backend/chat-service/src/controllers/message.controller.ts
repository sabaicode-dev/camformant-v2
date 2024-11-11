import { Body, Controller, Get, Path, Post, Request, Route } from "tsoa";
import express from "express";
import { MessageService } from "../services/message.service";

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
      const { message } = reqBody;
      //
      const cookieHeader = request.headers.cookie;

      const result = await this.MessageService.sendMessaage(
        message,
        cookieHeader!,
        receiverId
      );
      //
      return result;
    } catch (error) {
      console.error("error:::", error);
      throw error;
    }
  }
  @Get("{userToChatId}")
  public async getMessages(
    @Path() userToChatId: string,
    @Request() request: express.Request
  ) {
    try {
      const cookieHeader = request.headers.cookie;
      const result = await this.MessageService.getMessage(
        userToChatId,
        cookieHeader!
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
