/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelRoomCategoryDtoListResultModel } from '../models/CancelRoomCategoryDtoListResultModel';
import type { CreateRoomCategoryCommand } from '../models/CreateRoomCategoryCommand';
import type { GuidNullableResultModel } from '../models/GuidNullableResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { RoomCategoriesWithSearchAndFilterResponseDtoPagedResponseDtoResultModel } from '../models/RoomCategoriesWithSearchAndFilterResponseDtoPagedResponseDtoResultModel';
import type { RoomCategoryGetByIdResponceDtoResultModel } from '../models/RoomCategoryGetByIdResponceDtoResultModel';
import type { RoomCategoryListRequestDto } from '../models/RoomCategoryListRequestDto';
import type { RoomCategoryResponceDTOResultModel } from '../models/RoomCategoryResponceDTOResultModel';
import type { RoomCategorySaveRequestDTOResultModel } from '../models/RoomCategorySaveRequestDTOResultModel';
import type { UpdateRoomCategoryCommand } from '../models/UpdateRoomCategoryCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoomCategoryService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVRoomCategoryRoomcategoryStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RoomCategory/roomcategory/status',
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
    public static getApiVRoomCategoryGetCreatedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RoomCategory/GetCreatedby',
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
    public static getApiVRoomCategoryGetModifiedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RoomCategory/GetModifiedby',
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
     * @returns RoomCategoriesWithSearchAndFilterResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVRoomCategoryList(
        version: string,
        tenant?: string,
        requestBody?: RoomCategoryListRequestDto,
    ): CancelablePromise<RoomCategoriesWithSearchAndFilterResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RoomCategory/list',
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
     * @returns RoomCategorySaveRequestDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVRoomCategory(
        version: string,
        tenant?: string,
        requestBody?: CreateRoomCategoryCommand,
    ): CancelablePromise<RoomCategorySaveRequestDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RoomCategory',
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
     * @returns CancelRoomCategoryDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVRoomCategory(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<CancelRoomCategoryDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/RoomCategory',
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
     * @returns RoomCategoryResponceDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVRoomCategory(
        version: string,
        tenant?: string,
        requestBody?: UpdateRoomCategoryCommand,
    ): CancelablePromise<RoomCategoryResponceDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/RoomCategory',
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
     * @returns RoomCategoryGetByIdResponceDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVRoomCategoryRoomCategory(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<RoomCategoryGetByIdResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RoomCategory/roomCategory/{id}',
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
     * @returns GuidNullableResultModel OK
     * @throws ApiError
     */
    public static getApiVRoomCategoryOpdBillingclass(
        version: string,
        tenant?: string,
    ): CancelablePromise<GuidNullableResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RoomCategory/OPDBillingclass',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
