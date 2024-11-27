import axios from "axios";
import {
  Controller,
  Get,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Body,
  Query,
  Request,
  Queries,
  Path,
  Put,
  Delete,
} from "tsoa";
import {
  APIResponse,
  PaginationResponse,
  prettyObject,
} from "@sabaicode-dev/camformant-libs";
import {
  JobGetAllControllerParams,
  JobParams,
} from "./types/job-controller.type";
import sendResponse from "@/src/utils/send-response";
import CorporateService from "../services/corporate.service";
import corporateService from "../services/corporate.service";
import { ICorporateProfile } from "../database/models/corporateProfile.model";
import { Request as ExpressRequest } from "express";
import { IJob } from "../database/models/job.model";
import jobOpeningService from "../services/jobOpening.service";

@Route("/v1/corporate")
@Tags("corporate")
export class CorporateController extends Controller {
  @SuccessResponse("200", "Success Bro")
  @Post("/job")
  public async postIJob(
    @Request() request: ExpressRequest,
    @Body() body: IJob
  ): Promise<APIResponse<IJob>> {
    try {
      const corporateSub = request.cookies["username"];
      if (!corporateSub) {
        console.log(
          "CorporateController - getCorporateProfileWithJobs() method error : Corporate ID is missing"
        );
        return sendResponse<IJob>({
          message: "Corporate ID is missing",
          data: {} as IJob,
        });
      }
      const getCorporateProfileId = await axios.get(
        `http://localhost:4005/v1/corporate/${corporateSub}`
      );
      const corporateProfileId =
        getCorporateProfileId.data.data.corporateProfileId;

      if (!getCorporateProfileId || !corporateProfileId) {
        console.log(
          "CorporateController - getCorporateProfileWithJobs() method error : Corporate Profile ID is missing"
        );
        return sendResponse<IJob>({
          message: "Corporate Profile ID is missing",
          data: {} as IJob,
        });
      }

      const newJob = await jobOpeningService.createJob(
        corporateProfileId,
        body
      );
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

  @SuccessResponse("200", "Success")
  @Get("/job")
  public async getAllJobs(
    @Request() request: ExpressRequest,
    @Queries() queries: JobGetAllControllerParams
  ): Promise<APIResponse<PaginationResponse<IJob>>> {
    try {
      const userId = request.cookies["user_id"] || null;
      const response = await jobOpeningService.getAllJobs(queries, userId);
      return sendResponse<PaginationResponse<IJob>>({
        message: "success",
        data: response,
      });
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse("200", "Success")
  @Get("/job/{jobId}")
  public async getJobById(@Path() jobId: string) {
    try {
      const getJob = await jobOpeningService.getJobById(jobId);
      if (!getJob) {
        console.log(
          "CorporateController - getJobById() method error : Job not found"
        );
        return sendResponse<IJob>({
          message: "Job not found",
          data: {} as IJob,
        });
      }
      return sendResponse<IJob>({ message: "success", data: getJob });
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse("204", "Updated Successfully")
  @Put("/job/{jobId}")
  public async updateJobById(
    @Path() jobId: string,
    @Body() updateDatJob: JobParams
  ) {
    try {
      const updateJob = await jobOpeningService.updateJobById(
        jobId,
        updateDatJob
      );
      return sendResponse<IJob>({ message: "success", data: updateJob });
    } catch (error) {
      console.error(
        `jobController updateJobById() method error: `,
        prettyObject(error as {})
      );
    }
  }

  @SuccessResponse("200", "Delete Successfully")
  @Delete("/job/{jobId}")
  public async deleteJobById(
    @Path() jobId: string
  ): Promise<{ message: string }> {
    try {
      await jobOpeningService.deleteJobById(jobId);
      return { message: "Job was deleted successfully" };
    } catch (error) {
      console.error(
        `CompanyController deleteJobById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @SuccessResponse("201", "Created")
  @Post("/profile")
  public async createCorporateProfile(
    @Request() request: ExpressRequest,
    @Body() body: ICorporateProfile
  ): Promise<APIResponse<ICorporateProfile>> {
    try {
      const corporateId = request.cookies["user_id"];
      if (!corporateId) {
        throw new Error(
          "CorporateController - createCorporateProfile() method error : Corporate ID is missing"
        );
      }
      const newCompany = await CorporateService.createProfile(body);
      const corporateProfileId = newCompany._id || null;
      if (!corporateProfileId) {
        throw new Error(
          "CorporateController - createCorporateProfile() method error : Corporate Profile ID is missing"
        );
      }
      await axios.put(
        `http://localhost:4005/v1/corporate/profile/${corporateId}`,
        { corporateProfileId },
        {
          headers: { Authorization: "application/json" },
          withCredentials: true,
        }
      );
      return sendResponse<ICorporateProfile>({
        message: "Company was created successfully!",
        data: newCompany,
      });
    } catch (error) {
      console.error(
        `CorporateController - createCorporateProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @SuccessResponse("200", "Success")
  @Get("/profile")
  public async getCorporateProfiles(): Promise<{
    message: string;
    data: ICorporateProfile[];
  }> {
    try {
      const result = await CorporateService.getAllProfiles();
      if (!result) {
        console.log(
          "CorporateController - getCorporateProfiles() method error : No corporate profiles found."
        );
        return { message: "No corporate profiles found.", data: [] };
      }
      return sendResponse<ICorporateProfile[]>({
        message: "success",
        data: result,
      });
    } catch (error) {
      console.error(
        `CorporateController - getCorporateProfiles() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @SuccessResponse("200", "Success")
  @Get("/profile/{corporateId}")
  public async getCorporateProfilesById(@Path() corporateId: string) {
    try {
      const corporateProfile =
        await CorporateService.getProfileById(corporateId);
      if (!corporateProfile) {
        console.log(
          "CorporateController - getCorporateProfilesById() method error : Job not found"
        );
        return sendResponse({
          message: "corporateProfile not found",
          data: [],
        });
      }
      return sendResponse({
        message: "Find corporateProfile successfully",
        data: corporateProfile,
      });
    } catch (error) {
      console.error(
        `CorporateController - getCorporateProfilesById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @SuccessResponse("204", "Updated Successfully")
  @Put("/profile/{corporateId}")
  public async updateCorporateProfile(
    @Path() corporateId: string,
    @Body() updateDataCorporateProfile: ICorporateProfile
  ) {
    try {
      const updateCorporateProfile =
        await CorporateService.updateCorporateProfile(
          corporateId,
          updateDataCorporateProfile
        );
      return sendResponse({ message: "success", data: updateCorporateProfile });
    } catch (error) {
      console.error(
        `CorporateController - updateCorporateProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  @SuccessResponse("200", "Delete Successfully")
  @Delete("/profile/{corporateId}")
  public async deleteCorporateProfile(
    @Path() corporateId: string
  ): Promise<{ message: string }> {
    try {
      await CorporateService.deleteCorporateProfile(corporateId);
      return { message: "Corporate Profile was deleted successfully" };
    } catch (error) {
      console.error(
        `CorporateController - deleteCorporateProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @SuccessResponse("200", "Success")
  @Get()
  public async getCorporateProfileWithJobs(
    @Request() request: ExpressRequest,
    @Query() recentJobsLimit?: number
  ) {
    try {
      const corporateSub = request.cookies["username"];
      const access_token = request.cookies["access_token"];

      if (!corporateSub || !access_token) {
        console.log(
          "CorporateController - getCorporateProfileWithJobs() method error : Authorization is missing"
        );
        return null;
      }

      if (!corporateSub) {
        console.log(
          "CorporateController - getCorporateProfileWithJobs() method error : corporateSub is missing"
        );
        return null;
      }
      const getCorporateProfileId = await axios.get(
        `http://localhost:4005/v1/corporate/${corporateSub}`,
        {
          headers: {
            Authorization: "application/json",
            Cookie: `username=${corporateSub}; access_token=${access_token}`,
          },
          withCredentials: true,
        }
      );
      const corporateProfileId =
        getCorporateProfileId.data.data.corporateProfileId;
      if (!getCorporateProfileId || !corporateProfileId) {
        console.log(
          "CorporateController - getCorporateProfileWithJobs() method error : Corporate Profile ID is missing"
        );
        return null;
      }

      const limit = recentJobsLimit || 2;
      const corporateProfileWithJobs =
        await corporateService.getProfileWithJobs(corporateProfileId, limit);
      if (!corporateProfileWithJobs) {
        console.log("No corporate profile found.");
        return {} as any;
      }
      return sendResponse<ICorporateProfile>({
        message: "success",
        data: corporateProfileWithJobs,
      });
    } catch (error) {
      console.error(
        `CorporateController - getCorporateProfileWithJobs() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
}
