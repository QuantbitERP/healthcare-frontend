/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreatePatientCategoryTypeCommand } from '../models/CreatePatientCategoryTypeCommand';
import type { DeletePatientCategoryCommand } from '../models/DeletePatientCategoryCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { PatientCategoryTypeDeleteResponseDtoListResultModel } from '../models/PatientCategoryTypeDeleteResponseDtoListResultModel';
import type { PatientCategorytypeListResponseDtoPagedResponseDtoResultModel } from '../models/PatientCategorytypeListResponseDtoPagedResponseDtoResultModel';
import type { PatientCategoryTypeResponseDtoResultModel } from '../models/PatientCategoryTypeResponseDtoResultModel';
import type { PatientCategoryTypeSaveResponceDTOResultModel } from '../models/PatientCategoryTypeSaveResponceDTOResultModel';
import type { PatientCategotyTypeSearchRequestDto } from '../models/PatientCategotyTypeSearchRequestDto';
import type { UpdatePatientCategoryTypeCommand } from '../models/UpdatePatientCategoryTypeCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientCategoryTypeService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns PatientCategoryTypeSaveResponceDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVPatientCategoryTypeSave(
        version: string,
        tenant?: string,
        requestBody?: CreatePatientCategoryTypeCommand,
    ): CancelablePromise<PatientCategoryTypeSaveResponceDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
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
     * @returns PatientCategoryTypeSaveResponceDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVPatientCategoryTypeUpdate(
        version: string,
        tenant?: string,
        requestBody?: UpdatePatientCategoryTypeCommand,
    ): CancelablePromise<PatientCategoryTypeSaveResponceDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PatientCategoryType/Update',
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
     * @returns PatientCategoryTypeResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVPatientCategoryType(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<PatientCategoryTypeResponseDtoResultModel> {
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
     * @param version
     * @param tenant
     * @param requestBody
     * @returns PatientCategorytypeListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVPatientCategoryTypeList(
        version: string,
        tenant?: string,
        requestBody?: PatientCategotyTypeSearchRequestDto,
    ): CancelablePromise<PatientCategorytypeListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
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
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns PatientCategoryTypeDeleteResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVPatientCategoryTypeDelete(
        version: string,
        tenant?: string,
        requestBody?: DeletePatientCategoryCommand,
    ): CancelablePromise<PatientCategoryTypeDeleteResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/PatientCategoryType/delete',
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
    public static getApiVPatientCategoryTypeCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVPatientCategoryTypeGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVPatientCategoryTypeGetPatientCategoryType(
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
}
