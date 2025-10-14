/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelOperationCategoryDtoListResultModel } from '../models/CancelOperationCategoryDtoListResultModel';
import type { CreateOperationCategoryCommand } from '../models/CreateOperationCategoryCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { OperationCategoryGetByIdResponseDtoResultModel } from '../models/OperationCategoryGetByIdResponseDtoResultModel';
import type { OperationCategoryListRequestDto } from '../models/OperationCategoryListRequestDto';
import type { OperationCategoryPageListResponseDtoPagedResponseDtoResultModel } from '../models/OperationCategoryPageListResponseDtoPagedResponseDtoResultModel';
import type { OperationCategorySaveResponceDtoResultModel } from '../models/OperationCategorySaveResponceDtoResultModel';
import type { UpdateOperationCategoryCommand } from '../models/UpdateOperationCategoryCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OperationCategoryService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns OperationCategorySaveResponceDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVOperationCategorySave(
        version: string,
        tenant?: string,
        requestBody?: CreateOperationCategoryCommand,
    ): CancelablePromise<OperationCategorySaveResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OperationCategory/save',
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
     * @returns OperationCategoryGetByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVOperationCategory(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<OperationCategoryGetByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OperationCategory/{id}',
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
     * @param requestBody
     * @returns OperationCategorySaveResponceDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVOperationCategoryUpdate(
        version: string,
        tenant?: string,
        requestBody?: UpdateOperationCategoryCommand,
    ): CancelablePromise<OperationCategorySaveResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/OperationCategory/Update',
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
     * @returns OperationCategoryPageListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVOperationCategoryList(
        version: string,
        tenant?: string,
        requestBody?: OperationCategoryListRequestDto,
    ): CancelablePromise<OperationCategoryPageListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OperationCategory/list',
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
    public static getApiVOperationCategoryGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OperationCategory/GetModifiedBy',
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
     * @returns CancelOperationCategoryDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVOperationCategory(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<CancelOperationCategoryDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/OperationCategory',
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
    public static getApiVOperationCategoryGetCreatedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OperationCategory/GetCreatedByList',
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
    public static getApiVOperationCategoryGetOperationCategoryDropdownList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OperationCategory/getOperationCategoryDropdownList',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
