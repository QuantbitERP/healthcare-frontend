/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelChargesEstimationResponceDtoResultModel } from '../models/CancelChargesEstimationResponceDtoResultModel';
import type { ChargesEstimationComparisionPrintRequestDto } from '../models/ChargesEstimationComparisionPrintRequestDto';
import type { ChargesEstimationListRequestDto } from '../models/ChargesEstimationListRequestDto';
import type { ChargesEstimationListResponseDtoPagedResponseDtoResultModel } from '../models/ChargesEstimationListResponseDtoPagedResponseDtoResultModel';
import type { ChargesEstimationPrintRequestDto } from '../models/ChargesEstimationPrintRequestDto';
import type { ChargesEstimationSaveResponseDtoResultModel } from '../models/ChargesEstimationSaveResponseDtoResultModel';
import type { CreateChargesEstimationCommand } from '../models/CreateChargesEstimationCommand';
import type { DeleteChargesEstimationListCommand } from '../models/DeleteChargesEstimationListCommand';
import type { GetByIdResponceDtoResultModel } from '../models/GetByIdResponceDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { SearchedServiceRequestDto } from '../models/SearchedServiceRequestDto';
import type { SearchedServiceResponseDtoPagedResponseDtoResultModel } from '../models/SearchedServiceResponseDtoPagedResponseDtoResultModel';
import type { UpdateChargesEstimationCommand } from '../models/UpdateChargesEstimationCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChargesEstimationService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns SearchedServiceResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVChargesEstimationSearchServiceslist(
        version: string,
        tenant?: string,
        requestBody?: SearchedServiceRequestDto,
    ): CancelablePromise<SearchedServiceResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ChargesEstimation/SearchServiceslist',
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
     * @returns ChargesEstimationSaveResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVChargesEstimationSave(
        version: string,
        tenant?: string,
        requestBody?: CreateChargesEstimationCommand,
    ): CancelablePromise<ChargesEstimationSaveResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ChargesEstimation/save',
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
     * @returns ChargesEstimationSaveResponseDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVChargesEstimation(
        version: string,
        tenant?: string,
        requestBody?: UpdateChargesEstimationCommand,
    ): CancelablePromise<ChargesEstimationSaveResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ChargesEstimation',
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
     * @returns CancelChargesEstimationResponceDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVChargesEstimation(
        version: string,
        tenant?: string,
        requestBody?: DeleteChargesEstimationListCommand,
    ): CancelablePromise<CancelChargesEstimationResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ChargesEstimation',
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
    public static getApiVChargesEstimationGetCreatedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ChargesEstimation/GetCreatedby',
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
    public static getApiVChargesEstimationGetModifiedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ChargesEstimation/GetModifiedby',
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
    public static getApiVChargesEstimationEstimationTypeenum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ChargesEstimation/estimationTypeenum',
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
    public static getApiVChargesEstimationPatienttypeenum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ChargesEstimation/patienttypeenum',
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
     * @returns ChargesEstimationListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVChargesEstimationList(
        version: string,
        tenant?: string,
        requestBody?: ChargesEstimationListRequestDto,
    ): CancelablePromise<ChargesEstimationListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ChargesEstimation/list',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVChargesEstimationChargesEstimationPdf(
        version: string,
        tenant?: string,
        requestBody?: ChargesEstimationPrintRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ChargesEstimation/ChargesEstimation/pdf',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVChargesEstimationChargesEstimationExcel(
        version: string,
        tenant?: string,
        requestBody?: ChargesEstimationPrintRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ChargesEstimation/ChargesEstimation/excel',
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
     * @returns GetByIdResponceDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVChargesEstimation(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GetByIdResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ChargesEstimation/{id}',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVChargesEstimationChargesestimationVsBilComparisionPdf(
        version: string,
        tenant?: string,
        requestBody?: ChargesEstimationComparisionPrintRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ChargesEstimation/ChargesestimationVsBilComparision/pdf',
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
