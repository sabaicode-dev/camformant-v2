import mongoose, { Document } from "mongoose";
export interface Conversation extends Document {
  participants: [mongoose.Schema.Types.ObjectId];
  messages: mongoose.Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  roomId: string;
}

const conversationSchema = new mongoose.Schema<Conversation>(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      validate: {
        validator: function (value: mongoose.Types.ObjectId[]) {
          return value.length === 2; // Ensure exactly 2 participants
        },
        message: "A pair must have exactly two participants.",
      },
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    roomId: {
      type: String,
      unique: true,
      required: true,
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
    versionKey: false,
  }
);
//
const ConversationModel = mongoose.model<Conversation>(
  "Conversation",
  conversationSchema
);
export default ConversationModel;
