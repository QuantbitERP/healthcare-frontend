/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelRateSettingDtoResultModel } from '../models/CancelRateSettingDtoResultModel';
import type { CreateRateSettingCommand } from '../models/CreateRateSettingCommand';
import type { GetServiceDetailsWithRateResultModel } from '../models/GetServiceDetailsWithRateResultModel';
import type { GetServiceRateDetailRequestDto } from '../models/GetServiceRateDetailRequestDto';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { RateSettingGridResponseDtoResultModel } from '../models/RateSettingGridResponseDtoResultModel';
import type { RateSettingListRequestDto } from '../models/RateSettingListRequestDto';
import type { RateSettingListResponseDtoPagedResponseDtoResultModel } from '../models/RateSettingListResponseDtoPagedResponseDtoResultModel';
import type { RateSettingResponceDtoResultModel } from '../models/RateSettingResponceDtoResultModel';
import type { UpdateRateSettingCommand } from '../models/UpdateRateSettingCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RateSettingService {
    /**
     * @param hospitalId
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVRateSettingHospitalDepartments(
        hospitalId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateSetting/hospital-departments/{hospitalId}',
            path: {
                'hospitalId': hospitalId,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param hospitalId
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVRateSettingHospitalRatenames(
        hospitalId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateSetting/hospital-ratenames/{hospitalId}',
            path: {
                'hospitalId': hospitalId,
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
    public static getApiVRateSettingRateTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateSetting/rate-types',
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
    public static getApiVRateSettingCreatedByUsers(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateSetting/created-by-users',
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
    public static getApiVRateSettingModifiedByUsers(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateSetting/modified-by-users',
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
    public static getApiVRateSettingRateSettingEnum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateSetting/RateSettingEnum',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVRateSettingRatesettingExcel(
        version: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RateSetting/ratesetting/excel',
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
     * @returns CancelRateSettingDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVRateSettingDelete(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<CancelRateSettingDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/RateSetting/Delete',
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
     * @returns RateSettingResponceDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVRateSettingSave(
        version: string,
        tenant?: string,
        requestBody?: CreateRateSettingCommand,
    ): CancelablePromise<RateSettingResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RateSetting/Save',
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
     * @returns RateSettingResponceDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVRateSetting(
        version: string,
        tenant?: string,
        requestBody?: UpdateRateSettingCommand,
    ): CancelablePromise<RateSettingResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/RateSetting',
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
     * @returns RateSettingGridResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVRateSetting(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<RateSettingGridResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateSetting/{id}',
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
     * @returns RateSettingListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVRateSettingList(
        version: string,
        tenant?: string,
        requestBody?: RateSettingListRequestDto,
    ): CancelablePromise<RateSettingListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RateSetting/list',
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
     * @returns GetServiceDetailsWithRateResultModel OK
     * @throws ApiError
     */
    public static postApiVRateSettingGetratebyhospitalserviceid(
        version: string,
        tenant?: string,
        requestBody?: GetServiceRateDetailRequestDto,
    ): CancelablePromise<GetServiceDetailsWithRateResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RateSetting/getratebyhospitalserviceid',
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
