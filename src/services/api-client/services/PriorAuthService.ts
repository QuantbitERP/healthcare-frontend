/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GetPriorAuthorizationRequestListRequestDto } from '../models/GetPriorAuthorizationRequestListRequestDto';
import type { priorAuthDtoResponse, PriorAuthorizationModelDto, PriorAuthorizationRequestListDto } from '../models/PriorAuthorizationRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';

export class PriorAuthService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVPriorAuthorizationRequest(
        version: string,
        tenant?: string,
        requestBody?: PriorAuthorizationModelDto,
    ): CancelablePromise<any> {
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
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVPriorAuthorizationRequest(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
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
     * @param id
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVPriorAuthorizationRequest(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: PriorAuthorizationModelDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PriorAuthorizationRequest',
            path: {
                'id': id,
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
     * @returns PriorAuthorizationRequestDto OK
     * @throws ApiError
     */
    public static getApiVPriorAuthorizationRequest(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<priorAuthDtoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PriorAuthorizationRequest/GetById/{id}',
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
     * @returns PriorAuthorizationRequestDto OK
     * @throws ApiError
     */
    public static postApiVPriorAuthorizationRequestList(
        version: string,
        tenant?: string,
        requestBody?: GetPriorAuthorizationRequestListRequestDto|null,
    ): CancelablePromise<PriorAuthorizationRequestListDto> {
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

    /**
     * @param version
     * @param tenant
     * @returns CommonResponseDto OK
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
     * @returns CommonResponseDto OK
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
     * @param version
     * @param tenant
     * @returns CommonResponseDto OK
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
    public static getApiVPriorAuthorizationRequestGetVisitType(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Common/GetVisitTypes',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    public static getApiVPriorAuthorizationRequestGetPatientCategory(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCategoryType/getPatientCategoryType',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    public static getApiVPriorAuthorizationRequestGetPatientCompany(
        version: string,
        tenant: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCompanyMaster/patientcompanies',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}



