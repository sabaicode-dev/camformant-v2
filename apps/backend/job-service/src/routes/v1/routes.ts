/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { JobController } from './../../controllers/job.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HealthController } from './../../controllers/health.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "mongoose.Types.ObjectId": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WorkMode": {
        "dataType": "refEnum",
        "enums": ["Remote","On-Site","Hybrid"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EmploymentType": {
        "dataType": "refEnum",
        "enums": ["Contract","Internship"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EmploymentSchedule": {
        "dataType": "refEnum",
        "enums": ["Full-Time","Part-Time","Flexible-Hours","Project-Based"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IJob": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "companyId": {"ref":"mongoose.Types.ObjectId"},
            "profile": {"dataType":"string"},
            "title": {"dataType":"string"},
            "position": {"dataType":"array","array":{"dataType":"string"}},
            "workMode": {"dataType":"array","array":{"dataType":"refEnum","ref":"WorkMode"}},
            "location": {"dataType":"string"},
            "requirement": {"dataType":"string"},
            "description": {"dataType":"string"},
            "address": {"dataType":"string"},
            "min_salary": {"dataType":"double"},
            "max_salary": {"dataType":"double"},
            "job_opening": {"dataType":"double"},
            "type": {"dataType":"array","array":{"dataType":"refEnum","ref":"EmploymentType"}},
            "schedule": {"dataType":"array","array":{"dataType":"refEnum","ref":"EmploymentSchedule"}},
            "required_experience": {"dataType":"array","array":{"dataType":"string"}},
            "benefit": {"dataType":"array","array":{"dataType":"string"}},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
            "deadline": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "APIResponse_IJob_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IJob"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatusMode": {
        "dataType": "refEnum",
        "enums": ["Apply","Review","Shortlist","Interview","Accept"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApplyUserInfo": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "profile": {"dataType":"string","required":true},
            "status": {"ref":"StatusMode","required":true},
            "cv": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApplyCompanyResp": {
        "dataType": "refObject",
        "properties": {
            "startDate": {"dataType":"datetime"},
            "interviewDate": {"dataType":"string"},
            "interviewLocation": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JobApplyResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId"},
            "userId": {"dataType":"string","required":true},
            "jobId": {"dataType":"string","required":true},
            "userInfo": {"ref":"ApplyUserInfo","required":true},
            "companyResponse": {"ref":"ApplyCompanyResp"},
            "appliedAt": {"dataType":"datetime"},
            "statusDate": {"dataType":"nestedObjectLiteral","nestedProperties":{"Apply":{"dataType":"datetime"},"Review":{"dataType":"datetime"},"Shortlist":{"dataType":"datetime"},"Interview":{"dataType":"datetime"},"Accept":{"dataType":"datetime"}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PostJobApplyBody": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "jobId": {"dataType":"string","required":true},
            "userInfo": {"ref":"ApplyUserInfo","required":true},
            "companyResponse": {"ref":"ApplyCompanyResp"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JobParams": {
        "dataType": "refObject",
        "properties": {
            "companyId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "title": {"dataType":"string","required":true},
            "position": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "workMode": {"dataType":"array","array":{"dataType":"refEnum","ref":"WorkMode"},"required":true},
            "location": {"dataType":"string","required":true},
            "requirement": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "address": {"dataType":"string","required":true},
            "min_salary": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[0]}],"required":true},
            "max_salary": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[5000]}],"required":true},
            "job_opening": {"dataType":"double"},
            "type": {"dataType":"array","array":{"dataType":"refEnum","ref":"EmploymentType"}},
            "schedule": {"dataType":"array","array":{"dataType":"refEnum","ref":"EmploymentSchedule"}},
            "required_experience": {"dataType":"array","array":{"dataType":"string"}},
            "createdAt": {"dataType":"datetime","required":true},
            "benefit": {"dataType":"array","array":{"dataType":"string"}},
            "deadline": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
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
    "returnJobs": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "companyId": {"ref":"mongoose.Types.ObjectId"},
            "title": {"dataType":"string"},
            "position": {"dataType":"array","array":{"dataType":"string"}},
            "workMode": {"dataType":"array","array":{"dataType":"refEnum","ref":"WorkMode"}},
            "location": {"dataType":"string"},
            "requirement": {"dataType":"string"},
            "description": {"dataType":"string"},
            "address": {"dataType":"string"},
            "min_salary": {"dataType":"double"},
            "max_salary": {"dataType":"double"},
            "job_opening": {"dataType":"double"},
            "type": {"dataType":"array","array":{"dataType":"refEnum","ref":"EmploymentType"}},
            "schedule": {"dataType":"array","array":{"dataType":"refEnum","ref":"EmploymentSchedule"}},
            "required_experience": {"dataType":"array","array":{"dataType":"string"}},
            "benefit": {"dataType":"array","array":{"dataType":"string"}},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
            "deadline": {"dataType":"datetime"},
            "company": {"ref":"companiesForJobs"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JobGetAllControllerParams": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"double"},
            "limit": {"dataType":"string"},
            "filter": {"dataType":"string"},
            "sort": {"dataType":"string"},
            "search": {"dataType":"string"},
            "userFav": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "APIResponse_IJob-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IJob"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "APIResponse_string-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetApplyJobResLimit": {
        "dataType": "refObject",
        "properties": {
            "applyData": {"dataType":"array","array":{"dataType":"refObject","ref":"JobApplyResponse"},"required":true},
            "totalPages": {"dataType":"double","required":true},
            "currentPage": {"dataType":"double","required":true},
            "skip": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetJobApplyResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId"},
            "userId": {"dataType":"string","required":true},
            "jobId": {"dataType":"string","required":true},
            "userInfo": {"ref":"ApplyUserInfo","required":true},
            "companyResponse": {"ref":"ApplyCompanyResp"},
            "appliedAt": {"dataType":"datetime"},
            "statusDate": {"dataType":"nestedObjectLiteral","nestedProperties":{"Apply":{"dataType":"datetime"},"Review":{"dataType":"datetime"},"Shortlist":{"dataType":"datetime"},"Interview":{"dataType":"datetime"},"Accept":{"dataType":"datetime"}}},
            "jobInfo": {"ref":"IJob","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JobApplyQueriesController": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string"},
            "jobId": {"dataType":"string"},
            "page": {"dataType":"double"},
            "limit": {"dataType":"double"},
            "filter": {"dataType":"string"},
            "sort": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BodyUpdateJobApply": {
        "dataType": "refObject",
        "properties": {
            "status": {"ref":"StatusMode","required":true},
            "startDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "interviewDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "interviewLocation": {"dataType":"string"},
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


    
        app.post('/v1/jobs/job',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.postIJob)),

            async function JobController_postIJob(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"IJob"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'postIJob',
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
        app.post('/v1/jobs/jobApply',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.postJobApply)),

            async function JobController_postJobApply(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"PostJobApplyBody"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'postJobApply',
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
        app.post('/v1/jobs',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.createJob)),

            async function JobController_createJob(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"body","name":"req","required":true,"ref":"JobParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'createJob',
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
        app.get('/v1/jobs',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.getAllJobs)),

            async function JobController_getAllJobs(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    queries: {"in":"queries","name":"queries","required":true,"ref":"JobGetAllControllerParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'getAllJobs',
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
        app.get('/v1/jobs/corporator',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.getAllJobsWithCorporator)),

            async function JobController_getAllJobsWithCorporator(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'getAllJobsWithCorporator',
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
        app.get('/v1/jobs/search-history',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.getSearchHistory)),

            async function JobController_getSearchHistory(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'getSearchHistory',
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
        app.get('/v1/jobs/search-trending',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.getSearchTrending)),

            async function JobController_getSearchTrending(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'getSearchTrending',
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
        app.get('/v1/jobs/jobApply',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.getJobApply)),

            async function JobController_getJobApply(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    queries: {"in":"queries","name":"queries","required":true,"ref":"JobApplyQueriesController"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'getJobApply',
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
        app.put('/v1/jobs/jobApply/:applyId',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.putJobApply)),

            async function JobController_putJobApply(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    applyId: {"in":"path","name":"applyId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"BodyUpdateJobApply"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'putJobApply',
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
        app.delete('/v1/jobs/jobApply/deleteMany/:jobId',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.deleteManyJobApply)),

            async function JobController_deleteManyJobApply(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'deleteManyJobApply',
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
        app.delete('/v1/jobs/jobApply/:applyId',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.deleteJobApply)),

            async function JobController_deleteJobApply(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    applyId: {"in":"path","name":"applyId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'deleteJobApply',
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
        app.get('/v1/jobs/:jobId',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.getJobById)),

            async function JobController_getJobById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'getJobById',
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
        app.put('/v1/jobs/:jobId',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.updateJobById)),

            async function JobController_updateJobById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
                    updateDatJob: {"in":"body","name":"updateDatJob","required":true,"ref":"JobParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'updateJobById',
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
        app.get('/v1/jobs/health',
            ...(fetchMiddlewares<RequestHandler>(HealthController)),
            ...(fetchMiddlewares<RequestHandler>(HealthController.prototype.getHealth)),

            async function HealthController_getHealth(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

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

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
