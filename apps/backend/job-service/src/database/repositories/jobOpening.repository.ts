import { prettyObject } from "@sabaicode-dev/camformant-libs";
import { JobOpening, JobOpeningModel } from "../models/jobOpening.model";

class JobOpeningRepository {

    public async countJobsByCompanyId(companyId: string): Promise<number> {
        try {
            const result = await JobOpeningModel.countDocuments({ company_id: companyId });
            if (!result) {
                console.log("JobOpeningRepository - countJobsByCompanyId() method error : No jobs found for the company.");
                return {} as any;
            }
            return result;
        } catch (error) {
            console.error(
                `JobOpeningReposotory - countJobsByCompanyId() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async countJobsByStatus(companyId: string, status: string): Promise<number> {
        try {
            const result = await JobOpeningModel.countDocuments({ company_id: companyId, status });
            if (!result) {
                return 0;
            }
            return result;
        } catch (error) {
            console.error(
                `JobOpeningReposotory - countJobsByStatus() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async findRecentJobsByCompanyId(companyId: string, limit: number) {
        try {
            const result = await JobOpeningModel.find({ company_id: companyId })
                .sort({ created_at: -1 }).limit(limit);
            if (!result) {
                return 0
            }
            return result;
        } catch (error) {
            console.error(
                `JobOpeningReposotory - findRecentJobsByCompanyId() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async createJob(jobData: Partial<JobOpening>): Promise<JobOpening> {
        try {
            const job = new JobOpeningModel(jobData);
            if (!job) {
                throw new Error("Job creation failed.");
            }
            return job.save();
        } catch (error) {
            console.error(
                `JobOpeningReposotory - createJob() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async findJobsByCompanyId(companyId: string): Promise<JobOpening[]> {
        try {
            const result = await JobOpeningModel.find({ company_id: companyId, status: 'open' });
            if (!result) {
                console.log("JobOpeningRepository - findJobsByCompanyId() method error : No jobs found for the company.");
                return [] as any;
            }
            return result;
        } catch (error) {
            console.error(
                `JobOpeningReposotory - findJobsByCompanyId() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async closeJob(jobId: string): Promise<JobOpening | null> {
        try {
            const job = await JobOpeningModel.findByIdAndUpdate(jobId, { status: 'closed' }, { new: true });
            if (!job) {
                console.log("JobOpeningRepository - closeJob() method error : Job not found.");
                return null;
            }
            return job;
        } catch (error) {
            console.error(
                `JobOpeningReposotory - closeJob() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

}

export default new JobOpeningRepository();