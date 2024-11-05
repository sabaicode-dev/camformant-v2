import {
  Controller,
  Get,
  Post,
  Path,
  Route,
  SuccessResponse,
  Body,
  Put,
  Delete,
  Queries,
  Query,
  Middlewares,
  Request,
  UploadedFile,
} from "tsoa";
import UserService from "@/src/services/user.service";
import sendResponse from "@/src/utils/send-response";
import validateRequest from "@/src/middewares/validate-input";
import userJoiSchema from "@/src/schemas/user.schema";
import {
  UsersPaginatedResponse,
  prettyObject,
  UserCreationRequestParams,
  UserProfileResponse,
  UserUpdateRequestParams,
  IUser,
} from "@sabaicode-dev/camformant-libs";
import { UserGetAllControllerParams } from "@/src/controllers/types/user-controller.type";
import { Request as ExpressRequest } from "express";
import agenda from "@/src/utils/agenda";
import { SCHEDULE_JOBS } from "@/src/jobs";
import { uploadToS3 } from "../utils/s3";
import {
  IUserProfile,
  UnionProfileType,
} from "@/src/controllers/types/userprofile.type";
import {
  CvStyleParams,
} from "@/src/controllers/types/user-cv-controller.type";
// import { unionProfileType } from "./types/userprofile.type";

