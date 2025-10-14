/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreatePriorAuthorizationCommand } from '../models/CreatePriorAuthorizationCommand';
import type { GetByIdForPriorAuthorizationResponseDtoResultModel } from '../models/GetByIdForPriorAuthorizationResponseDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { PriorAuthorizationDeleteMasterCommand } from '../models/PriorAuthorizationDeleteMasterCommand';
import type { PriorAuthorizationRequestListRequestDto } from '../models/PriorAuthorizationRequestListRequestDto';
import type { PriorAuthorizationRequestListResponseDtoPagedResponseDtoResultModel } from '../models/PriorAuthorizationRequestListResponseDtoPagedResponseDtoResultModel';
import type { PriorAuthorizationResponseDeleteDtoListResultModel } from '../models/PriorAuthorizationResponseDeleteDtoListResultModel';
import type { PriorAuthorizationSaveResponseDTOResultModel } from '../models/PriorAuthorizationSaveResponseDTOResultModel';
import type { UpdatePriorAuthorizationCommand } from '../models/UpdatePriorAuthorizationCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriorAuthorizationRequestService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns PriorAuthorizationSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVPriorAuthorizationRequest(
        version: string,
        tenant?: string,
        requestBody?: CreatePriorAuthorizationCommand,
    ): CancelablePromise<PriorAuthorizationSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PriorAuthorizationRequest',
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
     * @returns PriorAuthorizationSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVPriorAuthorizationRequest(
        version: string,
        tenant?: string,
        requestBody?: UpdatePriorAuthorizationCommand,
    ): CancelablePromise<PriorAuthorizationSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PriorAuthorizationRequest',
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
     * @returns PriorAuthorizationResponseDeleteDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVPriorAuthorizationRequest(
        version: string,
        tenant?: string,
        requestBody?: PriorAuthorizationDeleteMasterCommand,
    ): CancelablePromise<PriorAuthorizationResponseDeleteDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/PriorAuthorizationRequest',
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
    public static getApiVPriorAuthorizationRequestGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PriorAuthorizationRequest/GetCreatedBy',
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
    public static getApiVPriorAuthorizationRequestGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PriorAuthorizationRequest/GetModifiedBy',
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
     * @returns GetByIdForPriorAuthorizationResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVPriorAuthorizationRequestGetById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GetByIdForPriorAuthorizationResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PriorAuthorizationRequest/GetById{id}',
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
    public static getApiVPriorAuthorizationRequestGetStatusEnum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PriorAuthorizationRequest/GetStatusEnum',
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
     * @returns PriorAuthorizationRequestListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVPriorAuthorizationRequestPriorAuthorizationList(
        version: string,
        tenant?: string,
        requestBody?: PriorAuthorizationRequestListRequestDto,
    ): CancelablePromise<PriorAuthorizationRequestListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PriorAuthorizationRequest/PriorAuthorizationList',
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
