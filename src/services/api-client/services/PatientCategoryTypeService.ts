/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PatientCategorytypeListDto } from '../models/PatientCategorytypeListDto';
import type { PatientCategoryTypeRequestDto } from '../models/PatientCategoryTypeRequestDto';
import type { PatientCategotyTypeSearchRequestDto } from '../models/PatientCategotyTypeSearchRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientCategoryTypeService {
    /**
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVPatientCategoryTypeGetPatientCategoryType(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
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
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVPatientCategoryType(
        version: string,
        tenant?: string,
        requestBody?: PatientCategoryTypeRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PatientCategoryType',
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
    public static deleteApiVPatientCategoryType(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/PatientCategoryType',
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
    public static putApiVPatientCategoryType(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: PatientCategoryTypeRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PatientCategoryType/{id}',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVPatientCategoryTypeCreatedByListForEmrCharSetting(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCategoryType/createdByListForEmrCharSetting',
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
    public static getApiVPatientCategoryTypeGetServicemodifiedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCategoryType/getServicemodifiedByList',
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
     * @returns PatientCategorytypeListDto OK
     * @throws ApiError
     */
    public static postApiVPatientCategoryTypeGetPatientCategoryTypePageFilter(
        version: string,
        tenant?: string,
        requestBody?: PatientCategotyTypeSearchRequestDto,
    ): CancelablePromise<Array<PatientCategorytypeListDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PatientCategoryType/getPatientCategoryTypePageFilter',
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
