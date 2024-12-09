import {
  Controller,
  Get,
  Route,
  Queries,
  SuccessResponse,
  Post,
  Middlewares,
  Body,
  Request,
  Path,
  Query,
  Put,
  Delete,
  UploadedFiles,
} from "tsoa";
import UserService from "@/src/services/user.service";
import {
  AuthenticationError,
  prettyObject,
} from "@sabaicode-dev/camformant-libs";
import { Request as ExpressRequest } from "express";

import {
  IUser,
  UserCreationRequestParams,
  UserGetAllControllerParams,
  UserProfileResponse,
  UserUpdateRequestParams,
} from "./types/user.controller.type";
import validateRequest from "../middewares/validate-input";
import userJoiSchema from "../schemas/user.schema";
import {
  CustomCvResponse,
  CvFileParams,
  CvFilePResponse,
  CvStyleParams,
  UnionCustomCvResponse,
} from "./types/user-cv-controller.type";
import sendResponse from "../utils/send-response";
import {
  IUserProfile,
  IUserProfileRespone,
  UnionProfileType,
} from "./types/userprofile.type";
import { uploadToS3 } from "../utils/s3";

@Route("v1/users")
export class UsersController extends Controller {
  @Get()
  public async getAllUsers(@Queries() queries: UserGetAllControllerParams) {
    try {
      const response = await UserService.getAllUsers(queries);

      return response;
    } catch (error) {
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
  public async createUser(@Body() requestBody: UserCreationRequestParams) {
    try {
      // Create New User
      const response = await UserService.createNewUser(requestBody);

      // Schedule Notification Job 1 Minute Later
      // await agenda.schedule(
      //   "in 1 minutes",
      //   SCHEDULE_JOBS.NOTIFICATION_NEW_REGISTRATION,
      //   { userId: response._id }
      // );

      this.setStatus(201);
      return response;
    } catch (error) {
      console.error(
        `UsersController - createUser() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  @Get("/me")
  public async getMe(@Request() request: ExpressRequest) {
    try {
      const sub = request.cookies["username"];

      const response = await UserService.getUserBySub(sub);

      return response;
    } catch (error) {
      console.error(
        `UsersController - getUserProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  @Get("/cv")
  public async getCvFiles(
    @Request() request: ExpressRequest
  ): Promise<CvFilePResponse> {
    try {
      console.log("inside get cv controller");
      const userId = request.cookies["user_id"];
      const data = await UserService.getCvFiles(userId);
      return sendResponse<CvFileParams>({
        message: "Fetch is successful",
        data: data as CvFileParams,
      });
    } catch (err) {
      throw err;
    }
  }
  // //for cv generate
  @Get("/cvstyle")
  public async getCVStyle(): Promise<{
    message: string;
    data: CvStyleParams[];
  }> {
    try {
      const data = await UserService.getCvStyle();
      return sendResponse<CvStyleParams[]>({
        message: "CV Style is fetched successfully",
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  @Get("/profile-detail/:userId")
  public async getProfileByID(
    @Path() userId: string,
    @Query() category?: string
  ): Promise<IUserProfileRespone> {
    try {
      const userProfile = await UserService.getUserProfileById(
        userId,
        category
      );
      return sendResponse<IUserProfile>({
        message: "success",
        data: userProfile,
      });
    } catch (err) {
      throw err;
    }
  }
  @Put("/profile-detail")
  public async updateUserProfile(
    @Body() updateBody: IUserProfile,
    @Request() request: ExpressRequest,
    @Query() query?: string
  ) {
    try {
      const userId = request.cookies["user_id"];
      const userData = await UserService.updateUserProfile(
        userId,
        updateBody,
        query
      );

      return sendResponse<UnionProfileType>({
        message: "Data is updated successfully",
        data: userData,
      });
    } catch (error) {
      throw error;
    }
  }
  @Get("/customCv")
  public async getCustomCv(@Request() request: ExpressRequest) {
    try {
      const userId = request.cookies["user_id"];
      if (userId) {
        const data = await UserService.getCustomCvByUserId(userId);
        return sendResponse<CustomCvResponse | null | undefined>({
          message: "Fetch is successful",
          data,
        });
      }
      throw new AuthenticationError("Please login");
    } catch (err) {
      throw err;
    }
  }
  @Put("/customCv")
  public async updateCustomCv(
    @Request() request: ExpressRequest,
    @Body() bodyData: { style: string; json: any }
  ) {
    const userId = request.cookies["user_id"];
    try {
      if (userId) {
        const data = await UserService.updateCustomCvByUserId(userId, bodyData);
        return sendResponse<UnionCustomCvResponse>({
          message: "Update is successful",
          data,
        });
      }
    } catch (err) {
      throw err;
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
        data: response as unknown as IUser,
      });
    } catch (error) {
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
        data: response as unknown as IUser,
      });
    } catch (error) {
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
      const response = await UserService.getUserBySub(userId);

      return sendResponse<IUser>({
        message: "success",
        data: response as unknown as IUser,
      });
    } catch (error) {
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
      const newUpdateUserInfo = { _id: userId, ...updateUserInfo };
      const response = await UserService.updateUserBySub(newUpdateUserInfo);

      return sendResponse<IUser>({
        message: "success",
        data: response as unknown as IUser,
      });
    } catch (error) {
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
      throw error;
    }
  }
  @Get("/getMulti/Profile")
  public async getMultiProfileUser(@Queries() query: { usersId?: string }) {
    try {
      const res = await UserService.getMultiProfileUser(query.usersId!);
      return res;
    } catch (error) {
      throw error;
    }
  }
  //
  @Post("/uploadFile")
  public async uploadFile(
    @UploadedFiles() file: Express.Multer.File,
    @Request() request: ExpressRequest
  ): Promise<string | undefined> {
    try {
      const userId = request.cookies["user_id"];
      const response: string = await uploadToS3(file, `user-service/${userId}`);
      return response;
    } catch (error) {
      if ((error as { code: string }).code == "LIMIT_FILE_SIZE") {
        console.log("multer error");
        throw new Error((error as { message: string }).message);
      }
      throw error;
    }
  }

  // //cv endpoint

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
}
