/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CommonRequestDto, DistrictRequestDto, StateRequestDto } from '../models/CommonRequestDto';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommonService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVCommonCountry(
        version: string,
        tenant?: string,
        requestBody?: CommonRequestDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Common/country',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVCommonState(
        version: string,
        tenant?: string,
        requestBody?: StateRequestDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Common/state',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVCommonDistrict(
        version: string,
        tenant?: string,
        requestBody?: DistrictRequestDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Common/district',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVCommonCity(
        version: string,
        tenant?: string,
        requestBody?: DistrictRequestDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Common/city',
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
    public static postApiVCommonStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Common/status',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
