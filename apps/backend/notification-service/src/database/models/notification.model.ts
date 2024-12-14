import mongoose from "mongoose";

// Define TypeScript interface for Notification
export interface INotification {
  _id?: string;
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  updatedAt?: Date;
  createdAt?: Date;
}

// Define the Notification schema
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    endpoint: { type: String, required: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (_doc, ret) {
        delete ret.__v;
        ret._id = ret._id.toString();
      },
    },
  }
);

// Create a Mongoose model
const NotificationModel = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default NotificationModel;

export interface INotificationHistory {
  _id?: string;
  userId?: string[];
  url?: string;
  title?: string;
  description?: string;
  icon?: string;
  updatedAt?: Date;
  createdAt?: Date;
}
const notificationHistorySchema = new mongoose.Schema(
  {
    userId: [{ type: String }],
    url: { type: String },
    title: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (_doc, ret) {
        delete ret.__v;
        ret._id = ret._id.toString();
      },
    },
  }
);

const NotificationHistoryModel = mongoose.model<INotificationHistory>(
  "NotificationHistory",
  notificationHistorySchema
);
export { NotificationHistoryModel };
