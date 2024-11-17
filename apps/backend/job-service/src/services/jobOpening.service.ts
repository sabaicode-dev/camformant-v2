import { prettyObject } from "@sabaicode-dev/camformant-libs";
import JobOpeningRepository from "../database/repositories/jobOpening.repository";
import { JobGetAllControllerParams } from "../controllers/types/job-controller.type";
import searchService from "./search.service";


class JobOpeningService {

    public async getAllJobs(queries: JobGetAllControllerParams, userId = null) {
        try {
            const { page, limit, filter, sort, search } = queries;

            const newQueries = {
                page,
                limit,
                filter: filter && JSON.parse(filter),
                sort: sort && JSON.parse(sort),
                search,
            };

            const result = await JobOpeningRepository.getAllJobs(newQueries);

            if (search) {
                await searchService.saveSearchHistory(userId, search);
            }

            return result;
        } catch (error) {
            console.error(
                `JobService getAllJobs() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

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