import sendResponse from "@/src/utils/send-response";
import { APIResponse, prettyObject } from "@sabaicode-dev/camformant-libs";
import { Controller, Get, Post, Route, SuccessResponse, Tags, Body, Query, Request } from "tsoa";
import CorporateService from "../services/corporate.service";
import jobOpeningService from "../services/jobOpening.service";
import corporateService from "../services/corporate.service";
import { ICorporateProfile } from "../database/models/corporateProfile.model";
import { JobOpening } from "../database/models/jobOpening.model";
import axios from "axios";
import { Request as ExpressRequest } from "express";
import { JobOpeningRequest } from "./types/corporate-controller.types";



@Route("/v1/corporate")
@Tags("corporate")
export class CorporateController extends Controller {
    /**
    * Creates a new Corporate Profile
    * @param requestBody Corporate profile information
    * @returns Newly created corporate profile
    */
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
            const corporateProfileId = newCompany._id;
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

    /**
     * Get all Corporate Profiles
     * @returns A list of Corporate Profiles
     */
    @Get("/profile")
    public async getCorporateProfiles(): Promise<{ message: string; data: ICorporateProfile[]; }> {
        try {
            const result = await CorporateService.getAllProfiles();
            if (!result) {
                throw new Error("CorporateController - getCorporateProfiles() method error : No corporate profiles found.");
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

    /**
     * Post a new job opening
     * @param companyId Corporate Profile ID
     * @param requestBody Job opening information
     */
    @SuccessResponse("201", "Created")
    @Post("/job")
    public async postJobOpening(
        @Request() request: ExpressRequest,
        @Body() body: JobOpeningRequest
    ): Promise<any> {
        try {
            const corporateSub = request.cookies["username"];
            if (!corporateSub) {
                console.log("CorporateController - getCorporateProfileWithJobs() method error : Corporate ID is missing");
                return null;
            }
            const getCorporateProfileId = await axios.get(`http://localhost:4005/v1/corporate/${corporateSub}`,);
            const corporateProfileId = getCorporateProfileId.data.data.corporateProfileId;

            if (!getCorporateProfileId || !corporateProfileId) {
                console.log("CorporateController - getCorporateProfileWithJobs() method error : Corporate Profile ID is missing");
                return null;
            }

            const newJob = await jobOpeningService.createJob(corporateProfileId, body);
            if (!newJob) {
                console.log("CorporateController - postJobOpening() method error : Job creation failed.");
                return {} as any;
            }
            return sendResponse<JobOpening>({
                message: "Job was created successfully!",
                data: newJob,
            });
        } catch (error) {
            console.error(
                `CorporateController - postJobOpening() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    /**
     * Get Corporate Profile with Jobs
     * @param companyId Corporate Profile ID
     * @returns Corporate Profile with Jobs
     */
    @Get('{companyId}')
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


