/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateDepositTypeCommand } from '../models/CreateDepositTypeCommand';
import type { DepositTypeByIdDtoResultModel } from '../models/DepositTypeByIdDtoResultModel';
import type { DepositTypeDeleteResponseDtoListResultModel } from '../models/DepositTypeDeleteResponseDtoListResultModel';
import type { DepositTypeListRequestDto } from '../models/DepositTypeListRequestDto';
import type { DepositTypeListResponseDtoPagedResponseDtoResultModel } from '../models/DepositTypeListResponseDtoPagedResponseDtoResultModel';
import type { DepositTypeRequestDtoResultModel } from '../models/DepositTypeRequestDtoResultModel';
import type { DepositTypeResponseDtoResultModel } from '../models/DepositTypeResponseDtoResultModel';
import type { DepositTypesResultModel } from '../models/DepositTypesResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { UpdateDepositTypeCommand } from '../models/UpdateDepositTypeCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepositTypeService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVDepositTypeApplicableForList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositType/applicableForList',
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
     * @returns DepositTypeDeleteResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVDepositType(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<DepositTypeDeleteResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/DepositType',
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
     * @returns DepositTypeRequestDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVDepositType(
        version: string,
        tenant?: string,
        requestBody?: CreateDepositTypeCommand,
    ): CancelablePromise<DepositTypeRequestDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DepositType',
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
     * @returns DepositTypeResponseDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVDepositType(
        version: string,
        tenant?: string,
        requestBody?: UpdateDepositTypeCommand,
    ): CancelablePromise<DepositTypeResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/DepositType',
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
     * @returns DepositTypeListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVDepositTypeList(
        version: string,
        tenant?: string,
        requestBody?: DepositTypeListRequestDto,
    ): CancelablePromise<DepositTypeListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DepositType/list',
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
     * @returns DepositTypeByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVDepositType(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<DepositTypeByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositType/{id}',
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
    public static getApiVDepositTypeGetCreatedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositType/getCreatedbyUser',
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
    public static getApiVDepositTypeGetModifiedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositType/getModifiedbyUser',
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
     * @returns DepositTypesResultModel OK
     * @throws ApiError
     */
    public static getApiVDepositTypeDepositTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<DepositTypesResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositType/DepositTypes',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
