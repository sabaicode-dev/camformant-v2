import {
  Controller,
  Post,
  Route,
  SuccessResponse,
  Body,
  Request,
  Tags,
  Get,
  Path,
  Put,
  Delete,
  Queries,
} from "tsoa";
import CorporateService from "@/src/services/corporate.service";
import sendResponse from "@/src/utils/send-response";
import { APIResponse, prettyObject } from "@sabaicode-dev/camformant-libs";
import { Request as ExpressRequest } from "express";
import axios from "axios";

import { ICorporatorProfile } from "../database/models/corporate.model";

@Tags("Corporate")
@Route("v1/corporator")
export class CorporateController extends Controller {
  //todo: get multi company for jobs
  @Get("/companies")
  public async getMultiCompanies(@Queries() query: { companiesId?: string }) {
    try {
      const res = await CorporateService.getMultiCompanies(query.companiesId!);
      return res;
    } catch (error) {
      throw error;
    }
  }
  @Get("/getMulti/Profile")
  public async getMultiProfileCompany(
    @Queries() query: { companiesId?: string }
  ) {
    try {
      console.log("jeab hz");

      const res = await CorporateService.getMultiProfileCompany(
        query.companiesId!
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
  @SuccessResponse("201", "Created")
  @Post("/profile")
  public async createCorporateProfile(
    @Request() request: ExpressRequest,
    @Body() body: ICorporatorProfile
  ): Promise<APIResponse<ICorporatorProfile>> {
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
      return sendResponse<ICorporatorProfile>({
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
    data: ICorporatorProfile[];
  }> {
    try {
      const result = await CorporateService.getAllProfiles();
      if (!result) {
        console.log(
          "CorporateController - getCorporateProfiles() method error : No corporate profiles found."
        );
        return { message: "No corporate profiles found.", data: [] };
      }
      return sendResponse<ICorporatorProfile[]>({
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
    @Body() updateDataCorporateProfile: ICorporatorProfile
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
  //todo: later
  // @SuccessResponse("200", "Success")
  // @Get()
  // public async getCorporateProfileWithJobs(
  //   @Request() request: ExpressRequest,
  //   @Query() recentJobsLimit?: number
  // ) {
  //   try {
  //     const corporateSub = request.cookies["username"];
  //     const access_token = request.cookies["access_token"];

  //     if (!corporateSub || !access_token) {
  //       console.log(
  //         "CorporateController - getCorporateProfileWithJobs() method error : Authorization is missing"
  //       );
  //       return null;
  //     }

  //     if (!corporateSub) {
  //       console.log(
  //         "CorporateController - getCorporateProfileWithJobs() method error : corporateSub is missing"
  //       );
  //       return null;
  //     }
  //     const getCorporateProfileId = await axios.get(
  //       `http://localhost:4005/v1/corporate/${corporateSub}`,
  //       {
  //         headers: {
  //           Authorization: "application/json",
  //           Cookie: `username=${corporateSub}; access_token=${access_token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     const corporateProfileId =
  //       getCorporateProfileId.data.data.corporateProfileId;
  //     if (!getCorporateProfileId || !corporateProfileId) {
  //       console.log(
  //         "CorporateController - getCorporateProfileWithJobs() method error : Corporate Profile ID is missing"
  //       );
  //       return null;
  //     }

  //     const limit = recentJobsLimit || 2;
  //     const corporateProfileWithJobs =
  //       await CorporateService.getProfileWithJobs(corporateProfileId, limit);
  //     if (!corporateProfileWithJobs) {
  //       console.log("No corporate profile found.");
  //       return {} as any;
  //     }
  //     return sendResponse<ICorporatorProfile>({
  //       message: "success",
  //       data: corporateProfileWithJobs,
  //     });
  //   } catch (error) {
  //     console.error(
  //       `CorporateController - getCorporateProfileWithJobs() method error: `,
  //       prettyObject(error as {})
  //     );
  //     throw error;
  //   }
  // }
}
