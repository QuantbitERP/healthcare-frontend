/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { RateListDto, CommonResponseDto } from '../models/RateListDto';
import type { RateListRequestDto } from '../models/RateListRequestDto';
import type { RateListSaveDto } from '../models/RateListSaveDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RateListService {
    /**
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRateListGetRateType(
        version: string,
        tenant?: string,
    ): CancelablePromise<CommonResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateList/RateType',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRateListGetRateName(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateList/getRateName',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRateListGetApplicableFrom(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateList/getApplicableFrom',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRateListGetBillingClass(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateList/getBillingClass',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRateListGetRateListStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateList/getRateListStatus',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRateListGetRateListServiceGroup(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateList/getRateListServiceGroup',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRateListGetHospital(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Hospital/hospitals',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRateListGetDepartment(
        version: string,
        tenant?: string,
        requestBody?: { hospitalId: string[] },
    ): CancelablePromise<CommonResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Hospital/Hospitalwisedepartments',
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
     * @returns RateListDto OK
     * @throws ApiError
     */
    public static postApiVRateListList(
        version: string,
        tenant?: string,
        requestBody?: RateListRequestDto,
    ): CancelablePromise<Array<RateListDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RateList/list',
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
     * @returns RateListDto OK
     * @throws ApiError
     */
    public static getApiVRateListSummary(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<RateListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateList/summary',
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
     * @returns RateListDto OK
     * @throws ApiError
     */
    public static getApiVRateList(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<RateListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateList/{id}',
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
    public static putApiVRateList(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: RateListSaveDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/RateList/{id}',
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
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVRateListSave(
        version: string,
        tenant?: string,
        requestBody?: RateListSaveDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RateList/save',
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
    public static deleteApiVRateList(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/RateList',
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
     * @param formData
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVRateListUploadExcel(
        version: string,
        tenant?: string,
        formData?: {
            file?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RateList/uploadExcel',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns binary OK
     * @throws ApiError
     */
    public static getApiVRateListDownloadRateList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/RateList/downloadRateList',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
