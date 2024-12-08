import mongoose, { Document } from "mongoose";
interface Conversation extends Document {
  participants: {
    participantId: mongoose.Schema.Types.ObjectId;
    participantType: string;
  };
  messages: mongoose.Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  roomId: string;
}

const conversationSchema = new mongoose.Schema<Conversation>(
  {
    participants: [
      {
        participantType: {
          type: String,
          required: true,
          enum: ["User", "Company"], // Allowed collections for participants
        },
        participantId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "participants.participantType", // Dynamically reference User or Company based on participantType
        },
        _id: false,
      },
    ],
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