@Route("v1/users")
export class UsersController extends Controller {
  @Get()
  public async getAllUsers(
    @Queries() queries: UserGetAllControllerParams
  ): Promise<UsersPaginatedResponse> {
    try {
      const response = await UserService.getAllUsers(queries);

      return sendResponse({ message: "success", data: response });
      return sendResponse({ message: "success", data: response });
    } catch (error) {
      console.error(
        `UsersController - createUser() method error: `,
        prettyObject(error as {})
      );
      console.error(
        `UsersController - createUser() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Middlewares(validateRequest(userJoiSchema))
  public async createUser(
    @Body() requestBody: UserCreationRequestParams
  ): Promise<UserProfileResponse> {
    try {
      // Create New User
      const response = await UserService.createNewUser(requestBody);

      // Schedule Notification Job 1 Minute Later
      await agenda.schedule(
        "in 1 minutes",
        SCHEDULE_JOBS.NOTIFICATION_NEW_REGISTRATION,
        { userId: response._id }
      );
      await agenda.schedule(
        "in 1 minutes",
        SCHEDULE_JOBS.NOTIFICATION_NEW_REGISTRATION,
        { userId: response._id }
      );

      this.setStatus(201); // set return status 201
      return sendResponse<IUser>({ message: "success", data: response });
    } catch (error) {
      console.error(
        `UsersController - createUser() method error: `,
        prettyObject(error as {})
      );
      console.error(
        `UsersController - createUser() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @Get("/me")
  public async getMe(
    @Request() request: ExpressRequest
  ): Promise<UserProfileResponse> {
    try {
      const sub = request.cookies["username"];
      const response = await UserService.getUserBySub(sub);

      return sendResponse<IUser>({ message: "success", data: response });
    } catch (error) {
      console.error(
        `UsersController - getUserProfile() method error: `,
        prettyObject(error as {})
      );
      console.error(
        `UsersController - getUserProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  @Put("/me/photo")
  public async changePhoto(
    @Request() request: ExpressRequest,
    @Body() bodyData: { photo: string }
  ): Promise<UserProfileResponse> {
    try {
      const photo: string = bodyData.photo;
      const userId = request.cookies["user_id"];
      const response = await UserService.changeProfilePic(photo, userId);
      return sendResponse<IUser>({
        message: "Image is updated successfully",
        data: response,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post("/me/favorites")
  public async addFavorite(
    @Request() request: ExpressRequest,
    @Body() body: { jobId: string }
  ): Promise<UserProfileResponse> {
    try {
      const userId = request.cookies["user_id"];
      const { jobId } = body;

      const response = await UserService.addFavorite(userId, jobId);

      return sendResponse<IUser>({
        message: "Favorite added successfully",
        data: response,
      });
    } catch (error) {
      console.error(
        `UsersController - addFavorite() method error: `,
        prettyObject(error as {})
      );
      console.error(
        `UsersController - addFavorite() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @Get("/me/favorites")
  public async getFavorites(
    @Request() request: ExpressRequest
  ): Promise<{ message: string; data: string[] }> {
    try {
      const userId = request.cookies["user_id"];

      const favorites = await UserService.getUserFavorites(userId);

      return sendResponse<string[]>({ message: "success", data: favorites });
    } catch (error) {
      console.error(
        `UsersController - getFavorites() method error: `,
        prettyObject(error as {})
      );
      console.error(
        `UsersController - getFavorites() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  @Delete("/me/favorites/{jobId}")
  public async removeFavorite(
    @Request() request: ExpressRequest,
    @Path() jobId: string
  ): Promise<UserProfileResponse> {
    try {
      const userId = request.cookies["user_id"];

      const response = await UserService.removeFavorite(userId, jobId);

      return sendResponse<IUser>({
        message: "Favorite removed successfully",
        data: response,
      });
      return sendResponse<IUser>({
        message: "Favorite removed successfully",
        data: response,
      });
    } catch (error) {
      console.error(
        `UsersController - removeFavorite() method error: `,
        prettyObject(error as {})
      );
      console.error(
        `UsersController - removeFavorite() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @Get("/{userId}")
  public async getUserProfile(
    @Path() userId: string
  ): Promise<UserProfileResponse> {
    try {
      console.log("userId: ", userId);
      console.log("userId: ", userId);
      const response = await UserService.getUserBySub(userId);

      return sendResponse<IUser>({ message: "success", data: response });
    } catch (error) {
      console.error(
        `UsersController - getUserProfile() method error: `,
        prettyObject(error as {})
      );
      console.error(
        `UsersController - getUserProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @Put("/{userId}")
  public async updateUserById(
    @Path() userId: string,
    @Body() updateUserInfo: UserUpdateRequestParams
  ): Promise<UserProfileResponse> {
    try {
      const newUpdateUserInfo = { id: userId, ...updateUserInfo };
      const response = await UserService.updateUserBySub(newUpdateUserInfo);

      return sendResponse<IUser>({ message: "success", data: response });
    } catch (error) {
      console.error(
        `UsersController - createUser() method error: `,
        prettyObject(error as {})
      );
      console.error(
        `UsersController - createUser() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @SuccessResponse("204", "Delete Successful")
  @Delete("{userId}")
  public async deleteUserById(@Path() userId: string): Promise<void> {
    try {
      await UserService.deleteUserById(userId);
    } catch (error) {
      console.error(
        `UsersController - createUser() method error: `,
        prettyObject(error as {})
      );
      console.error(
        `UsersController - createUser() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @Get("/profile-detail/:userId")
  public async getProfileByID(
    @Path() userId: string,
    @Query() category?: string
  ) {
    try {
      const userProfile = await UserService.getProfileById(userId, category);
      return sendResponse<IUserProfile>({
        message: "success",
        data: userProfile,
      });
    } catch (err) {
      throw err;
    }
  }
  @Put("/profile-detail/:userId")
  public async updateUserProfile(
    @Path() userId: string,
    @Body() updateBody: IUserProfile
  ) {
    try {
      const userData = await UserService.updateUserProfile(userId, updateBody);

      return sendResponse<UnionProfileType>({
        message: "Data is updated successfully",
        data: userData,
      });
    } catch (err) {
      throw err;
    }
  }
  @Post("/uploadFile")
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: ExpressRequest
  ): Promise<string> {
    try {
      const userId = request.cookies["user_id"];
      const response: string = await uploadToS3(file, `user-service/${userId}`);
      return response;
    } catch (err) {
      throw err;
    }
  }

  //cv endpoint
  @Get("/cv")
  public async getCvFiles(@Request() request: ExpressRequest): Promise<any> {
    try {
      const userId: string = request.cookies["user_id"];
      const data = await UserService.getCvFiles(userId);
      return sendResponse<any>({
        message: "Fetch is successful",
        data,
      });
    } catch (err) {
      throw err;
    }
  }
  @Post("/cv")
  public async updateCvFiles(
    @Request() request: ExpressRequest,
    @Body() bodyData: { url: string }
  ) {
    try {
      const userId = request.cookies["user_id"];
      if (!bodyData.url) throw new Error("Invalid URL format");
      const data = await UserService.insertCvFile(userId, bodyData.url);
      return sendResponse<any>({
        message: "Insert is successful",
        data,
      });
    } catch (err) {
      throw err;
    }
  }
  @Delete("/cv/:cvId")
  public async deleteCvFile(
    @Request() request: ExpressRequest,
    @Path() cvId: string
  ) {
    try {
      const userId = request.cookies["user_id"];
      const data = await UserService.deleteCvFile(userId, cvId);
      if (!data) {
        throw new Error("CV file not found or could not be deleted.");
      }
      return sendResponse<any>({
        message: "Delete is successful",
        data,
      });
    } catch (err) {
      throw err;
    }
  }

  //for cv generate
  @Get("/cvstyle/:style")
  public async getCVStyle(@Path() style: string) {
    try {
      const data = await UserService.getCvStyle(style);
      return sendResponse<CvStyleParams>({
        message: "CV Style is fetched successfully",
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }
}
