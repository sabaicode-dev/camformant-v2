export interface SkillParams {
  name: string;
  percent?: string;
}

export interface ExpertiseParams {
  name: string;
  proficiency?: string;
}

export interface LanguageParams {
  name: string;
  proficiency?: string;
}
export interface BasicParams {
  surname: string;
  lastname: string;
  career: string;
  email?: string;
  phonenumber?: string;
  dob?: string;
  address?: string;
  martial?: string;
}
export interface ExperienceParams {
  position: string;
  company: string;
  description?: string;
  year: string;
}
export interface PortfolioParam {
  name: string;
  url: string;
}
export interface EducationParams {
  academic: string;
  school: string;
  major: string;
  year: string;
}
export interface ReferenceParams {
  name: string;
  career: string;
  email: string;
  company: string;
  phonenumber: string;
}

export interface DescriptionParams {
  description: string;
  strength: string;
}

export interface MatchParams {
  message: string;
  shortMessage: string;
  replacements: { value: string }[];
  offset: number;
  length: number;
  context: {
    text: string;
    offset: number;
    length: number;
  };
  sentence: string;
  type: {
    typeName: string;
  };
}