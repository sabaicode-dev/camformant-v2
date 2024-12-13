import {
  BodyUpdateJobApply,
  GetApplyJobResLimit,
  JobApplyQueriesController,
  JobApplyResponse,
  JobGetAllControllerParams,
  JobParams,
  PostJobApplyBody,
} from "@/src/controllers/types/job-controller.type";
import { IJob, returnJobs } from "@/src/database/models/job.model";
import jobRepository from "@/src/database/repositories/job.repository";
import searchService from "@/src/services/search.service";
import { prettyObject } from "@sabaicode-dev/camformant-libs";
import axios from "axios";
import mongoose from "mongoose";

interface NotificationPayload {
  title: string;
  body: string;
  data?: { url?: string };
  tag?: string;
  timestamp?: Date;
  icon?: string;
}
class JobService {
  //new post
  public async createJob(companyId: string, jobData: any) {
    try {
      //todo:
      const newJob = await jobRepository.createJob({
        ...jobData,
        companyId: companyId,
      });
      if (!newJob) {
        throw new Error("Job creation failed.");
      }
      console.log("11111111111");
      //todo: push notification
      const payload: NotificationPayload = {
        title: newJob.title!,
        body: newJob.description!,
        data: { url: `/jobs/${newJob._id}` },
        tag: `notification-${Date.now()}`,
        icon: "https://sabaicode.com/sabaicode.jpg",
        timestamp: new Date(),
      };
      console.log("222222");
      await axios.post(
        "http://localhost:4004/v1/notifications/push-all-notifications",
        payload
      );
      console.log("hiiiiiii");
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
      console.log("filter in service::::", filter);
      const newQueries = {
        page,
        limit,
        filter: filter && JSON.parse(filter),
        sort: sort && JSON.parse(sort),
        search,
        userFav: searchUserFav,
      };
      console.log("new query in service::::", newQueries);

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
  public async getAllJobsWithCorporator(companyId: string) {
    try {
      const result = await jobRepository.getAllJobsWithCorporator(companyId);

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

  public async updateJobById(jobId: string, updateJob: IJob): Promise<IJob> {
    try {
      console.log("user data in service:::::", updateJob);
      const newJob = await jobRepository.updateJobById({
        _id: jobId,
        ...updateJob,
        companyId: updateJob.companyId,
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
  public async getJobApply(
    queries: JobApplyQueriesController
  ): Promise<JobApplyResponse[] | GetApplyJobResLimit> {
    try {
      const { userId, jobId, companyId, page, limit, filter, sort } = queries;
      console.log("userId", userId);
      const newQueries = {
        userId,
        jobId,
        companyId,
        page,
        limit,
        filter,
        sort: sort && JSON.parse(sort),
      };
      const response = await jobRepository.getJobApply(newQueries);
      return response;
    } catch (error) {
      throw error;
    }
  }
  public async createJobApply(
    body: PostJobApplyBody
  ): Promise<JobApplyResponse | {}> {
    try {
      console.log("inside create apploy");
      const customBody = {
        ...body,
        statusDate: {
          Apply: new Date(),
        },
      };
      const response = await jobRepository.createJobApply(customBody);
      return response;
    } catch (err) {
      throw err;
    }
  }
  public async updateJobApply(
    applyId: string,
    body: BodyUpdateJobApply
  ): Promise<JobApplyResponse | {} | null> {
    try {
      const response = await jobRepository.updateJobApply(applyId, body);
      return response;
    } catch (err) {
      throw err;
    }
  }
  public async deleteManyJobApply(jobId: string) {
    try {
      await jobRepository.deleteManyJobApply(jobId);
    } catch (err) {
      throw err;
    }
  }
  public async deleteJobApply(applyId: string) {
    try {
      await jobRepository.deleteJobApply(applyId);
    } catch (err) {
      throw err;
    }
  }
  public async getApplyLength(query: {
    id?: string;
    filter: string;
  }): Promise<
    | { [key: string]: number }
    | { [key: string]: { [key: string]: number } }
    | undefined
  > {
    try {
      const response = await jobRepository.getApplyLength({
        id: query.id ? JSON.parse(query.id) : undefined,
        filter: JSON.parse(query.filter),
      });
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default new JobService();
