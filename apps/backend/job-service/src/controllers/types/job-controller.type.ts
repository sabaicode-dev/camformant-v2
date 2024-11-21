// ========================
// Job Interface

import {
  EmploymentSchedule,
  EmploymentType,
  WorkMode,
} from "@/src/database/models/job.model";
import mongoose from "mongoose";

// ========================
export interface JobParams {
  companyId: string | mongoose.Types.ObjectId;
  title: string;
  position: string[];
  workMode: WorkMode[];
  location: string;
  requirement: string;
  description?: string;
  address: string;
  min_salary: number | 0;
  max_salary: number | 5000;
  job_opening?: number;
  type?: EmploymentType[];
  schedule?: EmploymentSchedule[];
  required_experience?: string[];
  benefit?: string[];
  deadline?: Date;
}

export interface JobsFilterParams {
  min_salary?: number;
  max_salary?: number;
  type?: string[];
  location?: string;
  schedule?: string[];
  required_experience?: string[];
}

export interface JobSortParams {
  title?: "asc" | "desc";
  createdAt?: "asc" | "desc";
}

export interface JobGetAllControllerParams {
  page?: number;
  limit?: string;
  filter?: string;
  sort?: string;
  search?: string;
  userFav?: string;
}

export interface JobGetAllRepoParams {
  page?: number;
  limit?: string;
  filter?: JobsFilterParams;
  sort?: JobSortParams;
  search?: string;
  userFav?: string[];
}
