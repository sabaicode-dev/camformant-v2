import { IUser } from "@/src/controllers/types/user.controller.type";
import { UserGetAllRepoResponse } from "@/src/database/repositories/types/user-repository.type";

export interface UserGetAllServiceResponse {
  message: string;
  data: UserGetAllRepoResponse;
}
export interface CreateNewUserServiceResponse {
  message: string;
  data: IUser;
}
