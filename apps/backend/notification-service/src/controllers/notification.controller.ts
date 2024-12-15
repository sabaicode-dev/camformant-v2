import {
  Controller,
  Route,
  Post,
  Body,
  Request,
  Delete,
  SuccessResponse,
  Get,
  Queries,
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
        data: { url: "/home" },
        tag: `notification-${Date.now()}`,
        icon: "https://sabaicode.com/sabaicode.jpg",
        timestamp: new Date(),
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
  public async pushOneUserNotification(
    @Body()
    body: {
      payload: NotificationPayload;
      userId: string;
      type: "Job Listings" | "Apply";
    }
  ): Promise<void> {
    try {
      console.log("Push Notification is trigger", body.userId);
      await NotificationService.sendNotification(
        body.userId,
        body.payload,
        body.type
      );
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
  @Post("/push-all-notifications")
  async pushToSubscribers(
    @Body()
    body: {
      payload: NotificationPayload;
      type: "Job Listings" | "Apply";
    }
  ) {
    try {
      console.log("payload:::", body.payload);
      await NotificationService.sendNotificationAllSubscriptions(
        body.payload,
        body.type
      );
    } catch (error) {
      throw error;
    }
  }
  @Get("/getUserNotification")
  async getUserNotificationHistory(
    @Request() request: ExpressRequest,
    @Queries() query: { search?: "Job Listings" | "Apply" }
  ) {
    try {
      const userId = request.cookies["user_id"];

      const res = await NotificationService.getUserNotificationHistory(
        userId,
        query.search
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
}
