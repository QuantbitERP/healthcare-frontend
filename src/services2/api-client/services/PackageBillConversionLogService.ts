/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { PackageBillConversionLogSerachFilterRequestDto } from '../models/PackageBillConversionLogSerachFilterRequestDto';
import type { PackageBillConversionLogSerachFilterResponseDtoPagedResponseDtoResultModel } from '../models/PackageBillConversionLogSerachFilterResponseDtoPagedResponseDtoResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PackageBillConversionLogService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVPackageBillConversionLogChangetype(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBillConversionLog/changetype',
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
    public static getApiVPackageBillConversionLogModifieddBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBillConversionLog/ModifieddBy',
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
    public static getApiVPackageBillConversionLogSourcepackage(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBillConversionLog/sourcepackage',
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
    public static getApiVPackageBillConversionLogTargetpackage(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBillConversionLog/targetpackage',
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
     * @returns PackageBillConversionLogSerachFilterResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillConversionLogFilterSearchList(
        version: string,
        tenant?: string,
        requestBody?: PackageBillConversionLogSerachFilterRequestDto,
    ): CancelablePromise<PackageBillConversionLogSerachFilterResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBillConversionLog/FilterSearchList',
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
