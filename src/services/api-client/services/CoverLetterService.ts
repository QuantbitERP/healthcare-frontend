/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CoverLetterFilterDTO } from '../models/CoverLetterFilterDTO';
import type { CoverLetterListDtoResponse } from '../models/CoverLetterListDto';
import type { TemplateListDTO } from '../models/TemplateListDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { CommonResponseDto } from '../models/RateListDto';
import { CoverLetterUpdateCommand } from '../models/CoverLetterUpdateCommand';
import { CreateCoverLetterCommand } from '../models/CreateCoverLetterCommand';
import { CoverLetterGetByIdDtoResultModel } from '../models/CoverLetterGetByIdDtoResultModel';
export class CoverLetterService {
    /**
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVCoverLetterCompanies(
        version: string,
        tenant?: string,
    ): CancelablePromise<CommonResponseDto> {
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
     * @returns any OK
     * @throws ApiError
     */
      public static getApiVCoverLetterGetCreatedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<CommonResponseDto> {
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
     * @returns any OK
     * @throws ApiError
     */
      public static getApiVCoverLetterModifiedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<CommonResponseDto> {
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
     * @param version
     * @param tenant
     * @returns TemplateListDTO OK
     * @throws ApiError
     */
    public static getApiVCoverLetterGetTmplateList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<TemplateListDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/GetTmplateList',
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
    public static getApiVCoverLetterList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/list',
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
     * @returns CoverLetterListDto OK
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
     * @param id
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVCoverLetter(
        version: string,
        tenant?: string,
        requestBody?: CoverLetterUpdateCommand,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/CoverLetter/',
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
    public static postApiVCoverLetter(
        version: string,
        tenant?: string,
        requestBody?: CreateCoverLetterCommand,
    ): CancelablePromise<any> {
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
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVCoverLetter(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/CoverLetter/Delete',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body:{ model:{ ids:requestBody } },
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
    public static postApiVCoverLetterGetCoverLaterListByFilter(
        version: string,
        tenant?: string,
        requestBody?: CoverLetterFilterDTO,
    ): CancelablePromise<CoverLetterListDtoResponse> {
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
