export interface JobDetails {
  label: string;
  value:string;
}

export interface JobTechnicalDetail {
  jobRole: string;
  minSalary: string;
  maxSalary: string;
  locality: string;
  company: string;
  jobId: string;
  benefit?: string[];
}

export interface Job {
  title: string;
  company: string;
  location: string;
  details: JobDetails[];
  requirements: string[];
  technicalDetails: JobTechnicalDetail;
}