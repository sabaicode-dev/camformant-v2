import companyJobRepository from "../database/repositories/corporate.repository";
import { ICorporateProfile } from "../database/models/corporateProfile.model";
import jobOpeningRepository from "../database/repositories/jobOpening.repository";
import { Document } from 'mongoose';
import { prettyObject } from "@sabaicode-dev/camformant-libs";


class CorporateService {

    public async getAllProfiles(): Promise<ICorporateProfile[]> {
        try {
            const corporateProfile = await companyJobRepository.getAllProfiles();
            if (!corporateProfile) {
                console.log('CorporateService - postIJob() method error: No corporate profile found');
                return [];
            }
            return corporateProfile;
        } catch (error) {
            console.error(
                `CorporateService - postIJob() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async createProfile(profileData: ICorporateProfile) {
        try {
            const profile = await companyJobRepository.createProfile(profileData);
            if (!profile) {
                console.log('CorporateService - createProfile() method error: Profile not created');
                throw new Error('Profile not created');
            }
            return profile;
        } catch (error) {
            console.error(
                `CorporateService - createProfile() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async getProfileById(id: string): Promise<ICorporateProfile | null> {
        try {
            const corporateProfile = await companyJobRepository.findProfileById(id);
            if (!corporateProfile) {
                console.log('CorporateService - getProfileById() method error: No corporate profile found');
                return null;
            }
            return corporateProfile;

        } catch (error) {
            console.error(
                `CorporateService - getProfileById() method error: `,
                prettyObject(error as {})
            );
            throw error;

        }
    }

    public async updateCorporateProfile(corporateId: string, profileData: ICorporateProfile) {
        try {
            const profile = await companyJobRepository.updateCorporateProfile(corporateId, profileData);
            if (!profile) {
                console.log('CorporateService - updateCorporateProfile() method error: Profile not updated');
                throw new Error('CorporateService - updateCorporateProfile() method error: Profile not updated');
            }
            return profile;
        } catch (error) {
            console.error(
                `CorporateService - updateCorporateProfile() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async deleteCorporateProfile(corporateId: string) {
        try {
            const profile = await companyJobRepository.deleteCorporateProfile(corporateId);
            if (!profile) {
                console.log('CorporateService - deleteCorporateProfile() method error: Profile not deleted');
                throw new Error('CorporateService - deleteCorporateProfile() method error: Profile not deleted');
            }
            return profile;
        } catch (error) {
            console.error(
                `CorporateService - deleteCorporateProfile() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }


    public async getProfileWithJobs(companyId: string, recentJobsLimit: number = 5) {

        const profile = await companyJobRepository.findProfileById(companyId);

        if (!profile) {
            console.log('CorporateService - getProfileWithJobs() method error: Profile not found');
            return null;
        }
        const [totalJobs, recentJobs] = await Promise.all([
            jobOpeningRepository.countJobsByCompanyId(companyId), // total jobs
            jobOpeningRepository.findRecentJobsByCompanyId(companyId, recentJobsLimit) // recent jobs
        ]);

        const jobStats = {
            total: totalJobs,
            recentJobs: recentJobs
        };

        const profileObject = (profile as Document & { toObject: () => any }).toObject();

        return { ...profileObject, jobStats };
    }


}

export default new CorporateService()