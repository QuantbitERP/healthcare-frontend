/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { EmployeeDependantRelationDto } from '../models/EmployeeDependantRelationDto';
import type { EmployeePolicyCountDto } from '../models/EmployeePolicyCountDto';
import type { EmployeePolicyDto } from '../models/EmployeePolicyDto';
import type { EmployeePolicyFilter } from '../models/EmployeePolicyFilter';
import type { EmployeePolicyGetDto } from '../models/EmployeePolicyGetDto';
import type { EmployeePolicySaveDto } from '../models/EmployeePolicySaveDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmployeePolicyService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns EmployeePolicyDto OK
     * @throws ApiError
     */
    public static postApiVEmployeePolicyList(
        version: string,
        tenant?: string,
        requestBody?: EmployeePolicyFilter,
    ): CancelablePromise<Array<EmployeePolicyDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/EmployeePolicy/list',
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
     * @returns EmployeePolicyDto OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicyLastPolicy(
        version: string,
        tenant?: string,
    ): CancelablePromise<EmployeePolicyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/lastPolicy',
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
     * @returns EmployeeDependantRelationDto OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicyRelationList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<EmployeeDependantRelationDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/relationList',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns EmployeePolicyGetDto OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicy(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<EmployeePolicyGetDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/{id}',
            path: {
                'id': id,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVEmployeePolicy(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: EmployeePolicySaveDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/EmployeePolicy/{id}',
            path: {
                'id': id,
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
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVEmployeePolicySave(
        version: string,
        tenant?: string,
        requestBody?: EmployeePolicySaveDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/EmployeePolicy/save',
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
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVEmployeePolicy(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/EmployeePolicy',
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
     * @returns EmployeePolicyCountDto OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicyEmployeePolicyCount(
        version: string,
        tenant?: string,
    ): CancelablePromise<EmployeePolicyCountDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/employeePolicyCount',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
