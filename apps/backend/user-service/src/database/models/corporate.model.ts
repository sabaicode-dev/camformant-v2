import mongoose from "mongoose";

interface ICorporatorProfile {
  _id?: mongoose.Types.ObjectId;
  sub?: string;
  name?: string;
  status?:string
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
    status:{
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    role: {
      type: String,
      default: "company",
    },
    profile: {
      type: String,
      required: false,
      default:
        "https://camformant.s3.ap-southeast-2.amazonaws.com/user-service/upload/default_company.png",
    },
    location: {
      address: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
    },
    contact: {
      phone_number: {
        type: String,
      },
      website: {
        type: String,
        default: "",
      },
    },
    social_links: {
      linkedin: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
    },
    description: {
      type: String,
      default: "",
    },

    employee_count: {
      type: Number,
      default: 0,
    },
    job_openings_count: {
      type: Number,
      default: 0,
    },
    job_closings_count: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Number,
      default: 0,
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
