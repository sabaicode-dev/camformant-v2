/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from './../../controllers/user.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HealthController } from './../../controllers/health.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CorporateController } from './../../controllers/corporate.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminController } from './../../controllers/admin.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "mongoose.Types.ObjectId": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "sub": {"dataType":"string"},
            "googleSub": {"dataType":"string"},
            "facebookSub": {"dataType":"string"},
            "username": {"dataType":"string"},
            "email": {"dataType":"string"},
            "phone_number": {"dataType":"string"},
            "profile": {"dataType":"string"},
            "gender": {"dataType":"string"},
            "age": {"dataType":"double"},
            "birthdate": {"dataType":"datetime"},
            "role": {"dataType":"string"},
            "favorites": {"dataType":"array","array":{"dataType":"refAlias","ref":"mongoose.Types.ObjectId"}},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
            "lastActive": {"dataType":"datetime"},
            "lastSeen": {"dataType":"datetime"},
            "sessions": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"lastLogin":{"dataType":"datetime","required":true},"ipAddress":{"dataType":"string","required":true},"deviceId":{"dataType":"string","required":true}}}},
            "privacySettings": {"dataType":"nestedObjectLiteral","nestedProperties":{"profilePhotoVisibleTo":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["everyone"]},{"dataType":"enum","enums":["contacts"]},{"dataType":"enum","enums":["nobody"]}],"required":true},"lastSeenVisibleTo":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["everyone"]},{"dataType":"enum","enums":["contacts"]},{"dataType":"enum","enums":["nobody"]}],"required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserGetAllRepoResponse": {
        "dataType": "refObject",
        "properties": {
            "users": {"dataType":"array","array":{"dataType":"refObject","ref":"IUser"},"required":true},
            "totalItems": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "currentPage": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserGetAllServiceResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"UserGetAllRepoResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserGetAllControllerParams": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"double"},
            "limit": {"dataType":"double"},
            "filter": {"dataType":"string"},
            "sort": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateNewUserServiceResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IUser","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserCreationRequestParams": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string"},
            "googleSub": {"dataType":"string"},
            "facebookSub": {"dataType":"string"},
            "username": {"dataType":"string"},
            "email": {"dataType":"string"},
            "phone_number": {"dataType":"string"},
            "profile": {"dataType":"string"},
            "gender": {"dataType":"string"},
            "age": {"dataType":"double"},
            "birthdate": {"dataType":"datetime"},
            "role": {"dataType":"string"},
            "favorites": {"dataType":"array","array":{"dataType":"refAlias","ref":"mongoose.Types.ObjectId"}},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
            "lastActive": {"dataType":"datetime"},
            "lastSeen": {"dataType":"datetime"},
            "sessions": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"lastLogin":{"dataType":"datetime","required":true},"ipAddress":{"dataType":"string","required":true},"deviceId":{"dataType":"string","required":true}}}},
            "privacySettings": {"dataType":"nestedObjectLiteral","nestedProperties":{"profilePhotoVisibleTo":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["everyone"]},{"dataType":"enum","enums":["contacts"]},{"dataType":"enum","enums":["nobody"]}],"required":true},"lastSeenVisibleTo":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["everyone"]},{"dataType":"enum","enums":["contacts"]},{"dataType":"enum","enums":["nobody"]}],"required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CvFileParams": {
        "dataType": "refObject",
        "properties": {
            "userId": {"ref":"mongoose.Types.ObjectId"},
            "cv": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"_id":{"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"enum","enums":[null]},{"dataType":"undefined"}],"required":true},"url":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CvFilePResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"CvFileParams","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CvStyleParams": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId","required":true},
            "style": {"dataType":"string","required":true},
            "thumbnail": {"dataType":"string","required":true},
            "json": {"dataType":"nestedObjectLiteral","nestedProperties":{"objects":{"dataType":"array","array":{"dataType":"any"},"required":true},"version":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BasicParams": {
        "dataType": "refObject",
        "properties": {
            "surname": {"dataType":"string"},
            "lastname": {"dataType":"string"},
            "career": {"dataType":"string"},
            "email": {"dataType":"string"},
            "dob": {"dataType":"string"},
            "address": {"dataType":"string"},
            "phonenumber": {"dataType":"string"},
            "martial": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SkillParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "percent": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExpertiseParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "proficiency": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LanguageParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "proficiency": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EducationParams": {
        "dataType": "refObject",
        "properties": {
            "academic": {"dataType":"string"},
            "school": {"dataType":"string"},
            "major": {"dataType":"string"},
            "year": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExperienceParams": {
        "dataType": "refObject",
        "properties": {
            "position": {"dataType":"string"},
            "company": {"dataType":"string"},
            "description": {"dataType":"string"},
            "year": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReferenceParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "career": {"dataType":"string"},
            "company": {"dataType":"string"},
            "email": {"dataType":"string"},
            "phonenumber": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DescriptionParams": {
        "dataType": "refObject",
        "properties": {
            "description": {"dataType":"string"},
            "strength": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CertificateParams": {
        "dataType": "refObject",
        "properties": {
            "url": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PortfolioParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserProfile": {
        "dataType": "refObject",
        "properties": {
            "basic": {"ref":"BasicParams"},
            "skills": {"dataType":"array","array":{"dataType":"intersection","subSchemas":[{"ref":"SkillParams"},{"dataType":"nestedObjectLiteral","nestedProperties":{"index":{"dataType":"double"}}}]}},
            "expertise": {"dataType":"array","array":{"dataType":"intersection","subSchemas":[{"ref":"ExpertiseParams"},{"dataType":"nestedObjectLiteral","nestedProperties":{"index":{"dataType":"double"}}}]}},
            "languages": {"dataType":"array","array":{"dataType":"intersection","subSchemas":[{"ref":"LanguageParams"},{"dataType":"nestedObjectLiteral","nestedProperties":{"index":{"dataType":"double"}}}]}},
            "educations": {"dataType":"array","array":{"dataType":"intersection","subSchemas":[{"ref":"EducationParams"},{"dataType":"nestedObjectLiteral","nestedProperties":{"index":{"dataType":"double"}}}]}},
            "experiences": {"dataType":"array","array":{"dataType":"intersection","subSchemas":[{"ref":"ExperienceParams"},{"dataType":"nestedObjectLiteral","nestedProperties":{"index":{"dataType":"double"}}}]}},
            "references": {"dataType":"array","array":{"dataType":"intersection","subSchemas":[{"ref":"ReferenceParams"},{"dataType":"nestedObjectLiteral","nestedProperties":{"index":{"dataType":"double"}}}]}},
            "descriptions": {"ref":"DescriptionParams"},
            "certificates": {"dataType":"array","array":{"dataType":"refObject","ref":"CertificateParams"}},
            "portfolio": {"dataType":"array","array":{"dataType":"refObject","ref":"PortfolioParams"}},
            "cv": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserProfileRespone": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IUserProfile","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IdParams": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId","required":true},
            "userId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CvParam": {
        "dataType": "refObject",
        "properties": {
            "cv": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UnionProfileType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"IdParams"},{"dataType":"array","array":{"dataType":"refObject","ref":"IUserProfile"}},{"ref":"BasicParams"},{"dataType":"array","array":{"dataType":"refObject","ref":"SkillParams"}},{"dataType":"array","array":{"dataType":"refObject","ref":"ExperienceParams"}},{"dataType":"array","array":{"dataType":"refObject","ref":"EducationParams"}},{"dataType":"array","array":{"dataType":"refObject","ref":"ExperienceParams"}},{"dataType":"array","array":{"dataType":"refObject","ref":"LanguageParams"}},{"ref":"DescriptionParams"},{"dataType":"array","array":{"dataType":"refObject","ref":"ReferenceParams"}},{"dataType":"array","array":{"dataType":"refObject","ref":"PortfolioParams"}},{"dataType":"array","array":{"dataType":"refObject","ref":"CertificateParams"}},{"ref":"CvParam"},{"dataType":"enum","enums":[null]},{"dataType":"undefined"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomCvResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId","required":true},
            "style": {"dataType":"string","required":true},
            "json": {"dataType":"nestedObjectLiteral","nestedProperties":{"clipPath":{"dataType":"any","required":true},"objects":{"dataType":"array","array":{"dataType":"any"},"required":true},"version":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UnionCustomCvResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"CustomCvResponse"},{"dataType":"undefined"},{"dataType":"enum","enums":[null]},{"dataType":"nestedObjectLiteral","nestedProperties":{}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserProfileResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IUser","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserUpdateRequestParams": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string"},
            "googleSub": {"dataType":"string"},
            "facebookSub": {"dataType":"string"},
            "username": {"dataType":"string"},
            "profile": {"dataType":"string"},
            "gender": {"dataType":"string"},
            "age": {"dataType":"double"},
            "role": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "companiesForJobs": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "profile": {"dataType":"string"},
            "name": {"dataType":"string"},
            "location": {"dataType":"nestedObjectLiteral","nestedProperties":{"country":{"dataType":"string"},"city":{"dataType":"string"},"address":{"dataType":"string"}}},
            "description": {"dataType":"string"},
            "contact": {"dataType":"nestedObjectLiteral","nestedProperties":{"website":{"dataType":"string"},"phone_number":{"dataType":"string"}}},
            "email": {"dataType":"string"},
            "job_openings_count": {"dataType":"double"},
            "job_closings_count": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICorporatorProfile": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "sub": {"dataType":"string"},
            "status": {"dataType":"string"},
            "name": {"dataType":"string"},
            "email": {"dataType":"string"},
            "role": {"dataType":"enum","enums":["company"]},
            "profile": {"dataType":"string"},
            "location": {"dataType":"nestedObjectLiteral","nestedProperties":{"country":{"dataType":"string"},"city":{"dataType":"string"},"address":{"dataType":"string"}}},
            "contact": {"dataType":"nestedObjectLiteral","nestedProperties":{"website":{"dataType":"string"},"phone_number":{"dataType":"string"}}},
            "social_links": {"dataType":"nestedObjectLiteral","nestedProperties":{"facebook":{"dataType":"string"},"twitter":{"dataType":"string"},"linkedin":{"dataType":"string"}}},
            "description": {"dataType":"string"},
            "employee_count": {"dataType":"double"},
            "job_openings_count": {"dataType":"double"},
            "job_closings_count": {"dataType":"double"},
            "completed": {"dataType":"double"},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CompaniesProfile": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "profile": {"dataType":"string"},
            "name": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "getMultiProfileCompanyResponse": {
        "dataType": "refObject",
        "properties": {
            "companiesProfile": {"dataType":"array","array":{"dataType":"refObject","ref":"CompaniesProfile"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "APIResponse_ICorporatorProfile_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"ICorporatorProfile"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AllJobRes": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ICorporatorProfile"},"required":true},
            "totalPage": {"dataType":"double","required":true},
            "currentPage": {"dataType":"double","required":true},
            "skip": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProfileQueries": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"double"},
            "limit": {"dataType":"double"},
            "filter": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminProfileParams": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string","required":true},
            "email": {"dataType":"string"},
            "phone_number": {"dataType":"string"},
            "profile": {"dataType":"string"},
            "role": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
<<<<<<< HEAD
        const argsUsersController_getAllUsers: Record<string, TsoaRoute.ParameterSchema> = {
                queries: {"in":"queries","name":"queries","required":true,"ref":"UserGetAllControllerParams"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getAllUsers)),

            async function UsersController_getAllUsers(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    queries: {"in":"queries","name":"queries","required":true,"ref":"UserGetAllControllerParams"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getAllUsers, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getAllUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_createUser: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserCreationRequestParams"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.post('/v1/users',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.createUser)),

            async function UsersController_createUser(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserCreationRequestParams"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_createUser, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_getMe: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users/me',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getMe)),

            async function UsersController_getMe(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getMe, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getMe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_getCvFiles: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users/cv',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getCvFiles)),

            async function UsersController_getCvFiles(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getCvFiles, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getCvFiles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_getCVStyle: Record<string, TsoaRoute.ParameterSchema> = {
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users/cvstyle',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getCVStyle)),

            async function UsersController_getCVStyle(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getCVStyle, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getCVStyle',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_getProfileByID: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                category: {"in":"query","name":"category","dataType":"string"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users/profile-detail/:userId',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getProfileByID)),

            async function UsersController_getProfileByID(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                    category: {"in":"query","name":"category","dataType":"string"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getProfileByID, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getProfileByID',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_updateUserProfile: Record<string, TsoaRoute.ParameterSchema> = {
                updateBody: {"in":"body","name":"updateBody","required":true,"ref":"IUserProfile"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                query: {"in":"query","name":"query","dataType":"string"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.put('/v1/users/profile-detail',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateUserProfile)),

            async function UsersController_updateUserProfile(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    updateBody: {"in":"body","name":"updateBody","required":true,"ref":"IUserProfile"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    query: {"in":"query","name":"query","dataType":"string"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_updateUserProfile, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'updateUserProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_getCustomCv: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users/customCv',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getCustomCv)),

            async function UsersController_getCustomCv(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getCustomCv, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getCustomCv',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_updateCustomCv: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                bodyData: {"in":"body","name":"bodyData","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"json":{"dataType":"any","required":true},"style":{"dataType":"string","required":true}}},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.put('/v1/users/customCv',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateCustomCv)),

            async function UsersController_updateCustomCv(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    bodyData: {"in":"body","name":"bodyData","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"json":{"dataType":"any","required":true},"style":{"dataType":"string","required":true}}},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_updateCustomCv, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'updateCustomCv',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_changePhoto: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                bodyData: {"in":"body","name":"bodyData","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"photo":{"dataType":"string","required":true}}},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.put('/v1/users/me/photo',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.changePhoto)),

            async function UsersController_changePhoto(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    bodyData: {"in":"body","name":"bodyData","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"photo":{"dataType":"string","required":true}}},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_changePhoto, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'changePhoto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_addFavorite: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"jobId":{"dataType":"string","required":true}}},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.post('/v1/users/me/favorites',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.addFavorite)),

            async function UsersController_addFavorite(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"jobId":{"dataType":"string","required":true}}},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_addFavorite, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'addFavorite',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_getFavorites: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users/me/favorites',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getFavorites)),

            async function UsersController_getFavorites(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getFavorites, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getFavorites',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_removeFavorite: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.delete('/v1/users/me/favorites/:jobId',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.removeFavorite)),

            async function UsersController_removeFavorite(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_removeFavorite, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'removeFavorite',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_getUserProfile: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users/:userId',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUserProfile)),

            async function UsersController_getUserProfile(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getUserProfile, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getUserProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_updateUserById: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                updateUserInfo: {"in":"body","name":"updateUserInfo","required":true,"ref":"UserUpdateRequestParams"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.put('/v1/users/:userId',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateUserById)),

            async function UsersController_updateUserById(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                    updateUserInfo: {"in":"body","name":"updateUserInfo","required":true,"ref":"UserUpdateRequestParams"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_updateUserById, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'updateUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_deleteUserById: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.delete('/v1/users/:userId',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.deleteUserById)),

            async function UsersController_deleteUserById(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_deleteUserById, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'deleteUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_getMultiProfileUser: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"usersId":{"dataType":"string"}}},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users/getMulti/Profile',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getMultiProfileUser)),

            async function UsersController_getMultiProfileUser(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"usersId":{"dataType":"string"}}},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getMultiProfileUser, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getMultiProfileUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_uploadFile: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.post('/v1/users/uploadFile',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.uploadFile)),

            async function UsersController_uploadFile(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_uploadFile, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'uploadFile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_updateCvFiles: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                bodyData: {"in":"body","name":"bodyData","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true}}},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.post('/v1/users/cv',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateCvFiles)),

            async function UsersController_updateCvFiles(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    bodyData: {"in":"body","name":"bodyData","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true}}},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_updateCvFiles, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'updateCvFiles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsUsersController_deleteCvFile: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                cvId: {"in":"path","name":"cvId","required":true,"dataType":"string"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.delete('/v1/users/cv/:cvId',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.deleteCvFile)),

            async function UsersController_deleteCvFile(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    cvId: {"in":"path","name":"cvId","required":true,"dataType":"string"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_deleteCvFile, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'deleteCvFile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsHealthController_getHealth: Record<string, TsoaRoute.ParameterSchema> = {
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/users/health',
            ...(fetchMiddlewares<RequestHandler>(HealthController)),
            ...(fetchMiddlewares<RequestHandler>(HealthController.prototype.getHealth)),

            async function HealthController_getHealth(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsHealthController_getHealth, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new HealthController();

              await templateService.apiHandler({
                methodName: 'getHealth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsCorporateController_getMultiCompanies: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"companiesId":{"dataType":"string"}}},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/corporator/companies',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getMultiCompanies)),

            async function CorporateController_getMultiCompanies(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"companiesId":{"dataType":"string"}}},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsCorporateController_getMultiCompanies, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'getMultiCompanies',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsCorporateController_getCorporateProfileWithJobs: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/corporator/profile/me',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getCorporateProfileWithJobs)),

            async function CorporateController_getCorporateProfileWithJobs(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsCorporateController_getCorporateProfileWithJobs, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'getCorporateProfileWithJobs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsCorporateController_getMultiProfileCompany: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"companiesId":{"dataType":"string"}}},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/corporator/getMulti/Profile',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getMultiProfileCompany)),

            async function CorporateController_getMultiProfileCompany(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"companiesId":{"dataType":"string"}}},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsCorporateController_getMultiProfileCompany, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'getMultiProfileCompany',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsCorporateController_createCorporateProfile: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ICorporatorProfile"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.post('/v1/corporator/profile',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.createCorporateProfile)),

            async function CorporateController_createCorporateProfile(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"ICorporatorProfile"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsCorporateController_createCorporateProfile, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'createCorporateProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsCorporateController_getCorporateProfiles: Record<string, TsoaRoute.ParameterSchema> = {
                queries: {"in":"queries","name":"queries","required":true,"ref":"ProfileQueries"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/corporator/profile',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getCorporateProfiles)),

            async function CorporateController_getCorporateProfiles(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    queries: {"in":"queries","name":"queries","required":true,"ref":"ProfileQueries"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsCorporateController_getCorporateProfiles, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'getCorporateProfiles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsCorporateController_getCorporateProfilesBySub: Record<string, TsoaRoute.ParameterSchema> = {
                corporateSub: {"in":"path","name":"corporateSub","required":true,"dataType":"string"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/corporator/profile/:corporateSub',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getCorporateProfilesBySub)),

            async function CorporateController_getCorporateProfilesBySub(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    corporateSub: {"in":"path","name":"corporateSub","required":true,"dataType":"string"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsCorporateController_getCorporateProfilesBySub, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'getCorporateProfilesBySub',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsCorporateController_updateCorporateProfile: Record<string, TsoaRoute.ParameterSchema> = {
                corporateId: {"in":"path","name":"corporateId","required":true,"dataType":"string"},
                updateDataCorporateProfile: {"in":"body","name":"updateDataCorporateProfile","required":true,"ref":"ICorporatorProfile"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.put('/v1/corporator/profile/:corporateId',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.updateCorporateProfile)),

            async function CorporateController_updateCorporateProfile(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    corporateId: {"in":"path","name":"corporateId","required":true,"dataType":"string"},
                    updateDataCorporateProfile: {"in":"body","name":"updateDataCorporateProfile","required":true,"ref":"ICorporatorProfile"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsCorporateController_updateCorporateProfile, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'updateCorporateProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsCorporateController_deleteCorporateProfile: Record<string, TsoaRoute.ParameterSchema> = {
                corporateSub: {"in":"path","name":"corporateSub","required":true,"dataType":"string"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.delete('/v1/corporator/profile/:corporateSub',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.deleteCorporateProfile)),

            async function CorporateController_deleteCorporateProfile(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    corporateSub: {"in":"path","name":"corporateSub","required":true,"dataType":"string"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsCorporateController_deleteCorporateProfile, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'deleteCorporateProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsAdminController_getAdminProfilesBySub: Record<string, TsoaRoute.ParameterSchema> = {
                adminSub: {"in":"path","name":"adminSub","required":true,"dataType":"string"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/admin/profile/:adminSub',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getAdminProfilesBySub)),

            async function AdminController_getAdminProfilesBySub(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    adminSub: {"in":"path","name":"adminSub","required":true,"dataType":"string"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getAdminProfilesBySub, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getAdminProfilesBySub',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
<<<<<<< HEAD
        const argsAdminController_getMe: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
=======
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203
        app.get('/v1/admin/me',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getMe)),

            async function AdminController_getMe(request: ExRequest, response: ExResponse, next: any) {
<<<<<<< HEAD
=======
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
<<<<<<< HEAD
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getMe, request, response });
=======
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
>>>>>>> 9e770b2ee9a981595c9503b4c62405b3618c1203

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'getMe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
