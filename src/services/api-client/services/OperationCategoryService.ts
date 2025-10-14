/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { OperationCategoryDto } from '../models/OperationCategoryDto';
import type { OperationCategoryListDto } from '../models/OperationCategoryListDto';
import type { OperationCategoryListRequestDto } from '../models/OperationCategoryListRequestDto';
import type { OperationCategoryRequestDto } from '../models/OperationCategoryRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { OperationCategoryList } from '@/store/operation_category/types';
import { Types } from '../models/DoctorDto';
import { CommonResponseDto } from '../models/RateListDto';
export class OperationCategoryService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns OperationCategoryPageListDto OK
     * @throws ApiError
     */
    public static postApiVOperationCategoryList(
        version: string,
        tenant?: string,
        requestBody?: OperationCategoryListRequestDto,
    ): CancelablePromise<OperationCategoryList> {
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
     * @param id
     * @param version
     * @param tenant
     * @returns OperationCategoryDto OK
     * @throws ApiError
     */
    public static getApiVOperationCategory(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<OperationCategoryDto> {
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
     * @param id
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVOperationCategory(
        version: string,
        tenant?: string,
        requestBody?: OperationCategoryRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/OperationCategory/update',
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
    public static postApiVOperationCategory(
        version: string,
        tenant?: string,
        requestBody?: OperationCategoryRequestDto,
    ): CancelablePromise<any> {
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
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVOperationCategory(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
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
     * @returns OperationCategoryListDto OK
     * @throws ApiError
     */
    public static getApiVOperationCategoryOperationCategories(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<OperationCategoryListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OperationCategory/operationCategories',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }

    public static GetStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<Types> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Common/status',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },   
            mediaType: 'application/json',
        });
    }

    /**
     * Get Created By List for Operation Category
     */
    public static getApiV1OperationCategoryGetCreatedByList(): CancelablePromise<CommonResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/OperationCategory/GetCreatedByList',
        });
    }
    /**
     * Get Modified By List for Operation Category
     */
    public static getApiV1OperationCategoryGetModifiedBy(): CancelablePromise<CommonResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/OperationCategory/GetModifiedBy',
        });
    }
    /**
     * Get Status List for Operation Category
     */
    public static getApiV1CommonStatus(): CancelablePromise<CommonResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Common/status',
        });
    }
}
