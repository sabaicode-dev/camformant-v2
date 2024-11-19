import { prettyObject } from "@sabaicode-dev/camformant-libs";
import JobOpeningRepository from "../database/repositories/jobOpening.repository";
import {
  JobGetAllControllerParams,
  JobParams,
} from "../controllers/types/job-controller.type";
import searchService from "./search.service";
import { IJob } from "../database/models/job.model";
import mongoose from "mongoose";

class JobOpeningService {
  public async getAllJobs(queries: JobGetAllControllerParams, userId = null) {
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
      const newJob = await JobOpeningRepository.createJob({
        ...jobData,
        companyId: new mongoose.Types.ObjectId(companyId),
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

  public async getJobById(jobId: string): Promise<IJob> {
    try {
      const result = await JobOpeningRepository.findJobById(jobId);
      if (!result) {
        throw new Error(
          "JobOpeningService - getJobById() method error: Job not found"
        );
      }
      return result;
    } catch (error) {
      console.error(
        `JobOpeningService - getJobById() method error:`,
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
      const newJob = await JobOpeningRepository.updateJobById({
        _id: jobId,
        ...updateJob,
      });

      return newJob;
    } catch (error) {
      console.error(
        `JobOpeningService - updateJobById() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async deleteJobById(jobId: string) {
    try {
      await JobOpeningRepository.deleteJobById(jobId);
    } catch (error) {
      console.error(
        `JobOpeningService - deleteJobById() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async closeJob(jobId: string) {
    try {
      const job = await JobOpeningRepository.closeJob(jobId);
      if (!job) {
        throw new Error("Job not found");
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
