// ========================
// Job Interface

import {
  EmploymentSchedule,
  EmploymentType,
  IJob,
  WorkMode,
} from "@/src/database/models/job.model";
import mongoose from "mongoose";

// ========================
export interface JobParams {
  companyId?: string | mongoose.Types.ObjectId;
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
  createdAt: Date;
  benefit?: string[];
  deadline?: Date;
  updatedAt?: Date;
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
  appliedAt?: "asc" | "desc";
  name?: "asc" | "desc";
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
  companyId?: string;
}
export interface JobApplyQueriesRepo {
  userId?: string;
  jobId?: string;
  companyId?: string;
  page?: number;
  limit?: number;
  filter?: string;
  sort?: JobSortParams;
}
export interface JobApplyQueriesController {
  userId?: string;
  jobId?: string;
  companyId?: string;
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}

export enum StatusMode {
  APPLY = "Apply",
  REVIEW = "Review",
  SHORTLIST = "Shortlist",
  INTERVIEW = "Interview",
  ACCEPT = "Accept",
}
export interface ApplyUserInfo {
  name: string;
  profile: string;
  status: StatusMode;
  cv: string;
}
export interface ApplyCompanyResp {
  startDate?: Date;
  interviewDate?: string;
  interviewLocation?: string;
}
export interface PostJobApplyBody {
  userId: string;
  jobId: string;
  companyId: string;
  userInfo: ApplyUserInfo;
  companyResponse?: ApplyCompanyResp;
}
export interface JobApplyBody {
  userId: string;
  jobId: string;
  userInfo: ApplyUserInfo;
  companyResponse?: ApplyCompanyResp;
  statusDate?: { [key in StatusMode]?: Date };
}

export interface JobApplyResponse {
  _id?: mongoose.Types.ObjectId;
  userId: string;
  jobId: string;
  companyId: string;
  userInfo: ApplyUserInfo;
  companyResponse?: ApplyCompanyResp;
  appliedAt?: Date;
  statusDate?: { [key in StatusMode]?: Date };
  jobInfo?: IJob;
}

export interface GetApplyJobResLimit {
  applyData: JobApplyResponse[];
  totalPages: number;
  currentPage: number;
  skip: number;
  limit: number;
}
export interface BodyUpdateJobApply {
  status: StatusMode;
  startDate?: Date | string;
  interviewDate?: Date | string;
  interviewLocation?: string;
}

//==============for job matching===============
