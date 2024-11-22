import {
  JobGetAllControllerParams,
  JobParams,
} from "@/src/controllers/types/job-controller.type";
import { IJob, returnJobs } from "@/src/database/models/job.model";
import jobRepository from "@/src/database/repositories/job.repository";
import searchService from "@/src/services/search.service";
import { prettyObject } from "@sabaicode-dev/camformant-libs";
import mongoose from "mongoose";

class JobService {
  //new post
  public async createJob(companyId: string, jobData: any) {
    try {
      const newJob = await jobRepository.createJob({
        ...jobData,
        companyId: companyId,
      });
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
  //
  public async createNewJob(newInfo: JobParams): Promise<IJob> {
    try {
      const newJobInfo = {
        ...newInfo,
        companyId: new mongoose.Types.ObjectId(newInfo.companyId),
      };
      const jobs = await jobRepository.createNewJob(newJobInfo);
      return jobs;
    } catch (error) {
      console.error(
        `JobService createNewJob() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async getAllJobs(
    queries: JobGetAllControllerParams,
    userId = null
  ): Promise<{
    jobs: returnJobs[];
    totalJobs: number;
    totalPages: number;
    currentPage: number;
    skip: number;
    limit: number;
  }> {
    try {
      const { page, limit, filter, sort, search, userFav } = queries;
      const searchUserFav = userFav?.split(",") || [];

      const newQueries = {
        page,
        limit,
        filter: filter && JSON.parse(filter),
        sort: sort && JSON.parse(sort),
        search,
        userFav: searchUserFav,
      };

      const result = await jobRepository.getAllJobs(newQueries);

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

  public async getJobById(jobId: string): Promise<IJob> {
    try {
      const result = await jobRepository.findJobById(jobId);

      return result;
    } catch (error) {
      console.error(
        `jobService - getJobById() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async updateJobById(
    jobId: string,
    updateJob: JobParams
  ): Promise<IJob> {
    try {
      const newJob = await jobRepository.updateJobById({
        _id: jobId,
        ...updateJob,
        companyId: new mongoose.Types.ObjectId(updateJob.companyId),
      });

      return newJob;
    } catch (error) {
      console.error(
        `jobService - updateJobById() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async deleteJobById(jobId: string) {
    try {
      await jobRepository.deleteJobById(jobId);
    } catch (error) {
      console.error(
        `JobService - deleteJobById() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }
}

export default new JobService();
