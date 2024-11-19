// companyJob.repository.ts
import { NotFoundError, prettyObject } from "@sabaicode-dev/camformant-libs";
import CorporateProfileModel, { ICorporateProfile } from "../models/corporateProfile.model";

class CompanyJobRepository {

    public async getAllProfiles(): Promise<ICorporateProfile[]> {
        try {
            const profiles = CorporateProfileModel.find().exec();
            if (!profiles) {
                console.log('CompanyJobRepository - getAllProfiles() method error: No profiles found');
                return [];
            }
            return profiles;
        } catch (error) {
            console.error(
                `CompanyJobRepository - getAllProfiles() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async createProfile(profileData: ICorporateProfile): Promise<ICorporateProfile> {
        try {
            const profile = new CorporateProfileModel(profileData);
            if (!profile) {
                console.log('CompanyJobRepository - createProfile() method error: Profile not created');
                throw new Error('CompanyJobRepository - createProfile() method error: Profile not created');
            }
            return profile.save();
        } catch (error) {
            console.error(
                `CompanyJobRepository - createProfile() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async findProfileById(companyId: string): Promise<ICorporateProfile | null> {
        try {
            const profile = CorporateProfileModel.findById(companyId);
            if (!profile) {
                console.log('CompanyJobRepository - findProfileById() method error: Profile not found');
                return null;
            }
            return profile;
        } catch (error) {
            console.error(
                `CompanyJobRepository - findProfileById() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async updateCorporateProfile(companyId: string, profileData: ICorporateProfile): Promise<ICorporateProfile | null> {
        try {
            const profile = CorporateProfileModel.findByIdAndUpdate(companyId, profileData, { new: true }).exec();
            if (!profile) {
                console.log('CompanyJobRepository - updateCorporateProfile() method error: Profile not found');
                return null;
            }
            return profile;
        } catch (error) {
            console.error(
                `CompanyJobRepository - updateCorporateProfile() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async deleteCorporateProfile(companyId: string): Promise<ICorporateProfile | null> {
        try {
            const result = await CorporateProfileModel.findByIdAndDelete(companyId);

            if (!result) {
                throw new NotFoundError("Job was not found!");
            }

            return result;
        } catch (error) {
            console.error(
                `CompanyJobRepository - deleteCorporateProfile() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async updateProfileById(
        id: string,
        profileData: ICorporateProfile
    ): Promise<ICorporateProfile | null> {
        try {
            const profile = CorporateProfileModel.findByIdAndUpdate(id, profileData, { new: true }).exec();
            if (!profile) {
                console.log('CompanyJobRepository - updateProfileById() method error: Profile not found');
                return null;
            }
            return profile;
        } catch (error) {
            console.error(
                `CompanyJobRepository - updateProfileById() method error: `,
                prettyObject(error as {})
            );
            throw error;

        }
    }

}

export default new CompanyJobRepository();