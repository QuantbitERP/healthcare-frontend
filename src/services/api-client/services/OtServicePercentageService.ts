/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelOTServicePercentageDtoListResultModel } from '../models/CancelOTServicePercentageDtoListResultModel';
import type { CreateOTServicePercentageCommand } from '../models/CreateOTServicePercentageCommand';
import type { DeleteOTServicePercentageCommand } from '../models/DeleteOTServicePercentageCommand';
import type { KVPair } from '../models/KVPair';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { OTServicePrecentageGetByidResponseDtoResultModel } from '../models/OTServicePrecentageGetByidResponseDtoResultModel';
import type { OTServicePrecentageResponseDtoResultModel } from '../models/OTServicePrecentageResponseDtoResultModel';
import type { SearchFilterRequestDto } from '../models/SearchFilterRequestDto';
import type { SearchFilterResponseDtoPagedResponseDtoResultModel } from '../models/SearchFilterResponseDtoPagedResponseDtoResultModel';
import type { UpdateOTServicePercentageCommand } from '../models/UpdateOTServicePercentageCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OtServicePercentageService {
    /**
     * @param version
     * @param hospid
     * @param tenant
     * @returns KVPair OK
     * @throws ApiError
     */
    public static getApiVOtServicePercentageServices(
        version: string,
        hospid?: string,
        tenant?: string,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTServicePercentage/Services',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'Hospid': hospid,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVOtServicePercentageOtServicePercentageExcelExcel(
        version: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OTServicePercentage/OTServicePercentageExcel/excel',
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
    public static getApiVOtServicePercentageApplicableFor(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTServicePercentage/ApplicableFor',
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
    public static getApiVOtServicePercentageGetCreatedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTServicePercentage/GetCreatedByList',
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
    public static getApiVOtServicePercentageGetModifiedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTServicePercentage/GetModifiedByList',
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
     * @returns SearchFilterResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVOtServicePercentageList(
        version: string,
        tenant?: string,
        requestBody?: SearchFilterRequestDto,
    ): CancelablePromise<SearchFilterResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OTServicePercentage/list',
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
     * @returns CancelOTServicePercentageDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVOtServicePercentageDelete(
        version: string,
        tenant?: string,
        requestBody?: DeleteOTServicePercentageCommand,
    ): CancelablePromise<CancelOTServicePercentageDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/OTServicePercentage/Delete',
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
     * @returns OTServicePrecentageResponseDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVOtServicePercentage(
        version: string,
        tenant?: string,
        requestBody?: UpdateOTServicePercentageCommand,
    ): CancelablePromise<OTServicePrecentageResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/OTServicePercentage',
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
     * @returns OTServicePrecentageResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVOtServicePercentageSave(
        version: string,
        tenant?: string,
        requestBody?: CreateOTServicePercentageCommand,
    ): CancelablePromise<OTServicePrecentageResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OTServicePercentage/Save',
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
     * @returns OTServicePrecentageGetByidResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVOtServicePercentage(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<OTServicePrecentageGetByidResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTServicePercentage/{id}',
            path: {
                'id': id,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
