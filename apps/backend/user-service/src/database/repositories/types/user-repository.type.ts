import { IUser } from "@/src/controllers/types/user.controller.type";
import { Types } from "mongoose";

export interface UserFilterParams {
  gender?: string;
}

export interface UserSortParams {
  username?: "asc" | "desc";
  createdAt?: "asc" | "desc";
}

export interface UserGetAllRepoParams {
  page?: number;
  limit?: number;
  filter?: UserFilterParams;
  sort?: UserSortParams;
}
export interface UserGetAllRepoResponse {
  users: IUser[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
export interface UserCreationRepoParams {
  sub?: string;
  googleSub?: string;
  facebookSub?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  profile?: string;
  gender?: string;
  age?: number;
  birthdate?: Date;
  role?: string;
  favorites?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  lastActive?: Date;
  lastSeen?: Date;
  sessions?: {
    deviceId?: string;
    ipAddress?: string;
    lastLogin?: Date;
  }[];
  privacySettings?: {
    lastSeenVisibleTo: "everyone" | "contacts" | "nobody";
    profilePhotoVisibleTo: "everyone" | "contacts" | "nobody";
  };
}

export interface UserUpdateRepoParamsOld {
  id?: string;
  username?: string;
  gender?: string;
  age?: number;
}
export interface UserUpdateRepoParams {
  _id?: string;
  sub?: string;
  googleSub?: string;
  facebookSub?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  profile?: string;
  role?: string;
  gender?: string;
  age?: number;
  favorites?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  lastActive?: Date;
  lastSeen?: Date;
  sessions?: {
    deviceId: string;
    ipAddress: string;
    lastLogin: Date;
  }[];
  privacySettings?: {
    lastSeenVisibleTo: "everyone" | "contacts" | "nobody";
    profilePhotoVisibleTo: "everyone" | "contacts" | "nobody";
  };
  contacts?: Types.ObjectId[] | string[];
}

export interface MongoError extends Error {
  code?: number;
  keyPattern?: { [key: string]: number };
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
export interface getMultiProfileCompanyResponse {
  _id?: string;
  profile: string;
  name: string;
}
