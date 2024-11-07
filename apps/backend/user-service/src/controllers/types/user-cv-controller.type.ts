import mongoose from "mongoose"

export interface CvFileResParams{
  userId:mongoose.Types.ObjectId
}
export interface CvFilesParams extends CvFileResParams{
  cv:{
    _id:mongoose.Types.ObjectId| null | undefined,
    url:string|null|undefined
  }[]
}


export interface CvStyleParams {
  _id: mongoose.Types.ObjectId; 
  style: string;                 
  json: {
    version: string;             
    objects: any[];              
  };
}