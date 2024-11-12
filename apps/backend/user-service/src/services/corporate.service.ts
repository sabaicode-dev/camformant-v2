import { UserCreationRepoParams } from "@/src/database/repositories/types/user-repository.type";
import CorporateRepository from "@/src/database/repositories/coporate.repository";
import { prettyObject } from "@sabaicode-dev/camformant-libs";

class CorporateService {

    async getAllCorporates() {
        try {
            const getAllCorporates = await CorporateRepository.getAllCorporates()

            if (!getAllCorporates) {
                return null
            }
            return getAllCorporates
        } catch (error) {
            console.error(
                `CorporateService - getAllCorporates() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    async createCorporate(userInfo: UserCreationRepoParams) {
        try {
            console.log("userInfo", userInfo);
            const newUser = await CorporateRepository.createCorporate(userInfo);

            if (!newUser) {
                return null;
            }

            return newUser;
        } catch (error) {
            console.error(
                `CorporateService - createNewUser() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

    async getCorporateBySub(sub: string) {
        try {
            console.log("Fetching corporate profile by sub:", sub);
            const corporate = await CorporateRepository.getCorporateProfile(sub);

            if (!corporate) {
                console.warn(`Corporate profile with sub ${sub} not found`);
                return null;
            }

            return corporate;
        } catch (error) {
            console.error("CorporateService - getCorporateBySub() method error:", error);
            throw error;
        }
    }


    async getCorporateById(corporateId: string) {
        try {
            const corporate = await CorporateRepository.getCorporateById(corporateId);
            return corporate;
        } catch (error) {
            console.error(
                `CorporateService - getCorporateById() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

}

export default new CorporateService();
