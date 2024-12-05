import { ICorporatorProfile } from "@/src/database/models/corporate.model";

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
