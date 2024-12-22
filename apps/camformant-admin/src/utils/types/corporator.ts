export interface CorporatorParams{
  _id?: string;
  sub?: string;
  status?:string
  name?: string;
  email?: string;
  role?: "company";
  profile?: string;
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
  contact?: {
    phone_number?: string;
    website?: string;
  };
  social_links?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  description?: string;
  employee_count?: number;
  job_openings_count?: number;
  job_closings_count?: number;
  completed?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type BRAND = {
  logo: string;
  name: string;
  email: string;
  createdAt: string;
  employee:number
  conversion: number;
};
