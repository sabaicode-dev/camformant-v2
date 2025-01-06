import mongoose from "mongoose";
export interface CvFilePResponse {
  message: string;
  data: CvFileParams;
}
export interface CvFileParams {
  userId?: mongoose.Types.ObjectId;
  cv?: {
    url: string;
    _id: mongoose.Types.ObjectId | null | undefined;
  }[];
}

export interface CvStyleParams {
  _id: mongoose.Types.ObjectId;
  style: string;
  thumbnail: string;
  json: {
    version: string;
    objects: any[];
  };
}

export interface CustomCvResponse {
  _id: mongoose.Types.ObjectId;
  style: string;
  json: {
    version: string;
    objects: any[];
    clipPath: any;
  };
}
export type UnionCustomCvResponse = CustomCvResponse | undefined | null | {};
