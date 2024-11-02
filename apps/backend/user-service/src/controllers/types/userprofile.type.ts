export interface IUserProfile{
  userId: string;
  basic?: BasicParams;
  skills?: SkillParams[];
  expertise?: ExpertiseParams[];
  languages?: LanguageParams[];
  educations?: EducationParams[];
  experiences?: ExperienceParams[];
  references?: ReferenceParams[];
  descriptions?: DescriptionParams;
  portfolio?: PortfolioParams[];
}
export interface BasicParams {
  surname: string;
  lastname: string;
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
  description?: string;
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
export interface CertificateParams {
    url:string
 
}

export type UnionProfileType =
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
  |CertificateParams[]
  |null
  ;
