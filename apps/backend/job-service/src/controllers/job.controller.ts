import {
  JobGetAllControllerParams,
  JobParams,
} from "@/src/controllers/types/job-controller.type";
import { IJob } from "@/src/database/models/job.model";
import jobService from "@/src/services/job.service";
import searchService from "@/src/services/search.service";
import sendResponse from "@/src/utils/send-response";
import { APIResponse, prettyObject } from "@sabaicode-dev/camformant-libs";
import {
  Controller,
  Route,
  Post,
  Tags,
  Path,
  Get,
  Body,
  Put,
  Delete,
  Queries,
  SuccessResponse,
  Request,
} from "tsoa";
import { Request as ExpressRequest } from "express";
import axios from "axios";
import configs from "../config";

@Route("/v1/jobs")
@Tags("Job")
export class JobController extends Controller {
  @Delete("{jobId}")
  public async deleteJobById(
    @Path() jobId: string
  ): Promise<{ message: string }> {
    try {
      await jobService.deleteJobById(jobId);
      return { message: "Job was deleted successfully" };
    } catch (error) {
      console.error(
        `CompanyController deleteJobById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  //new post
  @SuccessResponse("201", "Created")
  @Post("/job")
  public async postIJob(@Request() request: ExpressRequest, @Body() body: IJob): Promise<APIResponse<IJob>> {
    try {
      const corporateSub = request.cookies["username"];

      if (!corporateSub) {
        console.log(
          "CorporateController - getCorporateProfileWithJobs() method error : Corporate Sub is missing"
        );
        return sendResponse<IJob>({
          message: "Corporate ID is missing",
          data: {} as IJob,
        });
      }
      const getCorporateProfileId = await axios.get(
        `${configs.corporator_api_endpoint}/profile/${corporateSub}`
      );

      const corporateProfileId = getCorporateProfileId.data.data._id || null;

      if (!getCorporateProfileId || !corporateProfileId) {
        console.log(
          "CorporateController - getCorporateProfileWithJobs() method error : Corporate Profile ID is missing"
        );
        return sendResponse<IJob>({
          message: "Corporate Profile ID is missing",
          data: {} as IJob,
        });
      }

      const newJob = await jobService.createJob(corporateProfileId, body);
      if (!newJob) {
        console.log(
          "CorporateController - postIJob() method error : Job creation failed."
        );
        return {} as any;
      }
      return sendResponse<IJob>({
        message: "Job was created successfully!",
        data: newJob,
      });
    } catch (error) {
      console.error(
        `CorporateController - postIJob() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  //
  @SuccessResponse("201", "Created")
  @Post("/")
  public async createJob(@Body() req: JobParams): Promise<APIResponse<IJob>> {
    try {
      const jobs = await jobService.createNewJob(req);
      this.setStatus(201);
      return sendResponse<IJob>({ message: "success", data: jobs });
    } catch (error) {
      throw error;
    }
  }
  @Get("/")
  public async getAllJobs(
    @Request() request: ExpressRequest,
    @Queries() queries: JobGetAllControllerParams
  ) {
    try {
      const userId = request.cookies["user_id"] || null;

      const response = await jobService.getAllJobs(queries, userId);

      return {
        message: "success",
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }
  @Get("/corporator")
  public async getAllJobsWithCorporator(
    @Request() request: ExpressRequest,
  ): Promise<APIResponse<IJob[]>> {
    try {
      const userSub = request.cookies["username"] || null;
      const getCorporateProfile = await axios.get(`${configs.corporator_api_endpoint}/profile/${userSub}`);
      const getCorporateProfileId = getCorporateProfile.data.data._id || null;

      const response = await jobService.getAllJobsWithCorporator(getCorporateProfileId);

      return sendResponse<IJob[]>({ message: "success", data: response });
    } catch (error) {
      throw error;
    }
  }
  //todo::
  @Get("/search-history")
  public async getSearchHistory(
    @Request() request: ExpressRequest
  ): Promise<APIResponse<string[]>> {
    try {
      const userId = request.cookies["user_id"] || null;

      const response = await searchService.getSearchHistory(userId);

      return sendResponse<string[]>({ message: "success", data: response });
    } catch (error) {
      throw error;
    }
  }
  //todo::

  @Get("/search-trending")
  public async getSearchTrending(): Promise<APIResponse<string[]>> {
    try {
      const response = await searchService.getTrendingSearches();

      return sendResponse<string[]>({ message: "success", data: response });
    } catch (error) {
      throw error;
    }
  }

  @Get("{jobId}")
  public async getJobById(@Path() jobId: string) {
    try {
      const getJob = await jobService.getJobById(jobId);

      return sendResponse<IJob>({ message: "success", data: getJob });
    } catch (error) {
      throw error;
    }
  }

  @Put("{jobId}")
  public async updateJobById(
    @Path() jobId: string,
    @Body() updateDatJob: JobParams
  ) {
    try {
      const updateJob = await jobService.updateJobById(jobId, updateDatJob);
      return sendResponse<IJob>({ message: "success", data: updateJob });
    } catch (error) {
      console.error(
        `jobController updateJobById() method error: `,
        prettyObject(error as {})
      );
    }
  }

 
}

export default new JobController();
