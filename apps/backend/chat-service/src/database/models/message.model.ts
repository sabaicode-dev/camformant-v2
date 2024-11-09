import mongoose, { Schema } from "mongoose";

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content?: string;
  messageType:
    | "text"
    | "image"
    | "video"
    | "file"
    | "audio"
    | "poll"
    | "location";
  mediaUrl?: string;
  reactions: {
    emoji: string;
    userId: mongoose.Types.ObjectId;
  }[];
  replyToMessageId?: mongoose.Types.ObjectId;
  forwardedFrom?: mongoose.Types.ObjectId;
  sentAt: Date;
  readBy: mongoose.Types.ObjectId[];
  encryptedContent?: string;
}
const MessageSchema = new Schema<IMessage>({
  chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String },
  messageType: {
    type: String,
    enum: ["text", "image", "video", "file", "audio", "poll", "location"],
    required: true,
  },
  mediaUrl: { type: String },
  reactions: [
    {
      emoji: { type: String },
      userId: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
  replyToMessageId: { type: Schema.Types.ObjectId, ref: "Message" },
  forwardedFrom: { type: Schema.Types.ObjectId, ref: "User" },
  sentAt: { type: Date, default: Date.now },
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  encryptedContent: { type: String },
});

// const MessageSchema: Schema = new Schema(
//   {
//     text: { type: String, required: true },
//     senderId: { type: String, required: true, ref: "User" },
//     receiverId: { type: String, required: true, ref: "User" },
//     chatRoomId: { type: Types.ObjectId, ref: "ChatRoom" },
//     conversationId: {
//       type: Types.ObjectId,
//       required: true,
//       ref: "Conversation",
//     },
//     createdAt: { type: Date, default: Date.now },
//     updateAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
