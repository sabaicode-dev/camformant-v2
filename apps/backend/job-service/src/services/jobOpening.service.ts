import JobOpeningRepository from "../database/repositories/jobOpening.repository";


class JobOpeningService {

    public async createJob(companyId: string, jobData: any) {
        return JobOpeningRepository.createJob({ ...jobData, company_id: companyId });
    }

    public async closeJob(jobId: string) {

        const job = await JobOpeningRepository.closeJob(jobId);
        if (!job) {
            throw new Error('Job not found');
        }
        return job;
    }

}

export default new JobOpeningService();