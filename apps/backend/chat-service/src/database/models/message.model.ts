import mongoose from "mongoose";
interface IMessage {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    message: {
      type: String,
      require: true,
    },
  },
  //createAt,updateAt
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

const MessageModel = mongoose.model<IMessage>("Message", messageSchema);
export default MessageModel;
