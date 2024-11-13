import { prettyObject } from "@sabaicode-dev/camformant-libs";
import JobOpeningRepository from "../database/repositories/jobOpening.repository";


class JobOpeningService {

    public async createJob(companyId: string, jobData: any) {
        try {
            const newJob = await JobOpeningRepository.createJob({ ...jobData, company_id: companyId });
            if (!newJob) {
                throw new Error("Job creation failed.");
            }
            return newJob;
        } catch (error) {
            console.error(
                `JobOpeningService - createJob() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    public async closeJob(jobId: string) {
        try {
            const job = await JobOpeningRepository.closeJob(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            return job;
        } catch (error) {
            console.error(
                `JobOpeningService - closeJob() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

}

export default new JobOpeningService();