/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ActivePolicyCountResponseDTOResultModel } from '../models/ActivePolicyCountResponseDTOResultModel';
import type { CreateEmployeePolicyCommand } from '../models/CreateEmployeePolicyCommand';
import type { DeleteEmployeePolicyCommand } from '../models/DeleteEmployeePolicyCommand';
import type { DeleteEmployeePolicyResponseDtoListResultModel } from '../models/DeleteEmployeePolicyResponseDtoListResultModel';
import type { EmployeePolicySaveResponseDTOResultModel } from '../models/EmployeePolicySaveResponseDTOResultModel';
import type { EmployeePolicySearchFilterRequestDto } from '../models/EmployeePolicySearchFilterRequestDto';
import type { EmployeePolicySearchFilterResponseDtoPagedResponseDto } from '../models/EmployeePolicySearchFilterResponseDtoPagedResponseDto';
import type { GetEmployeePolicyByIdResponseDtoResultModel } from '../models/GetEmployeePolicyByIdResponseDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { UpdateEmployeePolicyCommand } from '../models/UpdateEmployeePolicyCommand';
import type { UpdateEmployeePolicyResponseDTOResultModel } from '../models/UpdateEmployeePolicyResponseDTOResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmployeePolicyService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns DeleteEmployeePolicyResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVEmployeePolicyDelete(
        version: string,
        tenant?: string,
        requestBody?: DeleteEmployeePolicyCommand,
    ): CancelablePromise<DeleteEmployeePolicyResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/EmployeePolicy/Delete',
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
     * @returns EmployeePolicySearchFilterResponseDtoPagedResponseDto OK
     * @throws ApiError
     */
    public static postApiVEmployeePolicyList(
        version: string,
        tenant?: string,
        requestBody?: EmployeePolicySearchFilterRequestDto,
    ): CancelablePromise<EmployeePolicySearchFilterResponseDtoPagedResponseDto> {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicyGetCreatedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/GetCreatedby',
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
    public static getApiVEmployeePolicyCategory(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/Category',
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
     * @param categoryId
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicySubCategory(
        version: string,
        categoryId?: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/SubCategory',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'CategoryId': categoryId,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicyYear(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/Year',
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
    public static getApiVEmployeePolicyGetModifiedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/GetModifiedby',
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
     * @returns EmployeePolicySaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVEmployeePolicy(
        version: string,
        tenant?: string,
        requestBody?: CreateEmployeePolicyCommand,
    ): CancelablePromise<EmployeePolicySaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
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
     * @param requestBody
     * @returns UpdateEmployeePolicyResponseDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVEmployeePolicy(
        version: string,
        tenant?: string,
        requestBody?: UpdateEmployeePolicyCommand,
    ): CancelablePromise<UpdateEmployeePolicyResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
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
     * @param id
     * @param version
     * @param tenant
     * @returns GetEmployeePolicyByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicy(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GetEmployeePolicyByIdResponseDtoResultModel> {
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
     * @param version
     * @param date
     * @param tenant
     * @returns ActivePolicyCountResponseDTOResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicyActivePolicyCount(
        version: string,
        date?: string,
        tenant?: string,
    ): CancelablePromise<ActivePolicyCountResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/ActivePolicyCount',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'Date': date,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVEmployeePolicyGetDependantList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/GetDependantList',
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
    public static getApiVEmployeePolicyGetPrefixList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmployeePolicy/GetPrefixList',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
