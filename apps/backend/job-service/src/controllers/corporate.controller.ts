import axios from "axios";
import { Controller, Get, Post, Route, SuccessResponse, Tags, Body, Query, Request, Queries } from "tsoa";
import { APIResponse, PaginationResponse, prettyObject } from "@sabaicode-dev/camformant-libs";
import { JobGetAllControllerParams } from "./types/job-controller.type";
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

    @SuccessResponse("201", "Created")
    @Post("/job")
    public async postIJob(
        @Request() request: ExpressRequest,
        @Body() body: IJob
    ): Promise<APIResponse<IJob>> {
        try {
            const corporateSub = request.cookies["username"];
            if (!corporateSub) {
                console.log("CorporateController - getCorporateProfileWithJobs() method error : Corporate ID is missing");
                return sendResponse<IJob>({
                    message: "Corporate ID is missing",
                    data: {} as IJob,
                });
            }
            const getCorporateProfileId = await axios.get(`http://localhost:4005/v1/corporate/${corporateSub}`,);
            const corporateProfileId = getCorporateProfileId.data.data.corporateProfileId;

            if (!getCorporateProfileId || !corporateProfileId) {
                console.log("CorporateController - getCorporateProfileWithJobs() method error : Corporate Profile ID is missing");
                return sendResponse<IJob>({
                    message: "Corporate Profile ID is missing",
                    data: {} as IJob,
                });
            }

            const newJob = await jobOpeningService.createJob(corporateProfileId, body);
            if (!newJob) {
                console.log("CorporateController - postIJob() method error : Job creation failed.");
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

    @SuccessResponse("201", "Created")
    @Post("/profile")
    public async createCorporateProfile(
        @Request() request: ExpressRequest,
        @Body() body: ICorporateProfile
    ): Promise<APIResponse<ICorporateProfile>> {
        try {
            const corporateId = request.cookies["user_id"];
            if (!corporateId) {
                throw new Error("CorporateController - createCorporateProfile() method error : Corporate ID is missing")
            }
            const newCompany = await CorporateService.createProfile(body);
            const corporateProfileId = newCompany._id || null;
            if (!corporateProfileId) {
                throw new Error("CorporateController - createCorporateProfile() method error : Corporate Profile ID is missing")
            }
            await axios.put(`http://localhost:4005/v1/corporate/profile/${corporateId}`,
                { corporateProfileId },
                {
                    headers: { "Authorization": "application/json" },
                    withCredentials: true
                });
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

    @Get("/profile")
    public async getCorporateProfiles(): Promise<{ message: string; data: ICorporateProfile[]; }> {
        try {
            const result = await CorporateService.getAllProfiles();
            if (!result) {
                console.log("CorporateController - getCorporateProfiles() method error : No corporate profiles found.");
                return { message: "No corporate profiles found.", data: [] }
            }
            return sendResponse<ICorporateProfile[]>({ message: "success", data: result });
        } catch (error) {
            console.error(
                `CorporateController - getCorporateProfiles() method error: `,
                prettyObject(error as {})
            );
            throw error;
        } 3
    }

    @Get()
    public async getCorporateProfileWithJobs(
        @Request() request: ExpressRequest,
        @Query() recentJobsLimit?: number
    ) {
        try {
            const corporateSub = request.cookies["username"];
            const access_token = request.cookies["access_token"];

            if (!corporateSub || !access_token) {
                console.log("CorporateController - getCorporateProfileWithJobs() method error : Authorization is missing");
                return null;
            }

            if (!corporateSub) {
                console.log("CorporateController - getCorporateProfileWithJobs() method error : corporateSub is missing");
                return null;
            }
            const getCorporateProfileId = await axios.get(`http://localhost:4005/v1/corporate/${corporateSub}`,
                {
                    headers: { Authorization: "application/json", Cookie: `username=${corporateSub}; access_token=${access_token}` },
                    withCredentials: true
                });
            const corporateProfileId = getCorporateProfileId.data.data.corporateProfileId;
            if (!getCorporateProfileId || !corporateProfileId) {
                console.log("CorporateController - getCorporateProfileWithJobs() method error : Corporate Profile ID is missing");
                return null;
            }

            const limit = recentJobsLimit || 2;
            const corporateProfileWithJobs = await corporateService.getProfileWithJobs(corporateProfileId, limit);
            if (!corporateProfileWithJobs) {
                console.log("No corporate profile found.");
                return {} as any;
            }
            return sendResponse<ICorporateProfile>({
                message: "success", data: corporateProfileWithJobs
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


