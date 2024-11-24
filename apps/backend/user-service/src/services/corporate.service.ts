import CorporateRepository from "@/src/database/repositories/coporate.repository";
import { prettyObject } from "@sabaicode-dev/camformant-libs";
import { ICorporatorProfile } from "../database/models/corporate.model";
import { companiesForJobs } from "../database/repositories/types/user-repository.type";

class CorporateService {
  public async getMultiCompanies(
    companiesId?: string
  ): Promise<{ companies: companiesForJobs[] }> {
    try {
      const arrayCompaniesId = companiesId ? companiesId.split(",") : [];
      const res = await CorporateRepository.getMultiCompanies(arrayCompaniesId);

      return { companies: res };
    } catch (error) {
      throw error;
    }
  }
  public async createProfile(profileData: ICorporatorProfile) {
    try {
      const profile = await CorporateRepository.createProfile(profileData);
      if (!profile) {
        console.log(
          "CorporateService - createProfile() method error: Profile not created"
        );
        throw new Error("Profile not created");
      }
      return profile;
    } catch (error) {
      console.error(
        `CorporateService - createProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async getAllProfiles(): Promise<ICorporatorProfile[]> {
    try {
      const corporateProfile = await CorporateRepository.getAllProfiles();
      if (!corporateProfile) {
        console.log(
          "CorporateService - postIJob() method error: No corporate profile found"
        );
        return [];
      }
      return corporateProfile;
    } catch (error) {
      console.error(
        `CorporateService - postIJob() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async getProfileById(id: string): Promise<ICorporatorProfile | null> {
    try {
      const corporateProfile = await CorporateRepository.findProfileById(id);
      if (!corporateProfile) {
        console.log(
          "CorporateService - getProfileById() method error: No corporate profile found"
        );
        return null;
      }
      return corporateProfile;
    } catch (error) {
      console.error(
        `CorporateService - getProfileById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async updateCorporateProfile(
    corporateId: string,
    profileData: ICorporatorProfile
  ) {
    try {
      const profile = await CorporateRepository.updateCorporateProfile(
        corporateId,
        profileData
      );
      if (!profile) {
        console.log(
          "CorporateService - updateCorporateProfile() method error: Profile not updated"
        );
        throw new Error(
          "CorporateService - updateCorporateProfile() method error: Profile not updated"
        );
      }
      return profile;
    } catch (error) {
      console.error(
        `CorporateService - updateCorporateProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  public async deleteCorporateProfile(corporateId: string) {
    try {
      const profile =
        await CorporateRepository.deleteCorporateProfile(corporateId);
      if (!profile) {
        console.log(
          "CorporateService - deleteCorporateProfile() method error: Profile not deleted"
        );
        throw new Error(
          "CorporateService - deleteCorporateProfile() method error: Profile not deleted"
        );
      }
      return profile;
    } catch (error) {
      console.error(
        `CorporateService - deleteCorporateProfile() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }
  }
  //TODO: type
  public async getMultiProfileCompany(companiesId?: string): Promise<{
    companiesProfile: {
      _id: string | undefined;
      profile: string | undefined;
      name: string | undefined;
    }[];
  }> {
    const arrCompaniesId = companiesId ? companiesId?.split(",") : [];
    try {

      const result = await CorporateRepository.getMultiProfileCompany(
        arrCompaniesId!
      );

      if (!result) {
        throw new Error("Not found");
      }
      return { companiesProfile: result };
    } catch (error) {
      console.error(
        `CompanyService getMultiProfileCompany() method error:`,
        error
      );
      throw error;
    }
  }
  //todo: later
  public async getProfileWithJobs(
    companyId: string,
    // recentJobsLimit: number = 5
  ) {
    const profile = await CorporateRepository.findProfileById(companyId);

    if (!profile) {
      console.log(
        "CorporateService - getProfileWithJobs() method error: Profile not found"
      );
      return null;
    }
    //todo::: prepare from job service
    // const [totalJobs, recentJobs] = await Promise.all([
    //   jobOpeningRepository.countJobsByCompanyId(companyId), // total jobs
    //   jobOpeningRepository.findRecentJobsByCompanyId(
    //     companyId,
    //     recentJobsLimit
    //   ), // recent jobs
    // ]);

    // const jobStats = {
    //   total: totalJobs,
    //   recentJobs: recentJobs,
    // };

    const profileObject = (
      profile as Document & { toObject: () => any }
    ).toObject();

    return { ...profileObject };
  }
}

export default new CorporateService();
