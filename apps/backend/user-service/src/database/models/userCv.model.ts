import mongoose from "mongoose";

const cvFileSchema = new mongoose.Schema(
  {
    url: { type: String },
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

const cvFileCollectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    cv: { type: [cvFileSchema] },
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

export const CvFileModel = mongoose.model(
  "CvFiles",
  cvFileCollectionSchema,
  "CvFiles"
);
//for generate cv
const designSchema = new mongoose.Schema(
  {
    style: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
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

const userCustomCvSchema = new mongoose.Schema(
  {
    style: { type: String },
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
export const UserCustomCv = mongoose.model(
  "UserCustomCv",
  userCustomCvSchema,
  "UserCustomCv"
);
