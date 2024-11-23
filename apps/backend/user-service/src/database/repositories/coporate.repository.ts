import { NotFoundError, prettyObject } from "@sabaicode-dev/camformant-libs";
import CorporatorModel, { ICorporatorProfile } from "../models/corporate.model";
import mongoose from "mongoose";
import { companiesForJobs } from "./types/user-repository.type";

class CorporateRepository {
  //TODO: type
  public async getMultiProfileCompany(arrCompaniesId: string[]): Promise<
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

      const companiesData = result.map((com: ICorporatorProfile) => {
        const companyData = {
          _id: com._id,
          profile: com.profile,
          name: com.name,
        };
        return companyData;
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
      const latestResult = result.map((company: ICorporatorProfile) => {
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
      return profile.save();
    } catch (error) {
      console.error(
        `corporateRepository - createProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async getAllProfiles(): Promise<ICorporatorProfile[]> {
    try {
      const profiles = CorporatorModel.find().exec();
      if (!profiles) {
        console.log(
          "CompanyJobRepository - getAllProfiles() method error: No profiles found"
        );
        return [];
      }
      return profiles;
    } catch (error) {
      console.error(
        `CompanyJobRepository - getAllProfiles() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async findProfileById(
    companyId: string
  ): Promise<ICorporatorProfile | null> {
    try {
      const profile = CorporatorModel.findById(companyId);
      if (!profile) {
        console.log(
          "CompanyJobRepository - findProfileById() method error: Profile not found"
        );
        return null;
      }
      return profile;
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
      return profile;
    } catch (error) {
      console.error(
        `CompanyJobRepository - updateCorporateProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async deleteCorporateProfile(
    companyId: string
  ): Promise<ICorporatorProfile | null> {
    try {
      const result = await CorporatorModel.findByIdAndDelete(companyId);

      if (!result) {
        throw new NotFoundError("Job was not found!");
      }

      return result;
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
