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
} from "tsoa";
import UserService from "@/src/services/user.service";
import sendResponse from "@/src/utils/send-response";
import validateRequest from "@/src/middewares/validate-input";
import userJoiSchema from "@/src/schemas/user.schema";
import {
  UsersPaginatedResponse,
  prettyObject,
  // UserCreationRequestParams,
  UserProfileResponse,
  UserUpdateRequestParams,
  IUser,
  AuthenticationError,
} from "@sabaicode-dev/camformant-libs";
import { UserGetAllControllerParams } from "@/src/controllers/types/user-controller.type";
import { Request as ExpressRequest } from "express";
import agenda from "@/src/utils/agenda";
import { SCHEDULE_JOBS } from "@/src/jobs";
import { uploadToS3 } from "@/src/utils/s3";
import {
  IUserProfile,
  IUserProfileResposne,
  UnionProfileType,
} from "@/src/controllers/types/userprofile.type";
import {
  CustomCvResponse,
  CvFileParams,
  CvFilePResponse,
  CvStyleParams,
  UnionCustomCvResponse,
} from "@/src/controllers/types/user-cv-controller.type";
import { error } from "console";
import { Types } from "mongoose";
export interface UserCreationRequestParams2 {
  sub?: string;
  googleSub?: string;
  facebookSub?: string;
  username: string;
  email?: string;
  phone_number?: string;
  profile?: string;
  role?: string;
  gender?: string;
  age?: number;
  favorites?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  lastActive?: Date;
  lastSeen?: Date;
  sessions?: {
    deviceId: string;
    ipAddress: string;
    lastLogin: Date;
  }[];
  privacySettings?: {
    lastSeenVisibleTo: "everyone" | "contacts" | "nobody";
    profilePhotoVisibleTo: "everyone" | "contacts" | "nobody";
  };
  contacts?: Types.ObjectId[];
}

@Route("v1/users")
export class UsersController extends Controller {
  @Get()
  public async getAllUsers(
    @Queries() queries: UserGetAllControllerParams
  ): Promise<UsersPaginatedResponse> {
    try {
      const response = await UserService.getAllUsers(queries);

      return sendResponse({ message: "success", data: response });
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
  public async createUser(
    @Body() requestBody: UserCreationRequestParams2
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

      this.setStatus(201); // set return status 201
      return sendResponse<IUser>({ message: "success", data: response });
    } catch (error) {
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
      // console.log("hi======", sub);

      const response = await UserService.getUserBySub(sub);

      return sendResponse<IUser>({ message: "success", data: response });
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
  //for cv generate
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
  ): Promise<IUserProfileResposne> {
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
    } catch (err) {
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
        data: response,
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
        data: response,
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

      return sendResponse<IUser>({ message: "success", data: response });
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

      return sendResponse<IUser>({ message: "success", data: response });
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
    // @UploadedFile() file: Express.Multer.File,
    @Request() request: ExpressRequest
  ): Promise<string | undefined> {
    try {
      const userId = request.cookies["user_id"];
      const file = await UserService.handleFile(request);
      const response: string = await uploadToS3(file, `user-service/${userId}`);
      return response;
    } catch (error) {
      if ((error as { message: string }).message === "Reach Limit File") {
        throw new Error((error as { message: string }).message);
      }
      throw error;
    }
  }

  //cv endpoint

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
