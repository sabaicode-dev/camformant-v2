import mongoose from "mongoose"
export interface CvStyleParams {
  _id: mongoose.Types.ObjectId; 
  style: string;                 
  json: {
    version: string;             
    objects: any[];              
  };
}