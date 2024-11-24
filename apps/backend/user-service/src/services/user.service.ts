import { UserGetAllControllerParams } from "@/src/controllers/types/user-controller.type";
import { IUser } from "@/src/database/models/user.model";
import {
  UserCreationRepoParams,
  UserUpdateRepoParams,
} from "@/src/database/repositories/types/user-repository.type";
import UserRepository from "@/src/database/repositories/user.repository";
import { prettyObject } from "@sabaicode-dev/camformant-libs";
import {
  CustomCvResponse,
  CvFileParams,
  CvStyleParams,
  UnionCustomCvResponse,
} from "@/src/controllers/types/user-cv-controller.type";
import {
  IUserProfile,
  UnionProfileType,
} from "@/src/controllers/types/userprofile.type";

class UserService {
  async getAllUsers(queries: UserGetAllControllerParams) {
    try {
      const { page, limit, filter, sort } = queries;

      const newQueries = {
        page,
        limit,
        filter: filter && JSON.parse(filter),
        sort: sort && JSON.parse(sort),
      };
      const result = await UserRepository.getAll(newQueries);

      return result;
    } catch (error) {
      console.error(
        `UserService - getAllUsers() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await UserRepository.findById(userId);

      return user;
    } catch (error) {
      console.error(
        `UserService - getUserById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async getUserBySub(sub: string) {
    try {
      const user = await UserRepository.findBySub(sub);

      return user;
    } catch (error) {
      console.error(
        `UserService - getUserById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  async changeProfilePic(photo: string, userId: string): Promise<IUser> {
    try {
      const response = await UserRepository.updateProfilePic(photo, userId);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async createNewUser(userInfo: UserCreationRepoParams) {
    try {
      console.log("userInfo", userInfo);
      const newUser = await UserRepository.create(userInfo);

      return newUser;
    } catch (error) {
      console.error(
        `UserService - createNewUser() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async updateUserBySub(userInfo: UserUpdateRepoParams) {
    try {
      const updatedUser = await UserRepository.updateBySub(userInfo);

      return updatedUser;
    } catch (error) {
      console.error(
        `UserService - createNewUser() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async deleteUserById(userId: string) {
    try {
      await UserRepository.deleteById(userId);
    } catch (error) {
      console.error(
        `UserService - createNewUser() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  //TODO: type
  public async getMultiProfileUser(usersId?: string): Promise<{
    usersProfile: {
      _id?: string;
      profile?: string;
      name?: string;
    }[];
  }> {
    console.log("1::");

    const arrUsersId = usersId?.split(",") || [];
    console.log("hi", arrUsersId);

    try {
      const result = await UserRepository.getMultiProfileUser(arrUsersId!);
      console.log("2::");

      if (!result) {
        // throw new NotFoundError();
        throw new Error("No user Found!");
      }
      console.log("3::");
      return { usersProfile: result };
    } catch (error) {
      console.error(
        `UserService - getMultiProfileUser() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async addFavorite(userId: string, jobId: string): Promise<IUser> {
    try {
      const user = await UserRepository.addFavorite(userId, jobId);
      return user;
    } catch (error) {
      console.error(
        `UserService - addFavorite() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async removeFavorite(userId: string, jobId: string): Promise<IUser> {
    try {
      const user = await UserRepository.removeFavorite(userId, jobId);
      return user;
    } catch (error) {
      console.error(
        `UserService - removeFavorite() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const favorites = await UserRepository.getUserFavorites(userId);
      return favorites;
    } catch (error) {
      console.error(
        `UserService - getUserFavorites() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  async getUserProfileById(
    userId: string,
    category?: string
  ): Promise<IUserProfile> {
    try {
      const profile = await UserRepository.getUserProfileByUserId(
        userId,
        category
      );
      return profile;
    } catch (error) {
      console.error(
        `UserService - getProfileById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  async updateUserProfile(
    userid: string,
    updateBody: IUserProfile,
    query?: string
  ): Promise<UnionProfileType> {
    try {
      const userData = await UserRepository.updateProfile(
        userid,
        updateBody,
        query
      );
      return userData;
    } catch (err) {
      throw err;
    }
  }
  async getCvFiles(userId: string) {
    try {
      console.log("inside get cv services");
      const response:CvFileParams|null = await UserRepository.getCvFile(userId);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async insertCvFile(userId: string, url: string) {
    try {
      console.log("inside get cv services");
      const response = await UserRepository.insertCvFile(userId, url);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async deleteCvFile(userId: string, cvId: string) {
    try {
      console.log("inside delete cv services");
      const response = await UserRepository.deleteCvFile(userId, cvId);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async getCvStyle(): Promise<CvStyleParams[]> {
    try {
      const response: CvStyleParams[] = await UserRepository.getCvStyle();
      return response;
    } catch (err) {
      throw err;
    }
  }
  async getCustomCvByUserId(
    userId: string
  ): Promise<CustomCvResponse | null | undefined> {
    try {
      const response: CustomCvResponse | null | undefined =
        await UserRepository.getCustomCvByUserId(userId);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async updateCustomCvByUserId(
    userId: string,
    cvData: any
  ): Promise<UnionCustomCvResponse> {
    try {
      const response: UnionCustomCvResponse =
        await UserRepository.updateCustomCvByUserId(userId, cvData);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default new UserService();
