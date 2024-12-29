import {
  BodyUpdateJobApply,
  GetApplyJobResLimit,
  JobApplyQueriesRepo,
  JobApplyResponse,
  JobGetAllRepoParams,
  JobParams,
  JobSortParams,
  PostJobApplyBody,
} from "@/src/controllers/types/job-controller.type";
import {
  ApplyModel,
  companiesForJobs,
  IJob,
  JobModel,
  returnJobs,
} from "@/src/database/models/job.model";
import { NotFoundError, prettyObject } from "@sabaicode-dev/camformant-libs";
import mongoose, { SortOrder } from "mongoose";
import axios from "axios";
import configs from "@/src/config";

class JobRepository {
  //new post
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
  //
  //DONE::
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
  //todo: fix search salary 0-1100 not return 800-1200
  public async getAllJobs(queries: JobGetAllRepoParams): Promise<{
    jobs: returnJobs[];
    totalJobs: number;
    totalPages: number;
    currentPage: number;
    skip: number;
    limit: number;
  }> {
    const {
      page = 1,
      filter,
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

    // Convert sort from {'field': 'desc'} to {'field': -1}
    const sortFields = buildSortFields(sort);

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
        ...buildFilter(filter!),
        ...searchFilter,
      };

      let operation: IJob[] = [];
      if (queries.limit === "*") {
        operation = await JobModel.find(mongoFilter)
          .sort(sortFields)
          .skip(skip);
      } else {
        operation = await JobModel.find(mongoFilter)
          .sort(sortFields)
          .skip(skip)
          .limit(limit);
      }

      const result = operation;
      if (!result) {
        throw new NotFoundError("no jobs found");
      }
      const companiesId = result.map((jobs: IJob) => jobs.companyId);

      const validCompaniesId = companiesId.filter((id) => id !== undefined);
      const data = await fetchCompaniesProfile(validCompaniesId);
      //remove companyId property and merge jobs with companies
      const newJobReturn = combinedJobsWithCompanies(result, data) || [];

      const totalItems = await JobModel.countDocuments(mongoFilter);
      const ItemsPerPage = queries.limit === "*" ? totalItems : limit;
      return {
        jobs: newJobReturn,
        totalJobs: totalItems,
        totalPages: Math.ceil(totalItems / ItemsPerPage),
        currentPage: page,
        skip: skip,
        limit: limit,
      };
    } catch (error) {
      console.error(
        `JobRepository - getAllJobs() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async getAllJobsWithCorporator(companyId: string) {
    try {
      const result = await JobModel.find({ companyId: companyId });
      if (!result) {
        throw new NotFoundError("No jobs found for this company.");
      }
      return result;
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
      const result = await JobModel.findById(jobId);
      if (!result) {
        throw new NotFoundError("The requested job was not found.");
      }
      const companiesId = result?.companyId;

      const data: companiesForJobs = (
        await fetchCompaniesProfile(companiesId)
      )[0];
      //
      const {
        _id,
        companyId,
        deadline,
        updatedAt,
        createdAt,
        benefit,
        required_experience,
        schedule,
        type,
        job_opening,
        max_salary,
        position,
        min_salary,
        title,
        workMode,
        location,
        requirement,
        description,
        address,
      } = result;
      const newJobReturn: returnJobs = {
        _id,
        companyId,
        deadline,
        updatedAt,
        createdAt,
        benefit,
        required_experience,
        schedule,
        type,
        job_opening,
        max_salary,
        position,
        min_salary,
        title,
        workMode,
        location,
        requirement,
        description,
        address,
      };
      if (
        result.companyId?.toString() ===
        new mongoose.Types.ObjectId(data._id).toString()
      ) {
        newJobReturn.company = data;
      }

      return newJobReturn;
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
      console.log("inside repo:::");
      const { _id, ...updateNewJob } = updateJob;
      console.log("job id in repo::::", _id);
      const result = await JobModel.findByIdAndUpdate(
        _id,
        { ...updateNewJob, updatedAt: new Date() },
        {
          new: true,
        }
      );
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
  public async getJobApply(
    queries: JobApplyQueriesRepo
  ): Promise<GetApplyJobResLimit | JobApplyResponse[]> {
    try {
      const { limit, page = 1, sort = { appliedAt: "asc" }, filter } = queries;
      let query: {
        userId?: mongoose.Types.ObjectId;
        jobId?: mongoose.Types.ObjectId;
        companyId?: mongoose.Types.ObjectId;
        [key: string]: string | null | mongoose.Types.ObjectId | undefined;
      } = queries.userId
        ? { userId: new mongoose.Types.ObjectId(queries.userId) }
        : queries.companyId
          ? { companyId: new mongoose.Types.ObjectId(queries.companyId) }
          : { jobId: new mongoose.Types.ObjectId(queries.jobId) };
      if (filter !== undefined) {
        //cause this can be undefined
        query["userInfo.status"] = filter;
      }
      const buildSort = buildSortFields(sort!);
      if (limit) {
        const skip = (page - 1) * limit;
        const totalItems = await ApplyModel.countDocuments(query);
        const response: any = await ApplyModel.find({
          ...query,
        })
          .skip(skip)
          .limit(limit)
          .sort(buildSort);
        if (!response.length) {
          throw new NotFoundError("Job Apply was not found");
        }
        const witJobInfo = await enrichJobData(
          response,
          this.findJobById.bind(this)
        );
        return {
          applyData: witJobInfo,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          skip: skip,
          limit: limit,
        };
      }
      const response = await ApplyModel.find(query).sort(buildSort);
      //insert some job info response
      const resWithJobData = await enrichJobData(
        response,
        this.findJobById.bind(this)
      );
      return resWithJobData ? resWithJobData : response;
    } catch (err) {
      console.error(
        `JobRepository - applyjob() method error:`,
        prettyObject(err as {})
      );
      throw err;
    }
  }

  public async createJobApply(
    body: PostJobApplyBody
  ): Promise<JobApplyResponse | {}> {
    try {
      const response: JobApplyResponse | {} = await ApplyModel.create(body);
      return response;
    } catch (err) {
      throw err;
    }
  }
  public async updateJobApply(
    applyId: string,
    body: BodyUpdateJobApply
  ): Promise<JobApplyResponse | {} | null> {
    try {
      const updateFields = Object.keys(body).reduce(
        (acc: Record<string, string | Date | undefined>, key: string) => {
          if (
            body[key as keyof BodyUpdateJobApply] !== undefined &&
            body[key as keyof BodyUpdateJobApply] !== null
          ) {
            if (key === "status") {
              acc[`userInfo.${key}`] = body[key as keyof BodyUpdateJobApply];
              console.log("key::::", key);
              acc[`statusDate.${body[key as keyof BodyUpdateJobApply]}`] =
                new Date();
            } else
              acc[`companyResponse.${key}`] = [
                "interviewDate",
                "startDate",
              ].includes(key)
                ? new Date(body[key as keyof BodyUpdateJobApply]!)
                : body[key as keyof BodyUpdateJobApply];
          }
          return acc;
        },
        {}
      );
      const response = await ApplyModel.findByIdAndUpdate(
        applyId,
        { $set: { ...updateFields } },
        { new: true, useFindAndModify: false }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }
  public async deleteJobApply(applyId: string) {
    try {
      const response = ApplyModel.findByIdAndDelete(applyId);
      if (!response) {
        throw new NotFoundError(`JobApply with id ${applyId} not found`);
      }
      return response;
    } catch (err) {
      throw err;
    }
  }
  public async deleteManyJobApply(jobId: string) {
    try {
      const response = ApplyModel.deleteMany({
        jobId: new mongoose.Types.ObjectId(jobId),
      });
      return response;
    } catch (err) {
      throw err;
    }
  }
  public async getApplyLength(query: {
    id?: { [key: string]: string[] | string };
    filter: { [key: string]: string[] | string };
  }): Promise<
    | { [key: string]: number }
    | { [key: string]: { [key: string]: number } }
    | undefined
  > {
    try {
      let counts:
        | { [key: string]: number }
        | {
            [key: string]: { [key: string]: number };
          } = {};
      const idKey = query.id ? Object.keys(query.id)[0] : undefined; //to have key inside id obj
      const key = Object.keys(query.filter)[0]; //to have key inside filter obj
      if (
        Array.isArray(query.filter[key]) &&
        query.id &&
        Array.isArray(query.id[idKey!])
      ) {
        const formatValues = idKey!.toLowerCase().includes("id")
          ? (query.id[idKey!] as string[]).map(
              (id: string) => new mongoose.Types.ObjectId(id)
            )
          : query.id[idKey!];
        for (let idValue of formatValues) {
          counts[idValue.toString()] = {};
          for (let value of query.filter[key]) {
            console.log("value");
            const count = await ApplyModel.countDocuments({
              [idKey as string]: idValue,

              ...createDateQuery(key, Number(value)),
            });
            //@ts-ignore
            counts[idValue.toString()][value.toString()] = count;
          }
        }
        return counts;
      } else if (Array.isArray(query.filter[key])) {
        const formatValues = key.toLowerCase().includes("id") //in case the id is userId so we need to lowercase that
          ? query.filter[key].map((id) => new mongoose.Types.ObjectId(id))
          : query.filter[key];
        for (let value of formatValues) {
          const count = await ApplyModel.countDocuments({
            ...(idKey && !Array.isArray(query.id![idKey])
              ? { [idKey]: new mongoose.Types.ObjectId(query.id![idKey]) }
              : {}),
            ...(/^\d{2}$/.test(value as string)
              ? {
                  ...createDateQuery(key, Number(value)),
                }
              : { [key]: value }),
          });
          counts[value.toString()] = count;
        }
        return counts;
      } else {
        console.log("hellow:::", key);
        const formatValue = key.toLowerCase().includes("id")
          ? new mongoose.Types.ObjectId(query.filter[key])
          : key;
        const value = query.filter[formatValue.toString()];
        const count = await ApplyModel.countDocuments({
          ...(idKey && !Array.isArray(query.id![idKey])
            ? { [idKey]: new mongoose.Types.ObjectId(query.id![idKey]) }
            : {}),

          ...(/^\d{2}$/.test(query.filter[formatValue.toString()] as string)
            ? {
                ...createDateQuery(key, Number(value)),
              }
            : { [formatValue.toString()]: value }),
        });
        return { [value as string]: count };
      }
    } catch (err) {
      throw err;
    }
  }

}

//===function===
function createDateQuery(key: string, month: number) {
  //format month-day based on db date format
  return {
    $expr: {
      $and: [{ $eq: [{ $month: `$${key}` }, month] }],
    },
  };
}

async function enrichJobData(
  response: any[],
  findJobById: (id: string) => Promise<returnJobs>
) {
  return Promise.all(
    response.map(async (applyJob) => {
      const jobData = await findJobById(applyJob.jobId!.toString());
      const {
        company,
        title,
        position,
        min_salary,
        max_salary,
        job_opening,
        type,
        schedule,
        location,
        deadline,
      } = jobData;

      return {
        ...applyJob.toObject(),
        jobInfo: {
          profile: company?.profile,
          title,
          position,
          min_salary,
          max_salary,
          job_opening,
          type,
          schedule,
          location,
          deadline,
        },
      } as any;
    })
  );
}
async function fetchCompaniesProfile(
  companiesId:
    | string
    | string[]
    | mongoose.Types.ObjectId
    | mongoose.Types.ObjectId[]
    | undefined
) {
  const lastId = Array.isArray(companiesId)
    ? companiesId.join(",")
    : companiesId?.toString() || "";
  const query = lastId.length === 0 ? "" : `?companiesId=${lastId}`;

  const endpoint = `${configs.corporator_api_endpoint}/companies`;
  const companiesRes = await axios.get(`${endpoint}${query}`);
  const data: companiesForJobs[] = companiesRes.data.companies;
  return data;
}
const buildSortFields = (sort: JobSortParams) => {
  const sortFields = Object.keys(sort).reduce(
    (acc, key) => {
      const direction = sort[key as keyof JobSortParams];
      if (direction === "asc" || direction === "desc") {
        acc[
          key != "name"
            ? (key as keyof JobSortParams)
            : ("userInfo.name" as keyof JobSortParams)
        ] = direction === "asc" ? 1 : -1;
      } else if (direction === 1 || direction === -1) {
        acc[
          key != "name"
            ? (key as keyof JobSortParams)
            : ("userInfo.name" as keyof JobSortParams)
        ] = direction; // Directly use 1 or -1
      }
      return acc;
    },
    {} as Record<keyof JobSortParams, SortOrder>
  );
  return sortFields;
};
//ensure date is valid

// Build MongoDB filter object
const buildFilter = (filter: Record<string, any>) => {
  // Define a list of properties that should always be treated as arrays
  const arrayProperties = [
    "type",
    "schedule",
    "required_experience",
    "location",
    "position",
    "workMode",
  ];
  const mongoFilter: Record<string, any> = {};
  for (const key in filter) {
    // Handle range filtering for salaries
    if (key === "salary" && typeof filter[key] === "object") {
      // console.log("salary::: ", filter[key]);

      const { min_salary = 0, max_salary = 5000 } = filter[key];
      mongoFilter.$or = [
        { min_salary: { $gte: min_salary, $lte: max_salary } },
        { max_salary: { $gte: min_salary, $lte: max_salary } },
      ];
    } else if (typeof filter[key] === "object" && !Array.isArray(filter[key])) {
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
        if (Array.isArray(positionValue)) {
          mongoFilter[key] = {
            $elemMatch: {
              $in: positionValue.map((value: string) => new RegExp(value, "i")),
            },
          };
        } else if (
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
const combinedJobsWithCompanies = (
  result: IJob[],
  data: companiesForJobs[]
) => {
  const newJobs = result.map(
    ({
      _id,
      deadline,
      updatedAt,
      createdAt,
      benefit,
      required_experience,
      schedule,
      type,
      job_opening,
      max_salary,
      position,
      min_salary,
      title,
      workMode,
      location,
      requirement,
      description,
      address,
    }: IJob) => ({
      _id,
      deadline,
      updatedAt,
      createdAt,
      benefit,
      required_experience,
      schedule,
      type,
      job_opening,
      max_salary,
      position,
      min_salary,
      title,
      workMode,
      location,
      requirement,
      description,
      address,
    })
  );
  const newJobReturn: returnJobs[] = [];
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (
        result[i].companyId?.toString() ===
        new mongoose.Types.ObjectId(data[j]._id).toString()
      ) {
        newJobReturn[i] = {
          ...newJobs[i],
          company: data[j],
        };
        break;
      }
    }
  }
  return newJobReturn;
};
export default new JobRepository();
