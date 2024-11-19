/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { JobController } from './../../controllers/job.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HealthController } from './../../controllers/health.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CorporateController } from './../../controllers/corporate.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CompanyController } from './../../controllers/company.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');




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
            "companyId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
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
    "JobParams": {
        "dataType": "refObject",
        "properties": {
            "companyId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},
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
            "benefit": {"dataType":"array","array":{"dataType":"string"}},
            "deadline": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationResponse_IJob_": {
        "dataType": "refObject",
        "properties": {
            "totalItems": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "currentPage": {"dataType":"double","required":true},
        },
        "additionalProperties": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"IJob"}},{"dataType":"double"}]},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "APIResponse_PaginationResponse_IJob__": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"PaginationResponse_IJob_"},
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
    "APIResponse_string-Array_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICorporateProfile": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "company_name": {"dataType":"string"},
            "profile": {"dataType":"string"},
            "location": {"dataType":"nestedObjectLiteral","nestedProperties":{"country":{"dataType":"string"},"city":{"dataType":"string"},"address":{"dataType":"string"}}},
            "contact": {"dataType":"nestedObjectLiteral","nestedProperties":{"website":{"dataType":"string"},"phone_number":{"dataType":"string"},"email":{"dataType":"string"}}},
            "description": {"dataType":"string"},
            "social_links": {"dataType":"nestedObjectLiteral","nestedProperties":{"facebook":{"dataType":"string"},"twitter":{"dataType":"string"},"linkedin":{"dataType":"string"}}},
            "industry": {"dataType":"string"},
            "employee_count": {"dataType":"double"},
            "job_openings_count": {"dataType":"double"},
            "job_closings_count": {"dataType":"double"},
            "timestamps": {"dataType":"nestedObjectLiteral","nestedProperties":{"updated_at":{"dataType":"datetime"},"created_at":{"dataType":"datetime"}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "APIResponse_ICorporateProfile_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"ICorporateProfile"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICompany": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "name": {"dataType":"string"},
            "location": {"dataType":"string"},
            "bio": {"dataType":"string"},
            "profile": {"dataType":"string"},
            "email": {"dataType":"string"},
            "phone_number": {"dataType":"string"},
            "job_openings": {"dataType":"double"},
            "job_closings": {"dataType":"double"},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "APIResponse_ICompany_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"ICompany"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
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
        app.delete('/v1/jobs/:jobId',
            ...(fetchMiddlewares<RequestHandler>(JobController)),
            ...(fetchMiddlewares<RequestHandler>(JobController.prototype.deleteJobById)),

            async function JobController_deleteJobById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JobController();

              await templateService.apiHandler({
                methodName: 'deleteJobById',
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
        app.post('/v1/corporate/job',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.postIJob)),

            async function CorporateController_postIJob(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"IJob"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CorporateController();

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
        app.get('/v1/corporate/job',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getAllJobs)),

            async function CorporateController_getAllJobs(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    queries: {"in":"queries","name":"queries","required":true,"ref":"JobGetAllControllerParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'getAllJobs',
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
        app.get('/v1/corporate/job/:jobId',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getJobById)),

            async function CorporateController_getJobById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'getJobById',
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
        app.put('/v1/corporate/job/:jobId',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.updateJobById)),

            async function CorporateController_updateJobById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
                    updateDatJob: {"in":"body","name":"updateDatJob","required":true,"ref":"JobParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'updateJobById',
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
        app.delete('/v1/corporate/job/:jobId',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.deleteJobById)),

            async function CorporateController_deleteJobById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'deleteJobById',
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
        app.post('/v1/corporate/profile',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.createCorporateProfile)),

            async function CorporateController_createCorporateProfile(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"ICorporateProfile"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

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
        app.get('/v1/corporate/profile',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getCorporateProfiles)),

            async function CorporateController_getCorporateProfiles(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

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
        app.get('/v1/corporate/profile/:corporateId',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getCorporateProfilesById)),

            async function CorporateController_getCorporateProfilesById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    corporateId: {"in":"path","name":"corporateId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CorporateController();

              await templateService.apiHandler({
                methodName: 'getCorporateProfilesById',
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
        app.put('/v1/corporate/profile/:corporateId',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.updateCorporateProfile)),

            async function CorporateController_updateCorporateProfile(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    corporateId: {"in":"path","name":"corporateId","required":true,"dataType":"string"},
                    updateDataCorporateProfile: {"in":"body","name":"updateDataCorporateProfile","required":true,"ref":"ICorporateProfile"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

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
        app.delete('/v1/corporate/profile/:corporateId',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.deleteCorporateProfile)),

            async function CorporateController_deleteCorporateProfile(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    corporateId: {"in":"path","name":"corporateId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

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
        app.get('/v1/corporate',
            ...(fetchMiddlewares<RequestHandler>(CorporateController)),
            ...(fetchMiddlewares<RequestHandler>(CorporateController.prototype.getCorporateProfileWithJobs)),

            async function CorporateController_getCorporateProfileWithJobs(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    recentJobsLimit: {"in":"query","name":"recentJobsLimit","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

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
        app.post('/v1/companies',
            upload.fields([
                {
                    name: "profile",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.createCompany)),

            async function CompanyController_createCompany(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    profile: {"in":"formData","name":"profile","required":true,"dataType":"file"},
                    name: {"in":"formData","name":"name","required":true,"dataType":"string"},
                    location: {"in":"formData","name":"location","required":true,"dataType":"string"},
                    bio: {"in":"formData","name":"bio","required":true,"dataType":"string"},
                    email: {"in":"formData","name":"email","required":true,"dataType":"string"},
                    phone_number: {"in":"formData","name":"phone_number","required":true,"dataType":"string"},
                    job_openings: {"in":"formData","name":"job_openings","required":true,"dataType":"string"},
                    job_closings: {"in":"formData","name":"job_closings","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'createCompany',
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
        app.get('/v1/companies',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.getAllCompany)),

            async function CompanyController_getAllCompany(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'getAllCompany',
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
        app.get('/v1/companies/getMulti/Profile',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.getMultiProfileCompany)),

            async function CompanyController_getMultiProfileCompany(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"companiesId":{"dataType":"string"}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

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
        app.get('/v1/companies/:companyId',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.findCompanyById)),

            async function CompanyController_findCompanyById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    companyId: {"in":"path","name":"companyId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'findCompanyById',
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
        app.put('/v1/companies/:companyId',
            upload.fields([
                {
                    name: "profile",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.updateCompanyById)),

            async function CompanyController_updateCompanyById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    companyId: {"in":"path","name":"companyId","required":true,"dataType":"string"},
                    profile: {"in":"formData","name":"profile","required":true,"dataType":"file"},
                    name: {"in":"formData","name":"name","required":true,"dataType":"string"},
                    location: {"in":"formData","name":"location","required":true,"dataType":"string"},
                    bio: {"in":"formData","name":"bio","required":true,"dataType":"string"},
                    email: {"in":"formData","name":"email","required":true,"dataType":"string"},
                    phone_number: {"in":"formData","name":"phone_number","required":true,"dataType":"string"},
                    job_openings: {"in":"formData","name":"job_openings","required":true,"dataType":"string"},
                    job_closings: {"in":"formData","name":"job_closings","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'updateCompanyById',
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
        app.delete('/v1/companies/:companyId',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.deleteCompanyById)),

            async function CompanyController_deleteCompanyById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    companyId: {"in":"path","name":"companyId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'deleteCompanyById',
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
