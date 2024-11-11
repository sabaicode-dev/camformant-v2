import mongoose from "mongoose";

export interface conversation {
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  messages: {
    _id: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
    // conversationId: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
  roomId: string;
}

export interface messages {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
  // conversationId: mongoose.Types.ObjectId;
}
