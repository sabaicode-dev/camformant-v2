import UserModel from "@/src/database/models/user.model";
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
import {
  CvFileModel,
  CvStyleModel,
  UserCustomCv,
} from "@/src/database/models/userCv.model";
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
import { IUser } from "@/src/controllers/types/user.controller.type";
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
        [UserModel.collection.collectionName]: result as unknown as IUser[],
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
      return user as unknown as IUser;
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
      const { _id, ...newUpdateInfo } = updateInfo;

      const result = await UserModel.findOneAndUpdate(
        {
          $or: [{ sub: _id }, { googleSub: _id }, { facebookSub: _id }],
        },
        newUpdateInfo,
        { new: true }
      );

      if (!result) {
        throw new NotFoundError();
      }
      console.log("repo passed:::");

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

  //TODO: type
  public async getMultiProfileUser(arrUsersId: string[]): Promise<
    {
      _id: string | undefined;
      profile: string | undefined;
      name: string | undefined;
    }[]
  > {
    try {
      type Filter = {
        _id?: {
          $in: mongoose.Types.ObjectId[];
        };
      };
      const filter: Filter = {};

      if (arrUsersId?.length === 0) {
        return [];
      } else if (arrUsersId?.length !== 0) {
        filter._id = {
          $in: arrUsersId.map((id) => new mongoose.Types.ObjectId(id)),
        };
      }

      const result = await UserModel.find(filter);
      if (!result) {
        throw new NotFoundError();
      }

      const usersData = result.map((user) => {
        const userData = {
          _id: user._id,
          profile: user.profile,
          name: user.username,
        };
        return userData;
      });

      return usersData as unknown as {
        _id: string | undefined;
        profile: string | undefined;
        name: string | undefined;
      }[];
    } catch (error) {
      console.log(
        `UserRepository - getMultiProfileUser() method error:`,
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

      return user as unknown as IUser;
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

      return user as unknown as IUser;
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
      console.log("user::::", user);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user.favorites.map((favorite) => favorite.toString());
    } catch (error) {
      console.error(
        `UserRepository - getUserFavorites() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  async getUserProfileByUserId(
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
      if (!categoryData.length) return {};
      return categoryData[0];
    } catch (err) {
      throw err;
    }
  }

  async updateProfile(
    userId: string,
    updateBody: IUserProfile,
    query?: string
  ): Promise<UnionProfileType> {
    try {
      //this for update on each user profile
      if (!query) {
        const updatedUser = await UserProfileDetailModel.findOneAndUpdate(
          { userId },
          { $set: { ...updateBody } },
          { new: true, useFindAndModify: false }
        );
        console.log("response:::", updatedUser);
        if (!updatedUser) {
          let response = await UserProfileDetailModel.create({
            ...updateBody,
            userId,
          });
          return response;
        }

        return updatedUser;
      }
      //this for canva update when we edit the object textbox
      else {
        let updateQuery: Record<string, string | number> = {};
        for (const [key, value] of Object.entries(updateBody)) {
          //case: data is array of object
          if (typeof value === "object" && !Array.isArray(value)) {
            console.log("inside not array:::");
            for (const [nestedKey, nestedValue] of Object.entries(
              value as Record<string, string | number>
            )) {
              updateQuery[`${key}.${nestedKey}`] = nestedValue;
            }
          }

          // case: data is object without arr inside it
          else if (Array.isArray(value)) {
            console.log("inside array:::");
            value.forEach((element, _index) => {
              console.log("element", element);
              if ("index" in element) {
                const elementIndex = element.index;
                delete element.index; // Remove the index key from element to prevent unnecessary updates

                for (const [elemKey, elemValue] of Object.entries(
                  element as Record<string, string | number>
                )) {
                  // Only add properties other than `index`
                  updateQuery[`${key}.${elementIndex}.${elemKey}`] = elemValue;
                }
              }
            });
          }
        }
        console.log("update query:::", updateQuery);
        const result = await UserProfileDetailModel.findOneAndUpdate(
          { userId }, // Find the document by userId
          { $set: updateQuery }, // Apply the dynamically constructed update query
          { returnOriginal: false } // Return the updated document
        );
        return result;
      }
    } catch (err) {
      console.log(err)
      throw err;
    }
  }
  async getCvFile(userId: string): Promise<CvFileParams | null> {
    try {
      console.log("insode get ::::", userId);
      const response: CvFileParams | null = await CvFileModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      });
      return response;
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
      if (!response) {
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
      // Pull the array element where _id matches the elementId
      const response = await CvFileModel.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $pull: { cv: { _id: cvIdObj } } },
        { new: true }
      );
      if (!response)
        throw new NotFoundError("cv cannot delete due to not found cvId");

      return response;
    } catch (err) {
      throw err;
    }
  }
  async getCvStyle(): Promise<CvStyleParams[]> {
    try {
      const cvData: CvStyleParams[] = await CvStyleModel.find();
      if (cvData.length < 0) throw new NotFoundError("CvStyle not found");
      return cvData;
    } catch (err) {
      throw err;
    }
  }
  async getCustomCvByUserId(
    userId: string
  ): Promise<CustomCvResponse | null | undefined> {
    try {
      const response: CustomCvResponse | null =
        await UserCustomCv.findById(userId);
      if (!response) throw new NotFoundError("custom cv not found");

      return response;
    } catch (err) {}
  }
  async updateCustomCvByUserId(
    userId: string,
    cvData: any
  ): Promise<UnionCustomCvResponse> {
    try {
      const response: CustomCvResponse | null =
        await UserCustomCv.findByIdAndUpdate(userId, cvData, { new: true });
      if (!response) {
        const newInsertResponse: UnionCustomCvResponse =
          await UserCustomCv.create({
            _id: new mongoose.Types.ObjectId(userId),
            style: cvData.style,
            json: cvData.json,
          });
        return newInsertResponse;
      }
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default new UserRepository();
