import mongoose from "mongoose";
export interface IUserProfile {
  basic?: BasicParams;
  skills?: SkillParams[];
  expertise?: ExpertiseParams[];
  languages?: LanguageParams[];
  educations?: EducationParams[];
  experiences?: ExperienceParams[];
  references?: ReferenceParams[];
  description?: DescriptionParams;
  portfolio?: PortfolioParams[];
}
export interface BasicParams {
  surName: string;
  lastName: string;
  career: string;
  email: string;
  dob: string;
  address: string;
  phonenumber: string;
  martial?: string;
}
export interface SkillParams {
  name: string;
  percent: number;
}
export interface ExpertiseParams {
  name: string;
  proficiency: string;
}
export interface EducationParams {
  academic: string;
  school: string;
  major: string;
  year: string;
}
export interface ExperienceParams {
  position: string;
  company: string;
  descriptions?: string;
  year?: string;
}
export interface LanguageParams {
  name: string;
  proficiency: string;
}
export interface DescriptionParams {
  description: string;
  strength: string;
}
export interface ReferenceParams {
  name: string;
  career: string;
  company: string;
  email: string;
  phonenumber: string;
}
export interface PortfolioParams {
  name: string;
  url: string;
}
//BasicParams schema
const BasicParamsSchema = new mongoose.Schema({
  surName: { type: String, required: true },
  lastName: { type: String, required: true },
  career: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: String, required: true },
  address: { type: String, required: true },
  phonenumber: { type: String, required: true },
  martial: { type: String }, // Optional field
});

//SkillParams schema
const SkillParamsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percent: { type: Number, required: true },
});

//ExpertiseParams schema
const ExpertiseParamsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, required: true },
});

//EducationParams schema
const EducationParamsSchema = new mongoose.Schema({
  academic: { type: String, required: true },
  school: { type: String, required: true },
  major: { type: String, required: true },
  year: { type: String }, // Optional field
});

//ExperienceParams schema
const ExperienceParamsSchema = new mongoose.Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  year: { type: String }, // Optional field
  descriptions: { type: String }, // Optional field
});

//LanguageParams schema
const LanguageParamsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, required: true },
});

//ReferenceParams schema
const ReferenceParamsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  career: { type: String, required: true },
  email: { type: String, required: true },
  phonenumber: { type: String, required: true },
});

//DescriptionParams schema (currently empty, customize as needed)
const DescriptionParamsSchema = new mongoose.Schema({
  description: { type: String },
  strength: { type: String },
});
const PortfolioParamSchema = new mongoose.Schema({
  name: { type: String },
  url: { type: String },
});

//IUserProfile schema
const UserProfileSchema = new mongoose.Schema({
  basic: { type: BasicParamsSchema, required: false },
  skills: { type: [SkillParamsSchema], default: [] },
  expertise: { type: [ExpertiseParamsSchema], default: [] },
  educations: { type: [EducationParamsSchema], default: [] },
  experiences: { type: [ExperienceParamsSchema], default: [] },
  languages: { type: [LanguageParamsSchema], default: [] },
  references: { type: [ReferenceParamsSchema], default: [] },
  description: { type: DescriptionParamsSchema, required: false },
  portfolio: { type: [PortfolioParamSchema], default: [] },
});

//model
const UserProfileModel = mongoose.model(
  "UserProfile",
  UserProfileSchema,
  "UserProfile"
);

export default UserProfileModel;
