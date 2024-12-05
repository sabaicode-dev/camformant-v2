import {
  Controller,
  Route,
  Post,
  Body,
  Request,
  Delete,
  SuccessResponse,
  Get,
} from "tsoa";
import NotificationService, {
  NotificationPayload,
} from "@/src/services/notification.service";
import { Request as ExpressRequest } from "express";
import sendResponse from "@/src/utils/send-response";
import { INotification } from "@/src/database/models/notification.model";

interface PushSubscriptionParams {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface SubscriptionNotificationResponse {
  message: string;
  data?: INotification;
}

@Route("v1/notifications")
export class NotificationsController extends Controller {
  @Post("/subscribe")
  public async subscribe(
    @Request() request: ExpressRequest,
    @Body() body: PushSubscriptionParams
  ): Promise<SubscriptionNotificationResponse> {
    try {
      const userId = request.cookies["user_id"];

      const newSubscription = await NotificationService.subscribe({
        userId,
        ...body,
      });

      // Send welcome notification after successful subscription
      const welcomeMessage: NotificationPayload = {
        title: "Welcome!",
        body: "Thank you for subscribing to our notifications.",
      };
      await NotificationService.sendNotification(userId, welcomeMessage);

      return sendResponse<INotification>({
        message: "Subscription successful",
        data: newSubscription,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post("/push-notification")
  public async pushNotification(
    @Request() request: ExpressRequest,
    @Body() body: NotificationPayload
  ): Promise<void> {
    try {
      const userId = request.cookies["user_id"];
      // const currentUser = JSON.parse(request.headers.currentuser as string) as {
      //   username?: string;
      //   role?: string[];
      // };
      //todo:
      console.log("Push Notification is trigger", userId);
      await NotificationService.sendNotification(userId, body);
    } catch (error) {
      throw error;
    }
  }

  @Delete("/unsubscribe")
  @SuccessResponse("204", "Unsubscribed")
  public async unsubscribe(
    @Body() reqBody: { endpoint: string }
  ): Promise<void> {
    try {
      await NotificationService.unsubscribe(reqBody.endpoint);
    } catch (error) {
      throw error;
    }
  }
  @Get()
  async getNotification(@Request() request: ExpressRequest) {
    try {
      const userId = request.cookies["user_id"];
      const result = await NotificationService.getNotification(userId);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
