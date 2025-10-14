/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CoverLetterFilterDTO } from '../models/CoverLetterFilterDTO';
import type { CoverLetterSaveRequestDto } from '../models/CoverLetterSaveRequestDto';
import type { CoverLetterUpdateRequestDTO } from '../models/CoverLetterUpdateRequestDTO';
import type { CoverLetterGetByIdDtoResultModel } from '../models/CoverLetterGetByIdDtoResultModel';
import type { TemplateListDTO } from '../models/TemplateListDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { API_VERSION, API_TENANT } from "@/utils/constants";

export class CoverLetterService {
    /**
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVCoverLetterCompanies(
        _version: string,
        _tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/GetCompanyNames',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
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
        _version: string,
        _tenant?: string,
    ): CancelablePromise<Array<TemplateListDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/GetTmplateList',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
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
        _version: string,
        _tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/list',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
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
        _version: string,
        _tenant?: string,
    ): CancelablePromise<CoverLetterGetByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/{id}',
            path: {
                'id': id,
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
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
        id: string,
        _version: string,
        _tenant?: string,
        requestBody?: CoverLetterUpdateRequestDTO,
    ): CancelablePromise<any> {
        // Structure the request body according to API specification
        const structuredRequestBody = requestBody ? { model: requestBody } : undefined;
        
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/CoverLetter',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
            },
            body: structuredRequestBody,
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
        _version: string,
        _tenant?: string,
        requestBody?: CoverLetterSaveRequestDto,
    ): CancelablePromise<any> {
        // Structure the request body according to API specification
        const structuredRequestBody = requestBody ? { model: requestBody } : undefined;
        
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/CoverLetter/save',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
            },
            body: structuredRequestBody,
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
        _version: string,
        _tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        // Structure the request body according to API specification
        const structuredRequestBody = requestBody ? { model: { ids: requestBody } } : undefined;
        
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/CoverLetter/Delete',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
            },
            body: structuredRequestBody,
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
        _version: string,
        _tenant?: string,
        requestBody?: CoverLetterFilterDTO,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/CoverLetter/GetCoverLetterFilterList',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
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
    public static getApiVCoverLetterFields(
        _version: string,
        _tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/getCoverLetterFields',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
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
        _version: string,
        _tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/GetCreatedByList',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVCoverLetterGetModifiedByList(
        _version: string,
        _tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/CoverLetter/GetModifiedByList',
            path: {
                'version': API_VERSION,
            },
            headers: {
                'tenant': API_TENANT,
            },
        });
    }
}
