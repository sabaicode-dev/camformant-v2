import mongoose from "mongoose";

export interface conversation {
  _id: string;
  participants: mongoose.Types.ObjectId[];
  messages: {
    _id: string;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    // conversationId: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
  roomId: string;
}
