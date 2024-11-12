import { MongoError, UserCreationRepoParams } from "@/src/database/repositories/types/user-repository.type";
import mongoose from "mongoose";
import {
    InvalidInputError,
    NotFoundError,
    prettyObject,
} from "@sabaicode-dev/camformant-libs";
import { CorporateModel } from "../models/corporate.model";

class CorporateRepository {

    async getAllCorporates() {
        try {
            const result = await CorporateModel.find()
            if (!result) {
                throw new Error("Not Found Corporates")
            }
            return result
        } catch (error) {
            console.error(
                `CorporateRepository - getAllCorporates() method error: `,
                prettyObject(error as {})
            );

        }
    }

    async createCorporate(newInfo: UserCreationRepoParams) {
        try {
            const result = await CorporateModel.create(newInfo);
            console.log("CreateCorporate ::::::::::::::::::::::::;;", result);
            return result;
        } catch (error) {
            console.error(
                `CorporateRepository - create() method error: `,
                prettyObject(error as {})
            );

            // Duplicate Email
            if ((error as MongoError).code === 11000) {
                // throw new ResourceConflictError(APP_ERROR_MESSAGE.existedEmail);
                throw new Error("Exist data");
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

    async getCorporateProfile(sub: string) {
        try {
            console.log("Searching for corporate profile with username:", sub);
            const result = await CorporateModel.findOne({ sub: sub });
            console.log("CorporateProfile Result:", result);

            if (!result) {
                console.warn(`Corporate profile not found for username: ${sub}`);
                throw new NotFoundError("Corporate profile not found.");
            }

            return result;
        } catch (error) {
            console.error("CorporateRepository - getCorporateProfile() method error:", error);
            throw error;
        }
    }


    async getCorporateById(corporateId: string) {
        try {
            const corporate = await CorporateModel.findById(corporateId);

            if (!corporate) {
                throw new NotFoundError("Corporate not found");
            }

            return corporate;
        } catch (error) {
            console.error(
                `CorporateRepository - getCorporateById() method error: `,
                prettyObject(error as {})
            );
            throw error;
        }
    }

}

export default new CorporateRepository();
