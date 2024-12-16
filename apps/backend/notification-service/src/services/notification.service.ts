import {
  InvalidInputError,
  prettyObject,
} from "@sabaicode-dev/camformant-libs";
import webpush from "web-push";
import configs from "@/src/config";
import NotificationRepository from "@/src/database/repositories/notification.repository";
import {
  INotification,
  INotificationHistory,
} from "@/src/database/models/notification.model";

export interface NotificationPayload {
  title: string;
  body: string;
  data?: { url?: string };
  tag?: string;
  timestamp?: Date;
  icon?: string;
}

export interface NotificationErrorResponse {
  success: boolean;
  endpoint: string;
  error: string;
}

class NotficationService {
  constructor() {
    webpush.setVapidDetails(
      "mailto:khunkimhab7@gmail.com",
      configs.vapidPublicKey,
      configs.vapidPrivateKey
    );
  }

  async subscribe(subscription: INotification): Promise<any> {
    try {
      const newNotification =
        await NotificationRepository.saveSubscription(subscription);
      return newNotification;
    } catch (error) {
      console.error(
        `NotificationService - subscribe() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async sendNotification(
    userId: string,
    payload: NotificationPayload,
    type: "Job Listings" | "Apply" | "new subscribe" = "new subscribe"
  ): Promise<INotification[] | NotificationErrorResponse[]> {
    try {
      const notifications =
        await NotificationRepository.getSubscriptionsByUserId(userId);
      console.log("payload:::", JSON.stringify(payload));

      if (!notifications) {
        throw new InvalidInputError({
          message: "Notification subscription not found",
        });
      }

      const sendPromises = notifications.map((subscription) => {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
          },
        };

        return webpush
          .sendNotification(pushSubscription, JSON.stringify(payload))
          .catch((error) => {
            return {
              success: false,
              endpoint: subscription.endpoint,
              error: error.message,
            };
          });
      });
      await NotificationRepository.saveUsersNotificationHistory(
        [userId],
        payload,
        type
      );

      const results = await Promise.all(sendPromises);
      return results as INotification[] | NotificationErrorResponse[];
    } catch (error) {
      console.error(
        `NotificationService - sendNotification() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  async sendNotificationAllSubscriptions(
    payload: NotificationPayload,
    type: "Job Listings" | "Apply"
  ): Promise<INotification[] | NotificationErrorResponse[]> {
    try {
      const notifications = await NotificationRepository.getAllSubscriptions();

      if (!notifications) {
        throw new InvalidInputError({
          message: "Notification subscription not found",
        });
      }
      let subscriptionUser: string[] = [];

      const sendPromises = notifications.map((subscription) => {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
          },
        };
        subscriptionUser.push(subscription.userId);

        return webpush
          .sendNotification(pushSubscription, JSON.stringify(payload))
          .catch((error) => {
            return {
              success: false,
              endpoint: subscription.endpoint,
              error: error.message,
            };
          });
      });
      await NotificationRepository.saveUsersNotificationHistory(
        subscriptionUser,
        payload,
        type
      );
      const results = await Promise.all(sendPromises);
      return results as INotification[] | NotificationErrorResponse[];
    } catch (error) {
      console.error(
        `NotificationService - sendNotification() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async unsubscribe(endpoint: string) {
    try {
      const subscription =
        await NotificationRepository.getSubscriptionByEndpoint(endpoint);
      if (!subscription) {
        throw new InvalidInputError({
          message: "Notification subscription not found",
        });
      }

      await NotificationRepository.deleteSubscription(
        subscription._id.toString()
      );
    } catch (error) {
      console.error(
        `NotificationService - unsubscribe() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async getNotification(userId: string): Promise<INotification[]> {
    try {
      const notification =
        await NotificationRepository.getSubscriptionsByUserId(userId);
      return notification;
    } catch (error) {
      throw error;
    }
  }
  async getUserNotificationHistory(
    userId: string,
    search?: "Job Listings" | "Apply"
  ): Promise<{ message: string; data: INotificationHistory[] }> {
    try {
      const result = await NotificationRepository.getUserNotificationHistory(
        userId,
        search
      );
      return { message: "Success get notification!", data: result };
    } catch (error) {
      throw error;
    }
  }
}

export default new NotficationService();
