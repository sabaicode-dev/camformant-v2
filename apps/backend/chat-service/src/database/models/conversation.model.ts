import mongoose, { Document } from "mongoose";
export interface Conversation extends Document {
  participants: mongoose.Schema.Types.ObjectId[];
  messages: mongoose.Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const conversationSchema = new mongoose.Schema<Conversation>(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
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

conversationSchema.pre("save", function (next) {
  // Sort participants to enforce order consistency
  this.participants = this.participants.sort();
  next();
});

// Unique index on participants array to prevent duplicates
conversationSchema.index({ participants: 1 }, { unique: true });

const ConversationModel = mongoose.model<Conversation>(
  "Conversation",
  conversationSchema
);
export default ConversationModel;
