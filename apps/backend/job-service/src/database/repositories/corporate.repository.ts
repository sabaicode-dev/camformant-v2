// companyJob.repository.ts

import CorporateProfileModel, { ICorporateProfile } from "../models/corporateProfile.model";

class CompanyJobRepository {

    public async createProfile(profileData: ICorporateProfile): Promise<ICorporateProfile> {
        const profile = new CorporateProfileModel(profileData);
        return profile.save();
    }

    public async findProfileById(companyId: string): Promise<ICorporateProfile | null> {
        return CorporateProfileModel.findById(companyId);
    }

    public async updateProfileById(
        id: string,
        profileData: ICorporateProfile
    ): Promise<ICorporateProfile | null> {
        return CorporateProfileModel.findByIdAndUpdate(id, profileData, { new: true }).exec();
    }

    public async getAllProfiles(): Promise<ICorporateProfile[]> {
        return CorporateProfileModel.find().exec();
    }
}

export default new CompanyJobRepository();