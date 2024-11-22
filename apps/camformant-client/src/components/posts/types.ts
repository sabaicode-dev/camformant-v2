export interface companiesForJobs {
  _id?: string;
  profile?: string;
  name?: string;
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
  description?: string;
  contact?: {
    phone_number?: string;
    website?: string;
  };
  email?: string;
  job_openings_count?: number;
  job_closings_count?: number;
}
export interface returnJobs {
  _id?: string;
  title?: string;
  position?: string[];
  workMode?: string[];
  location?: string;
  requirement?: string;
  description?: string;
  address?: string;
  min_salary?: number;
  max_salary?: number;
  job_opening?: number;
  type?: string[];
  schedule?: string[];
  required_experience?: string[];
  benefit?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deadline?: Date;
  company?: companiesForJobs;
}
