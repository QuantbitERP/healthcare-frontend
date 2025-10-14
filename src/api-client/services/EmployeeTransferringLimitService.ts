/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { EmployeeCategoryDto } from '../models/EmployeeCategoryDto';
import type { EmployeeTransferringLimitDto } from '../models/EmployeeTransferringLimitDto';
import type { EmployeeTransferringLimitRequestDto } from '../models/EmployeeTransferringLimitRequestDto';
import type { EmployeeTransferringLimitSearchRequestDto } from '../models/EmployeeTransferringLimitSearchRequestDto';
import type { EmployeeTransferringLimitSearchResponseDto } from '../models/EmployeeTransferringLimitSearchResponseDto';
import type { EmployeeTransferringLimitUpdateDto } from '../models/EmployeeTransferringLimitUpdateDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmployeeTransferringLimitService {
    /**
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVEmployeeTransferringLimitEmployeeCategoryChangeLogList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeeTransferringLimit/employeeCategoryChangeLogList',
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
     * @returns EmployeeCategoryDto OK
     * @throws ApiError
     */
    public static getApiVEmployeeTransferringLimitEmployeeCategories(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<EmployeeCategoryDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeeTransferringLimit/employeeCategories',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVEmployeeTransferringLimitList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeeTransferringLimit/list',
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
     * @param requestBody
     * @returns EmployeeTransferringLimitSearchResponseDto OK
     * @throws ApiError
     */
    public static postApiVEmployeeTransferringLimitGetEmployeeTransferringLimitFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: EmployeeTransferringLimitSearchRequestDto,
    ): CancelablePromise<EmployeeTransferringLimitSearchResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/EmployeeTransferringLimit/getEmployeeTransferringLimitFilterWithSearch',
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
     * @param id
     * @param version
     * @param tenant
     * @returns EmployeeTransferringLimitDto OK
     * @throws ApiError
     */
    public static getApiVEmployeeTransferringLimit(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<EmployeeTransferringLimitDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeeTransferringLimit/{id}',
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
    public static putApiVEmployeeTransferringLimit(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: EmployeeTransferringLimitUpdateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/EmployeeTransferringLimit/{id}',
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
    public static postApiVEmployeeTransferringLimit(
        version: string,
        tenant?: string,
        requestBody?: EmployeeTransferringLimitRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/EmployeeTransferringLimit',
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
    public static deleteApiVEmployeeTransferringLimit(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/EmployeeTransferringLimit',
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
}
