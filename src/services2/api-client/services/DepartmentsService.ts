/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CommonRequestDto } from '../models/CommonRequestDto';
import type { KVPair } from '../models/KVPair';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepartmentsService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVDepartmentsSubDepartments(
        version: string,
        tenant?: string,
        requestBody?: CommonRequestDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Departments/subDepartments',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns KVPair OK
     * @throws ApiError
     */
    public static getApiVDepartmentsDepartmentKVlist(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Departments/departmentKVlist',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
