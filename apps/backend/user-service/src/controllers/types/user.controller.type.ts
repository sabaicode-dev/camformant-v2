import { Types } from "mongoose";
export interface IUser {
  _id?: string;
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
    deviceId: string;
    ipAddress: string;
    lastLogin: Date;
  }[];
  privacySettings?: {
    lastSeenVisibleTo: "everyone" | "contacts" | "nobody";
    profilePhotoVisibleTo: "everyone" | "contacts" | "nobody";
  };
}
export interface PaginationResponse<T> {
  [key: string]: T[] | number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface UserProfileResponse {
  message: string;
  data: IUser;
}
export interface UsersPaginatedResponse {
  message: string;
  data: PaginationResponse<IUser>;
}
export interface UserCreationRequestParams {
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
    deviceId: string;
    ipAddress: string;
    lastLogin: Date;
  }[];
  privacySettings?: {
    lastSeenVisibleTo: "everyone" | "contacts" | "nobody";
    profilePhotoVisibleTo: "everyone" | "contacts" | "nobody";
  };
}
export interface UserUpdateRequestParams {
  sub?: string;
  googleSub?: string;
  facebookSub?: string;
  username?: string;
  profile?: string;
  gender?: string;
  age?: number;
  role?: string;
}
export interface UserGetAllControllerParams {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}

