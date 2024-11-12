import sendResponse from "@/src/utils/send-response";
import { APIResponse } from "@sabaicode-dev/camformant-libs";
import {
    Controller,
    Get,
    Post,
    Route,
    SuccessResponse,
    Tags,
    Body,
    Path,
    Query,
    Request,
} from "tsoa";
import CorporateService from "../services/corporate.service";
import jobOpeningService from "../services/jobOpening.service";
import corporateService from "../services/corporate.service";
import { ICorporateProfile } from "../database/models/corporateProfile.model";
import { JobOpening } from "../database/models/jobOpening.model";
import axios from "axios";
import { Request as ExpressRequest } from "express";

interface JobOpeningRequest {
    title: string;
    description: string;
    requirements: string;
    location: {
        city: string;
        country: string;
    };
}


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
            console.log("Request user id :::::::::::::::", corporateId);
            if (!corporateId) {
                throw new Error("Job:: User ID is missing")
            }

            console.log("Request user id :::::::::::::::", corporateId);
            const newCompany = await CorporateService.createProfile(body);
            console.log("CorporateJobController() createCorporateProfile:::::::::::", newCompany._id);

            const corporateProfileId = newCompany._id;

            if (!corporateProfileId) {
                throw new Error("Corporate Profile ID is missing")
            }

            await axios.put(`http://localhost:4005/v1/corporate/profile/${corporateId}`, { corporateProfileId }, { headers: { "Authorization": "application/json" }, withCredentials: true });

            return sendResponse<ICorporateProfile>({
                message: "Company was created successfully!",
                data: newCompany,
            });
        } catch (error) {
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
            return sendResponse<ICorporateProfile[]>({ message: "success", data: result });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Post a new job opening
     * @param companyId Corporate Profile ID
     * @param requestBody Job opening information
     */
    @SuccessResponse("201", "Created")
    @Post("/{companyId}/job")
    public async postJobOpening(
        companyId: string,
        @Body() body: JobOpeningRequest
    ): Promise<any> {
        try {
            const newJob = await jobOpeningService.createJob(companyId, body);

            return sendResponse<JobOpening>({
                message: "Job was created successfully!",
                data: newJob,
            });
        } catch (error) {
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
        @Path() companyId: string,
        @Query() recentJobsLimit?: number
    ) {
        const limit = recentJobsLimit || 2;
        return corporateService.getProfileWithJobs(companyId, limit);
    }

}


