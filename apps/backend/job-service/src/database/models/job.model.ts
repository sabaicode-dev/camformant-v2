import { StatusMode } from "@/src/controllers/types/job-controller.type";
import mongoose, { model, Schema } from "mongoose";

export enum EmploymentType {
  CONTRACT = "Contract",
  INTERNSHIP = "Internship",
}

export enum EmploymentSchedule {
  FULL_TIME = "Full-Time",
  PART_TIME = "Part-Time",
  FLEXIBLE_HOURS = "Flexible-Hours",
  PROJECT_BASED = "Project-Based",
}

export enum WorkMode {
  REMOTE = "Remote",
  ON_SITE = "On-Site",
  HYBRID = "Hybrid",
}

export interface companiesForJobs {
  _id?: string;
  profile?: string;
  name?: string;
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
  description?: string;
  contact?: {
    phone_number?: string;
    website?: string;
  };
  email?: string;
  job_openings_count?: number;
  job_closings_count?: number;
}
export interface returnJobs {
  _id?: string;
  companyId?: mongoose.Types.ObjectId;
  title?: string; // name of the job that company looking for. Example: Java Developer
  position?: string[]; // tags that belong to the tile: Backend Development, Programming, etc.
  workMode?: WorkMode[];
  location?: string; // location could be phnom penh, kompong-cham, etc.
  requirement?: string;
  description?: string;
  address?: string; // address could be the link address of the company (google link)
  min_salary?: number;
  max_salary?: number;
  job_opening?: number;
  type?: EmploymentType[];
  schedule?: EmploymentSchedule[];
  required_experience?: string[];
  benefit?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deadline?: Date;
  company?: companiesForJobs;
}

export interface IJob {
  _id?: string;
  companyId?: mongoose.Types.ObjectId;
  profile?: string;
  title?: string; // name of the job that company looking for. Example: Java Developer
  position?: string[]; // tags that belong to the tile: Backend Development, Programming, etc.
  workMode?: WorkMode[];
  location?: string; // location could be phnom penh, kompong-cham, etc.
  requirement?: string;
  description?: string;
  address?: string; // address could be the link address of the company (google link)
  min_salary?: number;
  max_salary?: number;
  job_opening?: number;
  type?: EmploymentType[];
  schedule?: EmploymentSchedule[];
  required_experience?: string[];
  benefit?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deadline?: Date;
}

const JobSchema: Schema = new Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    position: { type: [String], required: true },
    workMode: { type: [String], required: true, enum: Object.values(WorkMode) },
    requirement: { type: String, required: true },
    location: { type: String, required: true },
    job_opening: { type: Number, required: true },
    max_salary: {
      type: Number,
      required: true,
      min: [0, "Max salary must be a positive number."],
    },
    min_salary: {
      type: Number,
      required: true,
      min: [0, "Min salary must be a positive number."],
      validate: {
        validator: function (this: IJob, value: number) {
          return value <= this.max_salary!;
        },
        message: "Min salary must be less than or equal to max salary.",
      },
    },
    description: { type: String, required: true },
    address: { type: String, required: true },
    type: {
      type: [String],
      enum: Object.values(EmploymentType),
      required: true,
    },
    schedule: {
      type: [String],
      required: true,
      enum: Object.values(EmploymentSchedule),
    },
    required_experience: { type: [String], required: true },
    benefit: { type: [String], required: true },
    deadline: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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

export const JobModel = model<IJob>("Job", JobSchema);

const ApplyUserInfoschema = new Schema(
  {
    profile: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true, enum: Object.values(StatusMode) },
    cv: { type: String, required: true },
  },
  {
    _id: false,
  }
);
const ApplyCompanyResSchema = new Schema(
  {
    startDate: { type: Date },
    interviewDate: { type: Date },
    interviewLocation: { type: String },
  },
  {
    _id: false,
  }
);
const StatusDateSchema = new Schema(
  {
    [StatusMode.APPLY]: { type: Date, required: false },
    [StatusMode.SHORTLIST]: { type: Date, required: false },
    [StatusMode.REVIEW]: { type: Date, required: false },
    [StatusMode.INTERVIEW]: { type: Date, required: false },
    [StatusMode.ACCEPT]: { type: Date, required: false },
  },
  { _id: false }
);

const JobApplySchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId },
    jobId: mongoose.Types.ObjectId,
    companyResponse: ApplyCompanyResSchema,
    userInfo: ApplyUserInfoschema,
    statusDate: StatusDateSchema,
  },
  {
    timestamps: { createdAt: "appliedAt", updatedAt: false },
    versionKey: false,
    toObject: {
      transform: function (_doc, ret) {
        delete ret.__v;
        ret._id = ret._id.toString();
        ret.userId = ret.userId.toString();
        ret.jobId = ret.jobId.toString();
      },
    },
  }
);
export const ApplyModel = model("JobApply", JobApplySchema, "JobApply");
