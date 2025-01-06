import {
  Controller,
  Post,
  Route,
  SuccessResponse,
  Body,
  Tags,
  Get,
  Path,
  Put,
  Delete,
  Queries,
  Request,
} from "tsoa";
import CorporateService from "@/src/services/corporate.service";
import sendResponse from "@/src/utils/send-response";
import { APIResponse, prettyObject } from "@sabaicode-dev/camformant-libs";
import { Request as ExpressRequest } from "express";
import { AllJobRes, ICorporatorProfile, ProfileQueries } from "./types/corporate-controller.type";
@Tags("Corporator")
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
  @SuccessResponse("200", "Success")
  @Get("/profile/me")
  public async getCorporateProfileWithJobs(@Request() request: ExpressRequest) {
    try {
      const corporateSub = request.cookies["username"];
      if (!corporateSub) {
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

      const corporateProfileWithJobs =
        await CorporateService.getProfileBySub(corporateSub);
      if (!corporateProfileWithJobs) {
        console.log("No corporate profile found.");
        return [];
      }
      return sendResponse<ICorporatorProfile>({
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
  @Get("/getMulti/Profile")
  public async getMultiProfileCompany(
    @Queries() query: { companiesId?: string }
  ) {
    try {
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
    @Body() body: ICorporatorProfile
  ): Promise<APIResponse<ICorporatorProfile>> {
    try {
      const newCompany = await CorporateService.createProfile(body);

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
  public async getCorporateProfiles(
    @Queries() queries:ProfileQueries
  ): Promise<{
    message: string;
    data: AllJobRes|{};
  }> {
    try {
      const result = await CorporateService.getAllProfiles(queries);
      if (!result) {
        console.log(
          "CorporateController - getCorporateProfiles() method error : No corporate profiles found."
        );
        return { message: "No corporate profiles found.", data: [] };
      }
      return sendResponse<AllJobRes|{}>({
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
  @Get("/profile/{corporateSub}")
  public async getCorporateProfilesBySub(@Path() corporateSub: string) {
    try {
      const corporateProfile =
        await CorporateService.getProfileBySub(corporateSub);
      if (!corporateProfile) {
        console.log(
          "CorporateController - getCorporateProfilesById() method error : CorporateProfile not found"
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
  @Delete("/profile/{corporateSub}")
  public async deleteCorporateProfile(
    @Path() corporateSub: string
  ): Promise<{ message: string }> {
    try {
      await CorporateService.deleteCorporateProfile(corporateSub);
      return { message: "Corporate Profile was deleted successfully" };
    } catch (error) {
      console.error(
        `CorporateController - deleteCorporateProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
}
