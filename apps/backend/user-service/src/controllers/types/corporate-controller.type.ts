
import { ICorporateModel } from "@/src/database/models/corporate.model";

export interface ICorporate {
    message: string;
    data: ICorporateModel;
}

export interface CorporateProfileResponse {
    message: string;
    data: {
        user: ICorporateModel;
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
    data: ICorporateModel;
}