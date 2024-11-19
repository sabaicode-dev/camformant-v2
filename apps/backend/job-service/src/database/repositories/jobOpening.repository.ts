import { NotFoundError, prettyObject } from "@sabaicode-dev/camformant-libs";
import {
  JobGetAllRepoParams,
  JobSortParams,
} from "@/src/controllers/types/job-controller.type";
import mongoose, { SortOrder } from "mongoose";
import CorporateProfileModel from "../models/corporateProfile.model";
import { IJob, JobModel } from "../models/job.model";

class IJobRepository {
  public async getAllJobs(queries: JobGetAllRepoParams) {
    let {
      page = 1,
      filter = { position: "ALL" },
      sort = { createdAt: "desc" },
      search = "",
      userFav,
    } = queries;
    const skip =
      queries.limit === "*" || !queries.limit
        ? 0
        : (page - 1) * parseInt(queries.limit);
    const limit =
      queries.limit === "*" || !queries.limit ? 5 : parseInt(queries.limit);

    // Define a list of properties that should always be treated as arrays
    const arrayProperties = [
      "type",
      "schedule",
      "required_experience",
      "location",
      "position",
      "workMode",
    ];

    //

    // Convert sort from {'field': 'desc'} to {'field': -1}
    const sortFields = Object.keys(sort).reduce(
      (acc, key) => {
        const direction = sort[key as keyof JobSortParams];
        if (direction === "asc" || direction === "desc") {
          acc[key as keyof JobSortParams] = direction === "asc" ? 1 : -1;
        } else if (direction === 1 || direction === -1) {
          acc[key as keyof JobSortParams] = direction; // Directly use 1 or -1
        }
        return acc;
      },
      {} as Record<keyof JobSortParams, SortOrder>
    );

    // Build MongoDB filter object
    const buildFilter = (filter: Record<string, any>) => {
      const mongoFilter: Record<string, any> = {};
      for (const key in filter) {
        // Handle range filtering for salaries
        if (key === "salary" && typeof filter[key] === "object") {
          console.log("salary::: ", filter[key]);

          const { min_salary = 0, max_salary = 5000 } = filter[key];
          mongoFilter.$and = [
            { min_salary: { $gte: min_salary, $lte: max_salary } },
            { max_salary: { $gte: min_salary, $lte: max_salary } },
          ];
        } else if (
          typeof filter[key] === "object" &&
          !Array.isArray(filter[key])
        ) {
          if (
            filter[key].hasOwnProperty("min") ||
            filter[key].hasOwnProperty("max")
          ) {
            mongoFilter[key] = {};
            if (filter[key].min !== undefined) {
              mongoFilter[key].$lte = filter[key].min;
            }
            if (filter[key].max !== undefined) {
              mongoFilter[key].$gte = filter[key].max;
            }
          } else {
            mongoFilter[key] = filter[key];
          }
        } else if (arrayProperties.includes(key)) {
          if (key === "position") {
            const positionValue = filter[key];
            if (
              typeof positionValue === "string" &&
              positionValue.toUpperCase() !== "ALL"
            ) {
              // Use case-insensitive regex for partial matching
              const regex = new RegExp(positionValue.trim(), "i");
              mongoFilter[key] = { $regex: regex };
            }
            // If "ALL" is present, do not add to filter
          } else {
            // Handle other array properties normally
            const trimmedArray = Array.isArray(filter[key])
              ? filter[key].map((val: string) => val.trim())
              : [filter[key].trim()];
            mongoFilter[key] = { $in: trimmedArray };
          }
        } else {
          mongoFilter[key] = filter[key];
        }
      }

      return mongoFilter;
    };

    // Adding search functionality
    const searchFilter = search
      ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { position: { $regex: search, $options: "i" } },
          { "companyId.name": { $regex: search, $options: "i" } },
        ],
      }
      : {};
    type UserFavFilter = {
      _id?: {
        $in: mongoose.Types.ObjectId[];
      };
    };
    const userFavFilter: UserFavFilter = {};
    if (userFav?.length) {
      userFavFilter._id = {
        $in: userFav.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    try {
      const mongoFilter = {
        ...userFavFilter,
        ...buildFilter(filter),
        ...searchFilter,
      };

      let operation: IJob[] = [];
      if (queries.limit === "*") {
        operation = await JobModel.find(mongoFilter)
          .sort(sortFields)
          .skip(skip)
          .populate({
            path: "companyId",
            model: CorporateProfileModel,
            select:
              "name location bio profile email phone_number job_openings job_closings",
          });
      } else {
        operation = await JobModel.find(mongoFilter)
          .sort(sortFields)
          .skip(skip)
          .limit(limit)
          .populate({
            path: "companyId",
            model: CorporateProfileModel,
            select:
              "name location bio profile email phone_number job_openings job_closings",
          });
      }

      const result = await operation;
      const totalItems = await JobModel.countDocuments(mongoFilter);
      const ItemsPerPage = queries.limit === "*" ? totalItems : limit;
      return {
        [JobModel.collection.collectionName]: result,
        totalItems,
        totalPages: Math.ceil(totalItems / ItemsPerPage),
        currentPage: page,
      };
    } catch (error) {
      console.error(
        `JobRepository - getAllJobs() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async countJobsByCompanyId(companyId: string): Promise<number> {
    try {
      const result = await JobModel.countDocuments({ companyId: companyId });
      if (!result) {
        console.log(
          "IJobRepository - countJobsByCompanyId() method error : No jobs found for the company."
        );
        return {} as any;
      }
      return result;
    } catch (error) {
      console.error(
        `IJobReposotory - countJobsByCompanyId() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async countJobsByStatus(
    companyId: string,
    status: string
  ): Promise<number> {
    try {
      const result = await JobModel.countDocuments({
        companyId: companyId,
        status,
      });
      if (!result) {
        return 0;
      }
      return result;
    } catch (error) {
      console.error(
        `IJobReposotory - countJobsByStatus() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async findRecentJobsByCompanyId(companyId: string, limit: number) {
    try {
      const result = await JobModel.find({ companyId: companyId })
        .sort({ created_at: -1 })
        .limit(limit);
      if (!result) {
        return 0;
      }
      return result;
    } catch (error) {
      console.error(
        `IJobReposotory - findRecentJobsByCompanyId() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async createJob(jobData: Partial<IJob>): Promise<IJob> {
    try {
      console.log("JobDataaaaaaaaaaa:::::::", jobData);

      const job = await JobModel.create(jobData);
      if (!job) {
        throw new Error("Job creation failed.");
      }
      return job.save();
    } catch (error) {
      console.error(
        `IJobReposotory - createJob() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async findJobById(jobId: string) {
    try {
      const result = await JobModel.findById(jobId).populate({
        path: "companyId",
        model: CorporateProfileModel,
        select:
          "name location bio profile email phone_number job_openings job_closings",
      });

      if (!result) {
        throw new NotFoundError("The requested job was not found.");
      }

      return result;
    } catch (error) {
      console.error(
        `IJobRepository - findJobById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async updateJobById(updateJob: IJob): Promise<IJob> {
    try {
      const { _id, ...updateNewJob } = updateJob;
      const result = await JobModel.findByIdAndUpdate(_id, updateNewJob, {
        new: true,
      });
      if (!result) {
        throw new NotFoundError("The requested job was not found.");
      }

      return result;
    } catch (error) {
      console.error(
        `IJobRepository - updateJobById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async deleteJobById(jobId: string) {
    try {
      const result = await JobModel.findByIdAndDelete(jobId);

      if (!result) {
        throw new NotFoundError("Job was not found!");
      }

      return result;
    } catch (error) {
      console.error(
        `IJobRepository - deleteJobById() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async findJobsByCompanyId(companyId: string): Promise<IJob[]> {
    try {
      const result = await JobModel.find({ companyId: companyId, status: 'open' });
      if (!result) {
        console.log("IJobRepository - findJobsByCompanyId() method error : No jobs found for the company.");
        return [] as any;
      }
      return result;
    } catch (error) {
      console.error(
        `IJobReposotory - findJobsByCompanyId() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }

  public async closeJob(jobId: string): Promise<IJob | null> {
    try {
      const job = await JobModel.findByIdAndUpdate(
        jobId,
        { status: "closed" },
        { new: true }
      );
      if (!job) {
        console.log(
          "IJobRepository - closeJob() method error : Job not found."
        );
        return null;
      }
      return job;
    } catch (error) {
      console.error(
        `IJobReposotory - closeJob() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
}

export default new IJobRepository();
