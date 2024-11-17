import { prettyObject } from "@sabaicode-dev/camformant-libs";
import { JobGetAllRepoParams, JobSortParams } from "@/src/controllers/types/job-controller.type";
import { SortOrder } from "mongoose";
import CorporateProfileModel from "../models/corporateProfile.model";
import { IJob, JobModel } from "../models/job.model";

class IJobRepository {

    public async getAllJobs(queries: JobGetAllRepoParams) {
        const {
            page = 1,
            filter = { position: "ALL" },
            sort = { createdAt: "desc" },
            search = "",
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
                    const { min_salary, max_salary } = filter[key];

                    // Ensure salary ranges overlap
                    if (min_salary !== undefined && max_salary !== undefined) {
                        mongoFilter.$and = [
                            { min_salary: { $lte: max_salary } }, // Job's min salary <= user's max salary
                            { max_salary: { $gte: min_salary } }, // Job's max salary >= user's min salary
                        ];
                    } else if (min_salary !== undefined) {
                        // If only min salary is provided, return jobs with max salary >= min salary
                        mongoFilter.max_salary = { $gte: min_salary };
                    } else if (max_salary !== undefined) {
                        // If only max salary is provided, return jobs with min salary <= max salary
                        mongoFilter.min_salary = { $lte: max_salary };
                    }
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

        console.log("mongoFilter::: ", buildFilter(filter));

        // Adding search functionality
        const searchFilter = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { position: { $regex: search, $options: "i" } },
                    { "company_id.name": { $regex: search, $options: "i" } },
                ],
            }
            : {};

        try {
            const mongoFilter = {
                ...buildFilter(filter),
                ...searchFilter,
            };
            let operation: IJob[] = [];
            if (queries.limit === "*") {
                operation = await JobModel.find(mongoFilter)
                    .sort(sortFields)
                    .skip(skip)
                    .populate({
                        path: "company_id",
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
                        path: "company_id",
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
            const result = await JobModel.countDocuments({ company_id: companyId });
            if (!result) {
                console.log("IJobRepository - countJobsByCompanyId() method error : No jobs found for the company.");
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

    public async countJobsByStatus(companyId: string, status: string): Promise<number> {
        try {
            const result = await JobModel.countDocuments({ company_id: companyId, status });
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
            const result = await JobModel.find({ company_id: companyId })
                .sort({ created_at: -1 }).limit(limit);
            if (!result) {
                return 0
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
            const job = new JobModel(jobData);
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

    public async findJobsByCompanyId(companyId: string): Promise<IJob[]> {
        try {
            const result = await JobModel.find({ company_id: companyId, status: 'open' });
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
            const job = await JobModel.findByIdAndUpdate(jobId, { status: 'closed' }, { new: true });
            if (!job) {
                console.log("IJobRepository - closeJob() method error : Job not found.");
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