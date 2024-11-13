import { Controller, Get, Post, Path, Route, SuccessResponse, Body, Middlewares, Request, Tags, Put } from "tsoa";
import CorporateService from "@/src/services/corporate.service";
import sendResponse from "@/src/utils/send-response";
import validateRequest from "@/src/middewares/validate-input";
import { prettyObject } from "@sabaicode-dev/camformant-libs";
import { Request as ExpressRequest } from "express";
import axios from "axios";
import { CorporateProfileResponse, CorporateProfileResponseCreate, CorporateProfileResquestParams } from "./types/corporate-controller.type";
import corporateJoiSchema from "../schemas/corporate.schema";

@Tags("Corporate")
@Route("v1/corporate")
export class CorporateController extends Controller {

    @SuccessResponse("201", "Created")
    @Post()
    @Middlewares(validateRequest(corporateJoiSchema))
    public async createCorporate(
        @Body() requestBody: CorporateProfileResquestParams
    ): Promise<CorporateProfileResponseCreate> {
        try {
            // Create New User
            const newCorporate = await CorporateService.createCorporate(requestBody);

            this.setStatus(201); // set return status 201
            return sendResponse({ message: "success", data: newCorporate }) as CorporateProfileResponseCreate;
        } catch (error) {
            console.error(
                `CorporateController - createUser() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    @Get()
    public async getAllCorporates(): Promise<CorporateProfileResponse> {
        try {
            console.log("getAllCorporates called");
            const response = await CorporateService.getAllCorporates();
            return sendResponse({ message: "success", data: response }) as unknown as CorporateProfileResponse;
        } catch (error) {
            console.error(
                `CorporateController - getAllCorporates() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    @Get("/{corporateId}")
    public async getCorporateBySub(
        @Path() corporateId: string
    ): Promise<CorporateProfileResponse> {
        try {
            console.log("getCorporateById called with corporateId: ", corporateId);
            const response = await CorporateService.getCorporateBySub(corporateId);
            return sendResponse({ message: "success", data: response }) as unknown as CorporateProfileResponse;
        } catch (error) {
            console.error(
                `CorporateController - getCorporateById() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    @Put("/profile/{corporateId}")
    public async updateCorporateProfile(
        @Path() corporateId: string,
        @Body() requestBody: { corporateProfileId: string }
    ): Promise<CorporateProfileResponseCreate> {
        try {
            if (!corporateId) {
                console.error("Corporate ID not found in cookies");
                throw new Error("Authentication error: Corporate ID not found in cookies");
            }
            console.log("updateCorporateProfile called with corporateId: ", corporateId);
            const { corporateProfileId } = requestBody;
            const response = await CorporateService.updateCorporateProfile(corporateId, corporateProfileId);
            return sendResponse({ message: "success", data: response }) as unknown as CorporateProfileResponseCreate;
        } catch (error) {
            console.error(
                `CorporateController - updateCorporateProfile() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    @Get("/profile/me")
    public async getCorporateMe(@Request() request: ExpressRequest): Promise<CorporateProfileResponse> {
        try {
            const sub = request.cookies["username"];
            const access_token = request.cookies["access_token"];
            if (!sub) {
                console.error("Username not found in cookies");
                throw new Error("Authentication error: Username not found in cookies");
            }
            const userProfile = await CorporateService.getCorporateBySub(sub);
            if (!userProfile) {
                console.log("CorporateController - getCorporateMe() : User profile not found");
                return sendResponse({
                    message: "Corporate profile fetched successfully",
                    data: {
                        user: {} as any,
                        jobs: []
                    }
                }) as CorporateProfileResponse;;
            }
            const companyJobs = await axios.get(
                `http://localhost:4003/v1/corporate/${userProfile.corporateProfileId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`, Cookie: `username=${sub}; access_token=${access_token}`
                    },
                    withCredentials: true
                }
            );
            if (!companyJobs.data) {
                console.log("CorporateController - getCorporateMe() : Company jobs not found");
                return sendResponse({
                    message: "Corporate profile fetched successfully",
                    data: {
                        user: userProfile,
                        jobs: []
                    }
                }) as CorporateProfileResponse;
            }
            return sendResponse({
                message: "Corporate profile fetched successfully",
                data: {
                    user: userProfile,
                    jobs: companyJobs.data
                }
            }) as CorporateProfileResponse;
        } catch (error) {
            console.error("CorporateController - getCorporateMe() error:", error);
            throw error;
        }
    }

}
