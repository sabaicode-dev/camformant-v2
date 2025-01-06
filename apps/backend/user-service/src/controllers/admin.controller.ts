import { prettyObject } from "@sabaicode-dev/camformant-libs";
import {
  Controller,
  Get,
  Path,
  Route,
  SuccessResponse,
  Tags,
  Request,
} from "tsoa";
import { Request as ExpressRequest } from "express";
import sendResponse from "@/src/utils/send-response";
import AdminService from "@/src/services/admin.service";
import { AdminProfileParams } from "@/src/database/models/admin.model";
@Tags("Admin")
@Route("v1/admin")
export class AdminController extends Controller {
  @SuccessResponse("200", "Success")
  @Get("/profile/{adminSub}")
  public async getAdminProfilesBySub(@Path() adminSub: string) {
    try {
      const adminProfile = await AdminService.getProfileBySub(adminSub);
      return sendResponse<AdminProfileParams>({
        message: "Find AdminProfile successfully",
        data: adminProfile,
      });
    } catch (error) {
      console.error(
        `AdminController - getAdminProfilesById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  @Get("/me")
  public async getMe(@Request() request: ExpressRequest) {
    try {
      const sub = request.cookies["username"];

      const response = await AdminService.getProfileBySub(sub);

      return response;
    } catch (error) {
      console.error(
        `UsersController - getUserProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
}
