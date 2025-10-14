/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelRoomCategoryDtoResultModel } from '../models/CancelRoomCategoryDtoResultModel';
import type { CreateRoomCategoryCommand } from '../models/CreateRoomCategoryCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { RoomCategoriesWithSearchAndFilterResponseDtoResultModel } from '../models/RoomCategoriesWithSearchAndFilterResponseDtoResultModel';
import type { RoomCategoryListRequestDto } from '../models/RoomCategoryListRequestDto';
import type { RoomCategoryMasterDtoResultModel } from '../models/RoomCategoryMasterDtoResultModel';
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
     * @returns RoomCategoriesWithSearchAndFilterResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVRoomCategoryRoomCategoryByFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: RoomCategoryListRequestDto,
    ): CancelablePromise<RoomCategoriesWithSearchAndFilterResponseDtoResultModel> {
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
    public static postApiVRoomCategorySave(
        version: string,
        tenant?: string,
        requestBody?: CreateRoomCategoryCommand,
    ): CancelablePromise<RoomCategorySaveRequestDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RoomCategory/',
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
     * @returns RoomCategoryMasterDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVRoomCategoryRoomCategory(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<RoomCategoryMasterDtoResultModel> {
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
     * @param id
     * @param version
     * @param tenant
     * @returns CancelRoomCategoryDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVRoomCategoryDelete(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<CancelRoomCategoryDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/RoomCategory',
            body: requestBody,
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
     * @returns RoomCategoryResponceDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVRoomCategoryUpdate(
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
}
