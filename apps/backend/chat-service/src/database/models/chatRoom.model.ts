import mongoose, { Schema } from "mongoose";

export interface IChat extends Document {
  type: "private" | "group" | "supergroup" | "channel";
  name?: string;
  description?: string;
  members: {
    userId: mongoose.Types.ObjectId;
    lastSeenMessageId: number;
  }[];
  admins: {
    userId: mongoose.Types.ObjectId;
    permissions: string[];
  }[];
  createdAt: Date;
  creatorId: mongoose.Types.ObjectId;
  isPublic: boolean;
}

const chatSchema = new Schema<IChat>({
  type: {
    type: String,
    enum: ["private", "group", "supergroup", "channel"],
    required: true,
  },
  name: { type: String },
  description: { type: String },
  members: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      lastSeenMessageId: { type: Number },
    },
  ],
  admins: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      permissions: { type: [String] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  creatorId: { type: Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean, default: false },
});

const ChatRoomModel = mongoose.model<IChat>("ChatRoom", chatSchema);

export default ChatRoomModel;
