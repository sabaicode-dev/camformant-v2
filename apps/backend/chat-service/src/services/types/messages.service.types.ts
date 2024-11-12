import mongoose from "mongoose";

export interface conversation {
  _id: mongoose.Types.ObjectId;
  participants: {
    participantType: "User" | "Company";
    participantId: string;
  }[];
  messages: {
    _id: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
    conversationId: mongoose.Types.ObjectId;
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
  conversationId: mongoose.Types.ObjectId;
  // conversationId: mongoose.Types.ObjectId;
}
export interface query {
  page?: number;
  limit?: number;
}
export interface GetMessageRespond {
  conversation: conversation;
  currentPage: number;
  totalMessages: number;
  totalPage: number;
  limit: number;
  skip: number;
}
