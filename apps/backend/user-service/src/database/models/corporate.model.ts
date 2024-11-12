import { Schema, model } from "mongoose";

export interface ICorporateModel {
    _id: string;
    sub: string;
    username: string;
    email: string;
    profile: string;
    role: "company"; // Replace with other roles if they exist
    corporateProfileId?: string; // Optional if role is not "company"
    favorites: string[];
    createdAt: Date; // Or `Date` if it will be converted to a Date object
    updatedAt: Date;
}

const corporateSchema = new Schema<ICorporateModel>({
    sub: { type: String },
    username: { type: String, required: true },
    email: { type: String, unique: true },
    profile: { type: String, default: "https://microservice-sample-resource.s3.amazonaws.com/default_pic.jpg" },
    role: { type: String, default: "company" },
    corporateProfileId: { type: String },
    favorites: { type: [String], default: [] },
}, {
    timestamps: true,
    toObject: {
        transform: function (_doc, ret) {
            delete ret.__v;
            ret._id = ret._id.toString();
        }
    }
});

corporateSchema.index({ email: 1 }, { unique: true });

corporateSchema.path("email").validate(function (value) {
    if (!value) {
        return false;
    }
    return true;
}, "Email is required.");

export const CorporateModel = model<ICorporateModel>("corporates", corporateSchema);