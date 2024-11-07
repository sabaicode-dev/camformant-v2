import UserModel, { IUser } from "@/src/database/models/user.model";
import {
  MongoError,
  UserCreationRepoParams,
  UserGetAllRepoParams,
  UserSortParams,
  UserUpdateRepoParams,
} from "@/src/database/repositories/types/user-repository.type";
import mongoose, { SortOrder } from "mongoose";
import UserProfileDetailModel from "@/src/database/models/userProfile.model";
import {
  AUTH_MESSAGES,
  InvalidInputError,
  NotFoundError,
  prettyObject,
  ResourceConflictError,
} from "@sabaicode-dev/camformant-libs";
import { CvFileModel, CvStyleModel } from "../models/userCv.model";
import { CvStyleParams } from "@/src/controllers/types/user-cv-controller.type";
import {
  IUserProfile,
  UnionProfileType,
} from "@/src/controllers/types/userprofile.type";
class UserRepository {
  async getAll(queries: UserGetAllRepoParams) {
    const {
      page = 1,
      limit = 10,
      filter = {},
      sort = { createdAt: "desc" },
    } = queries;

    // Convert sort from {'field': 'desc'} to {'field': -1}
    const sortFields = Object.keys(sort).reduce(
      (acc, key) => {
        const direction = sort[key as keyof UserSortParams];
        if (direction === "asc" || direction === "desc") {
          acc[key as keyof UserSortParams] = direction === "asc" ? 1 : -1;
        }
        return acc;
      },
      {} as Record<keyof UserSortParams, SortOrder>
    );

    // Build MongoDB filter object
    const buildFilter = (filter: Record<string, any>) => {
      const mongoFilter: Record<string, any> = {};
      for (const key in filter) {
        if (typeof filter[key] === "object") {
          if (
            filter[key].hasOwnProperty("min") ||
            filter[key].hasOwnProperty("max")
          ) {
            mongoFilter[key] = {};
            if (filter[key].min !== undefined) {
              mongoFilter[key].$gte = filter[key].min;
            }
            if (filter[key].max !== undefined) {
              mongoFilter[key].$lte = filter[key].max;
            }
          } else {
            mongoFilter[key] = filter[key];
          }
        } else {
          mongoFilter[key] = filter[key];
        }
      }
      return mongoFilter;
    };

    try {
      const mongoFilter = buildFilter(filter);
      console.log(mongoFilter);
      const operation = UserModel.find({
        age: { $gte: 18, $lte: 28 },
        gender: "Male",
      })
        .sort(sortFields)
        .skip((page - 1) * limit)
        .limit(limit);

      const result = await operation;
      const totalItems = await UserModel.countDocuments(mongoFilter);

      return {
        [UserModel.collection.collectionName]: result,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(
        `UserRepository - getAll() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async findById(userId: string) {
    try {
      const result = await UserModel.findById(userId);

      if (!result) {
        throw new NotFoundError();
      }

      return result;
    } catch (error) {
      console.error(
        `UserRepository - findById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async findBySub(sub: string) {
    try {
      const result = await UserModel.findOne({
        $or: [{ sub: sub }, { googleSub: sub }, { facebookSub: sub }],
      });

      if (!result) {
        throw new NotFoundError();
      }

      return result;
    } catch (error) {
      console.error(
        `UserRepository - findById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  async updateProfilePic(photo: string, userId: string): Promise<IUser> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          profile: photo,
        },
        { new: true }
      );
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async create(newInfo: UserCreationRepoParams) {
    try {
      const result = await UserModel.create(newInfo);

      return result;
    } catch (error) {
      console.error(
        `UserRepository - create() method error: `,
        prettyObject(error as {})
      );

      // Duplicate Email
      if ((error as MongoError).code === 11000) {
        throw new ResourceConflictError(
          AUTH_MESSAGES.AUTHENTICATION.ACCOUNT_ALREADY_EXISTS
        );
      }

      // Validation Error
      if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors: { [key: string]: string } = {};

        // Iterate over the errors object and collect messages
        for (const key in error.errors) {
          // Here, error.errors[key] can give you each specific validation error
          validationErrors[key] = error.errors[key].message;
        }

        throw new InvalidInputError({
          errors: validationErrors, // Now passing the structured errors
        });
      }

      throw error;
    }
  }

  async updateBySub(updateInfo: UserUpdateRepoParams) {
    try {
      const { id, ...newUpdateInfo } = updateInfo;

      const result = await UserModel.findOneAndUpdate(
        {
          $or: [{ userId: id }, { googleSub: id }, { facebookSub: id }],
        },
        newUpdateInfo,
        { new: true }
      );

      if (!result) {
        throw new NotFoundError();
      }

      return result;
    } catch (error) {
      console.error(
        `UserRepository - updateById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async deleteById(userId: string) {
    try {
      const result = await UserModel.findByIdAndDelete(userId);

      if (!result) {
        throw new NotFoundError();
      }
    } catch (error) {
      console.error(
        `UserRepository - updateById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async addFavorite(userId: string, jobId: string): Promise<IUser> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: jobId } },
        { new: true }
      );

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user;
    } catch (error) {
      console.error(
        `UserRepository - addFavorite() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async removeFavorite(userId: string, jobId: string): Promise<IUser> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { favorites: jobId } },
        { new: true }
      );

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user;
    } catch (error) {
      console.error(
        `UserRepository - removeFavorite() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const user = await UserModel.findById(userId).select("favorites");

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user.favorites;
    } catch (error) {
      console.error(
        `UserRepository - getUserFavorites() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  async getProfileByUserId(
    userId: string,
    category?: string
  ): Promise<IUserProfile> {
    try {
      let categoryData: any = {};
      if (!category) {
        categoryData = await UserProfileDetailModel.find({ userId: userId });
      } else if (category == "ability") {
        categoryData = await UserProfileDetailModel.find({
          userId: userId,
        }).select("skills expertise languages -_id");
      } else
        categoryData = await UserProfileDetailModel.find({ userId }).select(
          `${category} -_id`
        );
      if (!categoryData.length)
        throw new NotFoundError("user profile not found");
      return categoryData[0];
    } catch (err) {
      throw err;
    }
  }

  async updateProfile(
    userId: string,
    updateBody: IUserProfile
  ): Promise<UnionProfileType> {
    try {
      let existingUserId = await UserProfileDetailModel.find(
        { userId: userId },
        { userId: 1 }
      );

      if (existingUserId.length === 0) {
        let response = await UserProfileDetailModel.create({
          ...updateBody,
          userId,
        });
        return response;
      } else {
        const updatedUser = await UserProfileDetailModel.findOneAndUpdate(
          { userId },
          { $set: { ...updateBody } },
          { new: true, useFindAndModify: false }
        );

        return updatedUser;
      }
    } catch (err) {
      throw err;
    }
  }
  async getCvFile(userId: string) {
    try {
      console.log("insode get ::::", userId);
      const response = await CvFileModel.find();
      console.log("response in get:::", response);
      if (!response.length) throw new NotFoundError("userid not found");
      return response[0];
    } catch (err) {
      throw err;
    }
  }
  async insertCvFile(userId: string, url: string) {
    try {
      const response = await CvFileModel.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $push: { cv: { url } } },
        { new: true }
      );
      console.log("response in insert", response);
      if (!response) {
        console.log("respnose::: ", response);
        const newCvFile = await CvFileModel.create({
          userId: new mongoose.Types.ObjectId(userId),
          cv: [{ url: url }],
        });
        return newCvFile;
      }
      return response;
    } catch (err) {
      console.log("repo error", err);
      throw err;
    }
  }
  async deleteCvFile(userId: string, cvId: string) {
    try {
      const cvIdObj = new mongoose.Types.ObjectId(cvId);
      const response = await CvFileModel.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $pull: { cv: { _id: cvIdObj } } },
        { new: true }
      );
      if (!response)
        throw new NotFoundError("cv cannot delete due to ot found cvId");
      // Pull the array element where _id matches the elementId
      return response;
    } catch (err) {
      throw err;
    }
  }
  async getCvStyle(style: string): Promise<CvStyleParams> {
    try {
      const cvData: CvStyleParams[] = await CvStyleModel.find({ style });
      if (cvData.length > 0) throw new NotFoundError("CvStyle not found");
      return cvData[0];
    } catch (err) {
      throw err;
    }
  }
}

export default new UserRepository();
