import mongoose from "mongoose";
export interface CvFilesParams {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  cv: {
    _id: mongoose.Types.ObjectId | null | undefined;
    url: string | null | undefined;
  }[];
}
export interface CvFileParams {
  userId: mongoose.Types.ObjectId;
  cv: {
    url: string;
    _id: mongoose.Types.ObjectId | null | undefined;
  }[];
}
interface IDParams {
  _id: mongoose.Types.ObjectId| null | undefined;
  userId: mongoose.Types.ObjectId| null | undefined;
}
export type UnionCVFilesParams = IDParams | CvFilesParams | null;

export interface CvStyleParams {
  _id: mongoose.Types.ObjectId;
  style: string;
  json: {
    version: string;
    objects: any[];
  };
}
