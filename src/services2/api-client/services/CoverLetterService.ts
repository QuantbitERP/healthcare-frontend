/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelCoverLetterReponseDtoListResultModel } from '../models/CancelCoverLetterReponseDtoListResultModel';
import type { CoverLetterGetByIdDtoResultModel } from '../models/CoverLetterGetByIdDtoResultModel';
import type { CoverLetterSaveResponseDtoResultModel } from '../models/CoverLetterSaveResponseDtoResultModel';
import type { CoverLetterSearchFilterRequestDto } from '../models/CoverLetterSearchFilterRequestDto';
import type { CoverLetterSearchFilterResponseDtoPagedResponseDtoResultModel } from '../models/CoverLetterSearchFilterResponseDtoPagedResponseDtoResultModel';
import type { CoverLetterUpdateCommand } from '../models/CoverLetterUpdateCommand';
import type { CoverLetterUpdateResponseDTOResultModel } from '../models/CoverLetterUpdateResponseDTOResultModel';
import type { CreateCoverLetterCommand } from '../models/CreateCoverLetterCommand';
import type { DeleteCoverLetterCommand } from '../models/DeleteCoverLetterCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CoverLetterService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns CoverLetterSaveResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVCoverLetterSave(
        version: string,
        tenant?: string,
        requestBody?: CreateCoverLetterCommand,
    ): CancelablePromise<CoverLetterSaveResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/CoverLetter/save',
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
     * @returns CancelCoverLetterReponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVCoverLetterDelete(
        version: string,
        tenant?: string,
        requestBody?: DeleteCoverLetterCommand,
    ): CancelablePromise<CancelCoverLetterReponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/CoverLetter/Delete',
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
     * @returns CoverLetterUpdateResponseDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVCoverLetter(
        version: string,
        tenant?: string,
        requestBody?: CoverLetterUpdateCommand,
    ): CancelablePromise<CoverLetterUpdateResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/CoverLetter',
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
    public static getApiVCoverLetterGetCreatedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/GetCreatedByList',
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
    public static getApiVCoverLetterGetModifiedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/GetModifiedByList',
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
     * @returns CoverLetterGetByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVCoverLetter(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<CoverLetterGetByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/{id}',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVCoverLetterGetCoverLetterFields(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/getCoverLetterFields',
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
    public static getApiVCoverLetterGetCompanyNames(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/GetCompanyNames',
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
     * @returns CoverLetterSearchFilterResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVCoverLetterGetCoverLetterFilterList(
        version: string,
        tenant?: string,
        requestBody?: CoverLetterSearchFilterRequestDto,
    ): CancelablePromise<CoverLetterSearchFilterResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/CoverLetter/GetCoverLetterFilterList',
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
