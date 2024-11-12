import companyJobRepository from "../database/repositories/corporate.repository";
import { ICorporateProfile } from "../database/models/corporateProfile.model";
import jobOpeningRepository from "../database/repositories/jobOpening.repository";
import { Document } from 'mongoose';


class CorporateService {

    public async getAllProfiles(): Promise<ICorporateProfile[]> {
        return companyJobRepository.getAllProfiles();
    }

    public async createProfile(profileData: ICorporateProfile) {
        return companyJobRepository.createProfile(profileData);
    }

    public async getProfileWithJobs(companyId: string, recentJobsLimit: number = 5) {

        const profile = await companyJobRepository.findProfileById(companyId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        const [totalJobs, openJobs, draftJobs, recentJobs] = await Promise.all([
            jobOpeningRepository.countJobsByCompanyId(companyId), // total jobs
            jobOpeningRepository.countJobsByStatus(companyId, 'open'), // open jobs
            jobOpeningRepository.countJobsByStatus(companyId, 'draft'), // draft jobs
            jobOpeningRepository.findRecentJobsByCompanyId(companyId, recentJobsLimit) // recent jobs
        ]);

        const jobStats = {
            total: totalJobs,
            open: openJobs,
            drafts: draftJobs,
            recentJobs: recentJobs
        };

        const profileObject = (profile as Document & { toObject: () => any }).toObject();

        return { ...profileObject, jobStats };
    }

    public async getProfileById(id: string): Promise<ICorporateProfile | null> {
        return companyJobRepository.findProfileById(id);
    }

}

export default new CorporateService()