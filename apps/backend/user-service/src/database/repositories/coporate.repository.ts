import { NotFoundError, prettyObject } from "@sabaicode-dev/camformant-libs";
import CorporatorModel from "../models/corporate.model";
import mongoose from "mongoose";
import { companiesForJobs, getMultiProfileCompanyResponse } from "./types/user-repository.type";
import { AllJobRes, ICorporatorProfile, QueriesRepoParams } from "@/src/controllers/types/corporate-controller.type";

class CorporateRepository {
  //TODO: type
  public async getMultiProfileCompany(arrCompaniesId: string[]): Promise<
    getMultiProfileCompanyResponse[]
  > {
    try {
      type Filter = {
        _id?: {
          $in: mongoose.Types.ObjectId[];
        };
      };
      const filter: Filter = {};

      if (arrCompaniesId?.length === 0) {
        return [];
      } else if (arrCompaniesId?.length !== 0) {
        filter._id = {
          $in: arrCompaniesId.map((id) => new mongoose.Types.ObjectId(id)),
        };
      }

      const result = await CorporatorModel.find(filter);
      if (!result) {
        throw new NotFoundError("No User Found!");
      }

      if (result.length === 0) {
        return [];
      }

      const companiesData = result.map((com) => {
        const companyData = {
          _id: com._id,
          profile: com.profile,
          name: com.name,
        };
        return companyData as unknown as getMultiProfileCompanyResponse;
      });

      return companiesData;
    } catch (error) {
      console.error(
        `CompanyRepository getMultiProfileCompany() method error:`,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async getMultiCompanies(
    companiesId: string[]
  ): Promise<companiesForJobs[]> {
    try {
      type Filter = {
        _id?: {
          $in: mongoose.Types.ObjectId[];
        };
      };
      const filter: Filter = {};

      if (companiesId?.length === 0) {
        return [];
      } else if (companiesId?.length !== 0) {
        filter._id = {
          $in: companiesId.map((id) => new mongoose.Types.ObjectId(id)),
        };
      }

      const result = await CorporatorModel.find(filter);
      if (result.length === 0) {
        return [];
      }
      const latestResult = result.map((company) => {
        const newCompany = {
          _id: company._id,
          name: company.name,
          location: {
            address: company.location?.address,
            city: company.location?.city,
            country: company.location?.country,
          },
          description: company.description,
          profile: company.profile,
          email: company.email,
          contact: {
            phone_number: company.contact?.phone_number,
            website: company.contact?.website,
          },
          job_openings_count: company.job_openings_count,
          job_closings_count: company.job_closings_count,
        };
        return newCompany;
      });

      return latestResult as unknown as companiesForJobs[];
    } catch (error) {
      throw error;
    }
  }
  public async createProfile(
    profileData: ICorporatorProfile
  ): Promise<ICorporatorProfile> {
    try {
      const profile = new CorporatorModel(profileData);
      if (!profile) {
        console.log(
          "corporateRepository - createProfile() method error: Profile not created"
        );
        throw new Error(
          "corporateRepository - createProfile() method error: Profile not created"
        );
      }
      return profile.save() as unknown as ICorporatorProfile;
    } catch (error) {
      console.error(
        `corporateRepository - createProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async getAllProfiles(queries:QueriesRepoParams): Promise<AllJobRes|{}> {
    try {
      let {limit,filter,page=1}=queries
      limit=limit?limit:0
      const skip=(page-1)*limit
      const query=filter?filter:{}
      const profiles = await CorporatorModel.find(query).skip(skip).limit(limit);
      console.log("filter:::::",query)
      const countDocument:number=await CorporatorModel.countDocuments(query)
      if (!profiles) {
        console.log(
          "CompanyJobRepository - getAllProfiles() method error: No profiles found"
        );
        return {};
      }
      return {
        data:profiles,
        totalPage:Math.ceil(countDocument/profiles.length),
        currentPage:page,
        skip:skip,
        limit:limit,
        

      } as unknown as ICorporatorProfile[];
    } catch (error) {
      console.error(
        `CompanyJobRepository - getAllProfiles() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async findProfileBySub(
    companySub: string
  ): Promise<ICorporatorProfile | null> {
    try {
      const profile = CorporatorModel.findOne({
        $or: [{ sub: companySub }],
      });
      if (!profile) {
        console.log(
          "CompanyJobRepository - findProfileById() method error: Profile not found"
        );
        return null;
      }
      return profile as unknown as ICorporatorProfile;
    } catch (error) {
      console.error(
        `CompanyJobRepository - findProfileById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async updateCorporateProfile(
    companyId: string,
    profileData: ICorporatorProfile
  ): Promise<ICorporatorProfile | null> {
    try {
      const profile = CorporatorModel.findByIdAndUpdate(
        companyId,
        profileData,
        { new: true }
      ).exec();
      if (!profile) {
        console.log(
          "CompanyJobRepository - updateCorporateProfile() method error: Profile not found"
        );
        return null;
      }
      return profile as unknown as ICorporatorProfile;
    } catch (error) {
      console.error(
        `CompanyJobRepository - updateCorporateProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async deleteCorporateProfile(
    companySub: string
  ): Promise<ICorporatorProfile | null> {
    try {
      const result = await CorporatorModel.findOneAndDelete({sub:companySub});

      if (!result) {
        throw new NotFoundError("Job was not found!");
      }

      return result as unknown as ICorporatorProfile;
    } catch (error) {
      console.error(
        `CompanyJobRepository - deleteCorporateProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
}

export default new CorporateRepository();
