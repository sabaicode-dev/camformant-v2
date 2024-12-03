import mongoose from "mongoose";

export interface ICorporatorProfile {
  _id?: string;
  sub?: string;
  name?: string;
  email?: string;
  role?: "company";
  profile?: string;
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
  contact?: {
    phone_number?: string;
    website?: string;
  };
  social_links?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  description?: string;
  employee_count?: number;
  job_openings_count?: number;
  job_closings_count?: number;
  completed?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the schema
const CorporatorSchema = new mongoose.Schema<ICorporatorProfile>(
  {
    sub: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    profile: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default:
        "https://camformant.s3.ap-southeast-2.amazonaws.com/user-service/upload/default_company.png",
    },
    location: {
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    contact: {
      phone_number: {
        type: String,
      },
      website: {
        type: String,
      },
    },
    social_links: {
      linkedin: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
    },
    description: {
      type: String,
    },

    employee_count: {
      type: Number,
    },
    job_openings_count: {
      type: Number,
    },
    job_closings_count: {
      type: Number,
    },
    completed: {
      type: Number,
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

const CorporatorModel = mongoose.model<ICorporatorProfile>(
  "Corporator",
  CorporatorSchema
);
export default CorporatorModel;
