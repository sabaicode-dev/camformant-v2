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
} from "tsoa";
import CorporateService from "../services/corporate.service";
import jobOpeningService from "../services/jobOpening.service";
import corporateService from "../services/corporate.service";
import { ICorporateProfile } from "../database/models/corporateProfile.model";

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
        @Body() body: ICorporateProfile
    ): Promise<APIResponse<ICorporateProfile>> {
        try {
            const newCompany = await CorporateService.createProfile(body);

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
    ) {
        try {
            const newJob = await jobOpeningService.createJob(companyId, body);

            return sendResponse<ICorporateProfile>({
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


