
export interface ICorporatorProfile {
  _id?: string;
  sub?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICorporate {
  message: string;
  data: ICorporatorProfile;
}

export interface CorporateProfileResponse {
  message: string;
  data: {
    user: ICorporatorProfile;
    jobs: string[];
  };
}

export interface CorporateProfileResquestParams {
  sub?: string;
  corporateProfileId?: string;
  username: string;
  profile?: string;
  email?: string;
  role?: string;
}

export interface CorporateProfileResponseCreate {
  message: string;
  data: ICorporatorProfile;
}
//jobs:
export interface JobOpeningRequest {
  title: string;
  description: string;
  requirements: string;
  location: {
    city: string;
    country: string;
  };
}
