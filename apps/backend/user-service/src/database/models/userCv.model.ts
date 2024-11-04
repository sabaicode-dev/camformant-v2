import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    json: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    toObject: {
      transform: function (_doc, ret) {
        delete ret.__v;
        ret._id = ret._id.toString();
      },
    },
  }
);
export const CvStyleModel = mongoose.model("CvStyle", designSchema, "CvStyle");
