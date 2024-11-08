import {
  JobGetAllRepoParams,
  JobParams,
  JobSortParams,
} from "@/src/controllers/types/job-controller.type";
import { CompanyModel } from "@/src/database/models/company.model";
import { IJob, JobModel } from "@/src/database/models/job.model";
import { NotFoundError, prettyObject } from "@sabaicode-dev/camformant-libs";
import mongoose, { SortOrder } from "mongoose";

class JobRepository {
  public async createNewJob(newInfo: JobParams): Promise<IJob> {
    try {
      const newJob = await JobModel.create(newInfo);

      return newJob;
    } catch (error) {
      console.error(
        `JobRepository createNewJob() method error: `,
        prettyObject(error as {})
      );

      throw error;
    }
  }

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
          // mongoFilter.$and = [
          //   { min_salary: { $lte: max_salary } },
          //   { max_salary: { $gte: min_salary } },
          // ];

          // mongoFilter.min_salary = { $gte: min_salary, $lte: max_salary };
          // mongoFilter.max_salary = { $lte: max_salary };

          console.log("mongoFilter::: ", mongoFilter);
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

    // console.log("mongoFilter::: ", buildFilter(filter));

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
    // console.log("userFav:::, ", userFav);

    const userFavFilter: any = {};
    if (userFav?.length !== 0) {
      userFavFilter._id = {
        $in: userFav?.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    // console.log("userFavFilter::::,", userFavFilter);

    try {
      const mongoFilter = {
        ...(userFavFilter || {}),
        ...buildFilter(filter),
        ...searchFilter,
      };
      // console.log("filter mongo:::, ", mongoFilter);

      let operation: IJob[] = [];
      if (queries.limit === "*") {
        operation = await JobModel.find(mongoFilter)
          .sort(sortFields)
          .skip(skip)
          .populate({
            path: "companyId",
            model: CompanyModel,
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
            model: CompanyModel,
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

  public async findJobById(jobId: string) {
    try {
      const result = await JobModel.findById(jobId).populate({
        path: "companyId",
        model: CompanyModel,
        select:
          "_id name location bio profile email phone_number job_openings job_closings",
      });

      if (!result) {
        throw new NotFoundError("The requested job was not found.");
      }

      return result;
    } catch (error) {
      console.error(
        `JobRepository - findJobById() method error: `,
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
        `JobRepository - updateJobById() method error: `,
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

      return !!result;
    } catch (error) {
      console.error(
        `JobRepository - deleteJobById() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }
}

export default new JobRepository();
