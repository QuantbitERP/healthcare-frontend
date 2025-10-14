/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DepartmentListDto } from '../models/DepartmentListDto';
import type { SubDepartmentListDto } from '../models/SubDepartmentListDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import {  KVPairListResultModelResultModel } from '@/api-client';
export class DepartmentsService {
    /**
     * @param version
     * @param tenant
     * @returns DepartmentListDto OK
     * @throws ApiError
     */
    public static getApiVDepartmentsDepartments(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<DepartmentListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Departments/departments',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns SubDepartmentListDto OK
     * @throws ApiError
     */
    public static getApiVDepartmentsSubDepartments(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<SubDepartmentListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Departments/subDepartments',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
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
    ): CancelablePromise<KVPairListResultModelResultModel> {
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
