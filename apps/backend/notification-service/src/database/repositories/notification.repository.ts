import NotificationModel, {
  INotification,
  INotificationHistory,
  NotificationHistoryModel,
} from "@/src/database/models/notification.model";
import { NotificationPayload } from "@/src/services/notification.service";
import { prettyObject } from "@sabaicode-dev/camformant-libs";

class NotificationRepository {
  async saveSubscription(newSubscriber: INotification) {
    try {
      const notification = await NotificationModel.findOneAndUpdate(
        { userId: newSubscriber.userId },
        { endpoint: newSubscriber.endpoint, keys: newSubscriber.keys },
        {
          upsert: true, // Add if there is no existing userId
          new: true, // Return the new document
          setDefaultsOnInsert: true, // Set default values if creating a new document
        }
      );

      return notification;
    } catch (error) {
      console.error(
        `NotificationRepository - saveSubscription() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async getSubscriptionsByUserId(userId: string): Promise<INotification[]> {
    try {
      const notification = await NotificationModel.find({ userId });

      return notification as unknown as INotification[];
    } catch (error) {
      console.error(
        `NotificationRepository - getSubscriptionByUserId() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  async getAllSubscriptions(): Promise<INotification[]> {
    try {
      const notification = await NotificationModel.find();

      return notification as unknown as INotification[];
    } catch (error) {
      console.error(
        `NotificationRepository - getAllSubscriptions() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async getSubscriptionByEndpoint(endpoint: string) {
    try {
      const notification = await NotificationModel.findOne({ endpoint });
      return notification;
    } catch (error) {
      console.error(
        `NotificationRepository - getSubscriptionByEndpoint() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async deleteSubscription(id: string) {
    try {
      await NotificationModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(
        `NotificationRepository - deleteSubscription() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  async getUserNotificationHistory(
    userId: string
  ): Promise<INotificationHistory[]> {
    try {
      const NotificationHistories = await NotificationHistoryModel.find({
        userId: {
          $in: [userId],
        },
      });
      return NotificationHistories as INotificationHistory[];
    } catch (error) {
      throw error;
    }
  }
  async saveUsersNotificationHistory(
    subscriptionUser: string[],
    payload: NotificationPayload
  ) {
    try {
      const history: INotificationHistory = {
        userId: subscriptionUser,
        title: payload.title,
        url: payload.data?.url,
        description: payload.body,
        icon: payload.icon,
      };
      await NotificationHistoryModel.create(history);
    } catch (error) {
      throw error;
    }
  }
}

export default new NotificationRepository();
