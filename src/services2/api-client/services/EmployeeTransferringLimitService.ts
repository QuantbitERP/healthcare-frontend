/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateEmployeeTransferringLimitCommand } from '../models/CreateEmployeeTransferringLimitCommand';
import type { DeleteEmployeeTransferringLimitCommand } from '../models/DeleteEmployeeTransferringLimitCommand';
import type { DeleteEmployeeTransferringLimitResponseDtoListResultModel } from '../models/DeleteEmployeeTransferringLimitResponseDtoListResultModel';
import type { EmployeeTransferingLimitsListRequestDto } from '../models/EmployeeTransferingLimitsListRequestDto';
import type { EmployeeTransferingLimitsListResponseDtoPagedResponseDtoResultModel } from '../models/EmployeeTransferingLimitsListResponseDtoPagedResponseDtoResultModel';
import type { EmployeeTransferringLimitSaveResponseDtoResultModel } from '../models/EmployeeTransferringLimitSaveResponseDtoResultModel';
import type { GetEmployeeTransferringLimitByIdResponseDtoResultModel } from '../models/GetEmployeeTransferringLimitByIdResponseDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmployeeTransferringLimitService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns DeleteEmployeeTransferringLimitResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVEmployeeTransferringLimitDelete(
        version: string,
        tenant?: string,
        requestBody?: DeleteEmployeeTransferringLimitCommand,
    ): CancelablePromise<DeleteEmployeeTransferringLimitResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/EmployeeTransferringLimit/Delete',
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
     * @returns GetEmployeeTransferringLimitByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeeTransferringLimit(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GetEmployeeTransferringLimitByIdResponseDtoResultModel> {
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
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeeTransferringLimitGetCreatedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeeTransferringLimit/getCreatedby',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeeTransferringLimitGetModifiedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeeTransferringLimit/getModifiedby',
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
     * @returns EmployeeTransferingLimitsListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVEmployeeTransferringLimitList(
        version: string,
        tenant?: string,
        requestBody?: EmployeeTransferingLimitsListRequestDto,
    ): CancelablePromise<EmployeeTransferingLimitsListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/EmployeeTransferringLimit/List',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeeTransferringLimitEmployeeDesignationEnum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeeTransferringLimit/EmployeeDesignationEnum',
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
     * @returns EmployeeTransferringLimitSaveResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVEmployeeTransferringLimit(
        version: string,
        tenant?: string,
        requestBody?: CreateEmployeeTransferringLimitCommand,
    ): CancelablePromise<EmployeeTransferringLimitSaveResponseDtoResultModel> {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeeTransferringLimitEmployeeLimitTransferToEnum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeeTransferringLimit/EmployeeLimitTransferToEnum',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
