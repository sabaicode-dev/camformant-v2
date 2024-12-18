import mongoose from "mongoose";

export interface AdminProfileParams {
  sub: string;
  email?: string;
  phone_number?: string;
  profile?: string;
  role: string;
  name: string;
}

const AdminSchema = new mongoose.Schema<AdminProfileParams>(
  {
    sub: { type: String, unique: true },
    email: { type: String, unique: true },
    phone_number: { type: String, unqiue: true },
    profile: {
      type: String,
    },
    role: { type: String, default: "admin" },
    name: {
      type: String,
    },
  },
  {
    timestamps: false,
    toObject: {
      transform: function (_doc, ret) {
        delete ret.__v;
        ret._id = ret._id.toString();
      },
    },
    versionKey: false,
  }
);

export const AdminModel = mongoose.model<AdminProfileParams>(
  "Admin",
  AdminSchema,
  "Admin"
);
