import mongoose from "mongoose";
export interface IUserProfileResposne{
  message:string;
  data:IUserProfile
}
export interface IUserProfile {
  basic?: BasicParams;
  skills?: (SkillParams & { index?: number })[];
  expertise?: (ExpertiseParams & { index?: number })[];
  languages?: (LanguageParams & { index?: number })[];
  educations?: (EducationParams & { index?: number })[];
  experiences?: (ExperienceParams & { index?: number })[];
  references?: (ReferenceParams & { index?: number })[];
  descriptions?: DescriptionParams;
  certificates?: CertificateParams[];
  portfolio?: PortfolioParams[];
  cv?: string;
}
export interface BasicParams {
  surname?: string;
  lastname?: string;
  career?: string;
  email?: string;
  dob?: string;
  address?: string;
  phonenumber?: string;
  martial?: string;
}
export interface SkillParams {
  name?: string;
  percent?: number;
}
export interface ExpertiseParams {
  name?: string;
  proficiency?: string;
}
export interface EducationParams {
  academic?: string;
  school?: string;
  major?: string;
  year?: string;
}
export interface ExperienceParams {
  position?: string;
  company?: string;
  description?: string;
  year?: string;
}
export interface LanguageParams {
  name?: string;
  proficiency?: string;
}
export interface DescriptionParams {
  description?: string;
  strength?: string;
}
export interface ReferenceParams {
  name?: string;
  career?: string;
  company?: string;
  email?: string;
  phonenumber?: string;
}
export interface PortfolioParams {
  name: string;
  url: string;
}
export interface CertificateParams {
  url: string;
}
export interface CvParam {
  cv: string;
}
interface IdParams {
  _id: mongoose.Types.ObjectId;
  userId: string;
}

export type UnionProfileType =
  | IdParams
  | IUserProfile[]
  | BasicParams
  | SkillParams[]
  | ExperienceParams[]
  | EducationParams[]
  | ExperienceParams[]
  | LanguageParams[]
  | DescriptionParams
  | ReferenceParams[]
  | PortfolioParams[]
  | CertificateParams[]
  | CvParam
  | null
  | undefined;
