import { JobOpening, JobOpeningModel } from "../models/jobOpening.model";

class JobOpeningRepository {

    // Count jobs by company
    public async countJobsByCompanyId(companyId: string): Promise<number> {
        return JobOpeningModel.countDocuments({ company_id: companyId });
    }

    // Count jobs by company and status
    public async countJobsByStatus(companyId: string, status: string): Promise<number> {
        return JobOpeningModel.countDocuments({ company_id: companyId, status });
    }

    // Fetch recent jobs, sorted by creation date
    public async findRecentJobsByCompanyId(companyId: string, limit: number) {
        return JobOpeningModel.find({ company_id: companyId })
            .sort({ created_at: -1 }) // Sort by creation date (newest first)
            .limit(limit);
    }

    public async createJob(jobData: Partial<JobOpening>): Promise<JobOpening> {
        const job = new JobOpeningModel(jobData);
        return job.save();
    }

    public async findJobsByCompanyId(companyId: string): Promise<JobOpening[]> {
        return JobOpeningModel.find({ company_id: companyId, status: 'open' });
    }

    public async closeJob(jobId: string): Promise<JobOpening | null> {
        return JobOpeningModel.findByIdAndUpdate(jobId, { status: 'closed' }, { new: true });
    }

}

export default new JobOpeningRepository();