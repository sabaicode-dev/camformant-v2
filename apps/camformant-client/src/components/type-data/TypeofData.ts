import { ReactNode } from "react";

interface Data2 {
  id?: number;
  txt?: string;
  logo?: string;
  position?: number;
  time?: JobTime;
  salary?: Salary;
  date?: string;
  location?: string;
  like?: boolean;
  day?: number;
  handleHeartClick?: (id: number) => void;
  styles?: string;
  handleClick?: () => void;
  process?: TypeProcess[];
}

interface JobTime {
  part: string;
  full: string;
}

interface Salary {
  min: number;
  max: number;
}

export interface TypeProcess {
  id?: string;
  date?: string;
  month?: string;
  status?: boolean;
  text?: string;
  icon?: ReactNode;
}

export interface IJob {
  _id?: string;
  companyId?: string;
  profile?:string
  title?: string; // name of the job that company looking for. Example: Java Developer
  position?: string[]; // tags that belong to the tile: Backend Development, Programming, etc.
  workMode?: string[];
  location?: string; // location could be phnom penh, kompong-cham, etc.
  requirement?: string;
  address?: string; // address could be the link address of the company (google link)
  description?: string;
  min_salary?: number;
  max_salary?: number;
  deadline?: Date;
  job_opening?: number;
  type?: string[];
  schedule?: string[];
  required_experience?: string[];
  benefit?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IJobFav extends IJob{
    favorite:boolean
}

export interface EmploymentSchedule {
  FULL_TIME: "Full-Time";
  PART_TIME: "Part-Time";
  FLEXIBLE_HOURS: "Flexible-Hours";
  PROJECT_BASED: "Project-Based";
}
export enum WorkMode {
  REMOTE = "Remote",
  ON_SITE = "On-Site",
  HYBRID = "Hybrid",
}
export interface EmploymentSchedule {
  FULL_TIME: "Full-Time";
  PART_TIME: "Part-Time";
  FLEXIBLE_HOURS: "Flexible-Hours";
  PROJECT_BASED: "Project-Based";
}
export interface EmploymentType {
  CONTRACT: "Contract";
  INTERNSHIP: "Internship";
}

export default Data2;
