/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { BooleanResultModel } from '../models/BooleanResultModel';
import type { ConcessionCategoryDto } from '../models/ConcessionCategoryDto';
import type { ConcessionCategoryIdListDtoListResultModel } from '../models/ConcessionCategoryIdListDtoListResultModel';
import type { ConcessionCategoryListRequestDto } from '../models/ConcessionCategoryListRequestDto';
import type { ConcessionCategoryListResponseDtoResultModel } from '../models/ConcessionCategoryListResponseDtoResultModel';
import type { ConcessionCategoryResponceDtoResultModel } from '../models/ConcessionCategoryResponceDtoResultModel';
import type { ConcessionCategoryTypeByIdDtoResultModel } from '../models/ConcessionCategoryTypeByIdDtoResultModel';
import type { CreateConcessionCategoryCommand } from '../models/CreateConcessionCategoryCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { UpdateConcessionCategoryCommand } from '../models/UpdateConcessionCategoryCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConcessionCategoryService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVConcessionCategoryConcessionCategoryTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ConcessionCategory/concessionCategoryTypes',
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
     * @returns ConcessionCategoryDto OK
     * @throws ApiError
     */
    public static getApiVConcessionCategory(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<ConcessionCategoryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ConcessionCategory/{id}',
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
     * @returns ConcessionCategoryResponceDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVConcessionCategorySave(
        version: string,
        tenant?: string,
        requestBody?: CreateConcessionCategoryCommand,
    ): CancelablePromise<ConcessionCategoryResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ConcessionCategory/Save',
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
     * @returns ConcessionCategoryResponceDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVConcessionCategoryUpdate(
        version: string,
        tenant?: string,
        requestBody?: UpdateConcessionCategoryCommand,
    ): CancelablePromise<ConcessionCategoryResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ConcessionCategory/Update',
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
     * @returns ConcessionCategoryIdListDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVConcessionCategory(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<ConcessionCategoryIdListDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ConcessionCategory',
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
     * @returns BooleanResultModel OK
     * @throws ApiError
     */
    public static getApiVConcessionCategoryConcessionAllowedStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<BooleanResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ConcessionCategory/concessionAllowedStatus',
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
    public static getApiVConcessionCategoryGetCreatedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ConcessionCategory/getCreatedbyUser',
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
    public static getApiVConcessionCategoryGetModifiedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ConcessionCategory/getModifiedbyUser',
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
     * @returns ConcessionCategoryListResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVConcessionCategoryList(
        version: string,
        tenant?: string,
        requestBody?: ConcessionCategoryListRequestDto,
    ): CancelablePromise<ConcessionCategoryListResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ConcessionCategory/list',
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
     * @returns ConcessionCategoryTypeByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVConcessionCategoryConcessionCategoryType(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<ConcessionCategoryTypeByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ConcessionCategory/concessionCategoryType/{Id}',
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
       public static getApiVConcessionCategoryConcessionCategories(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ConcessionCategory/concessionCategories',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
