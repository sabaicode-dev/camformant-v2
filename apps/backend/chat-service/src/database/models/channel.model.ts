import mongoose, { Schema } from "mongoose";

export interface IChannel extends Document {
  name: string;
  description?: string;
  subscribers: mongoose.Types.ObjectId[];
  admins: {
    userId: mongoose.Types.ObjectId;
    permissions: string[];
  }[];
  messages: mongoose.Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
}
const channelSchema = new Schema<IChannel>({
  name: { type: String, required: true },
  description: { type: String },
  subscribers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  admins: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      permissions: { type: [String] },
    },
  ],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model<IChannel>("Channel", channelSchema);

export default MessageModel;
