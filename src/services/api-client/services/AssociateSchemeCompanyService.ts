/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AssociateCompanyByIdDtoResultModel } from '../models/AssociateCompanyByIdDtoResultModel';
import type { AssociateCompanyListRequestDto } from '../models/AssociateCompanyListRequestDto';
import type { AssociateCompanyListResponseDtoResultModel } from '../models/AssociateCompanyListResponseDtoResultModel';
import type { AssociateSchemeCompanyResponceDTOResultModel } from '../models/AssociateSchemeCompanyResponceDTOResultModel';
import type { ConcessionCategoryResponceDtoResultModel } from '../models/ConcessionCategoryResponceDtoResultModel';
import type { CreateAssociateSchemeCompanyCommand } from '../models/CreateAssociateSchemeCompanyCommand';
import type { DeleteAssociateSchemeCompanyCommand } from '../models/DeleteAssociateSchemeCompanyCommand';
import type { DeleteAssociateSchemeCompanyResponceDtoResultModel } from '../models/DeleteAssociateSchemeCompanyResponceDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { UpdateAssociateSchemeCompanyCommand } from '../models/UpdateAssociateSchemeCompanyCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AssociateSchemeCompanyService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVAssociateSchemeCompanyGetcretaedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/AssociateSchemeCompany/getcretaedby',
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
    public static getApiVAssociateSchemeCompanyGetmodifiedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/AssociateSchemeCompany/getmodifiedby',
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
     * @returns AssociateSchemeCompanyResponceDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVAssociateSchemeCompanySave(
        version: string,
        tenant?: string,
        requestBody?: CreateAssociateSchemeCompanyCommand,
    ): CancelablePromise<AssociateSchemeCompanyResponceDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/AssociateSchemeCompany/Save',
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
     * @returns AssociateCompanyListResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVAssociateSchemeCompanyAssociateCompanyByFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: AssociateCompanyListRequestDto,
    ): CancelablePromise<AssociateCompanyListResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/AssociateSchemeCompany/AssociateCompanyByFilterWithSearch',
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
     * @returns AssociateCompanyByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVAssociateSchemeCompanyGetAssociateSchemeCompanyById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<AssociateCompanyByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/AssociateSchemeCompany/GetAssociateSchemeCompanyById/{Id}',
            path: {
                'Id': id,
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
    public static getApiVAssociateSchemeCompanyGetStatusList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/AssociateSchemeCompany/GetStatusList',
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
     * @returns ConcessionCategoryResponceDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVAssociateSchemeCompanyUpdate(
        version: string,
        tenant?: string,
        requestBody?: UpdateAssociateSchemeCompanyCommand,
    ): CancelablePromise<ConcessionCategoryResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/AssociateSchemeCompany/update',
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
     * @returns DeleteAssociateSchemeCompanyResponceDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVAssociateSchemeCompanyDelete(
        version: string,
        tenant?: string,
        requestBody?: DeleteAssociateSchemeCompanyCommand,
    ): CancelablePromise<DeleteAssociateSchemeCompanyResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/AssociateSchemeCompany/Delete',
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
