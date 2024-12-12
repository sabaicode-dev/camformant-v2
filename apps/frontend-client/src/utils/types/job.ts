export enum EmploymentType {
    CONTRACT = "Contract",
    INTERNSHIP = "Internship",
}

export enum EmploymentSchedule {
    FULL_TIME = "Full-Time",
    PART_TIME = "Part-Time",
    FLEXIBLE_HOURS = "Flexible-Hours",
    PROJECT_BASED = "Project-Based",
}

export enum WorkMode {
    REMOTE = "Remote",
    ON_SITE = "On-Site",
    HYBRID = "Hybrid",
}

export interface StatusDate {
    status: "Apply" | "Review" | "Interview" | "Shortlist" | "Accept";
}
export interface IJob {
    _id?: string;
    companyId?: string;
    profile?: string;
    title?: string; // name of the job that company looking for. Example: Java Developer
    position?: string[]; // tags that belong to the tile: Backend Development, Programming, etc.
    workMode?: WorkMode[];
    location?: string; // location could be phnom penh, kompong-cham, etc.
    requirement?: string;
    description?: string;
    address?: string; // address could be the link address of the company (google link)
    min_salary?: number;
    max_salary?: number;
    job_opening?: number;
    type?: EmploymentType[];
    schedule?: EmploymentSchedule[];
    required_experience?: string[];
    benefit?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    deadline?: Date;
}

export interface UserInfo {
    profile: string;
    name: string;
    status: string;
    cv: string;
}

export interface JobApplication {
    _id?: string;
    userId?: string;
    jobId?: string;
    userInfo?: UserInfo;
    jobInfo?: IJob;
    statusDate?: StatusDate;
    appliedAt?: string;
    updatedAt?: string;
}