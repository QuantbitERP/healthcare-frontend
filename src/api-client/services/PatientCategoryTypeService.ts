/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { PatientCategorytypeListDto } from '../models/PatientCategorytypeListDto';
import type { PatientCategoryTypeRequestDto } from '../models/PatientCategoryTypeRequestDto';
import type { PatientCategotyTypeSearchRequestDto } from '../models/PatientCategotyTypeSearchRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export interface Meta{
    page: {
        currentPage: number,
        pageSize: number,
        totalPages: number
    }
    }
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
           // url: '/api/v{version}/PatientCategoryType',
            url: '/api/v{version}/PatientCategoryType/save',

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
            url: '/api/v{version}/PatientCategoryType/delete',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body: {
                model:{
                    ids: requestBody,
                }
            },
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVPatientCategoryTypeById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCategoryType/{id}',
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
    public static putApiVPatientCategoryType(
        version: string,
        tenant?: string,
        requestBody?: PatientCategoryTypeRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PatientCategoryType/update',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVPatientCategoryTypeCreatedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCategoryType/CreatedBy',
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
            url: '/api/v{version}/PatientCategoryType/getModifiedBy',
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
    ): CancelablePromise<{data:{items:Array<PatientCategorytypeListDto>,metadata:Meta}}> {
        return __request(OpenAPI, {
            method: 'POST',
            //url: '/api/v{version}/PatientCategoryType/getPatientCategoryTypePageFilter',
            url: '/api/v{version}/PatientCategoryType/list',
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
