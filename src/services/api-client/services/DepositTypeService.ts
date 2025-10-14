/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DepositTypeDto } from '../models/DepositTypeDto';
import type { DepositTypeListDto } from '../models/DepositTypeListDto';
import type { DepositTypeListRequestDto } from '../models/DepositTypeListRequestDto';
import type { DepositTypeRequestDto } from '../models/DepositTypeRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepositTypeService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns DepositTypeListDto OK
     * @throws ApiError
     */
    public static postApiVDepositTypeList(
        version: string,
        tenant?: string,
        requestBody?: DepositTypeListRequestDto,
    ): CancelablePromise<Array<DepositTypeListDto>> {
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
     * @param version
     * @param tenant
     * @returns DepositTypeListDto OK
     * @throws ApiError
     */
    public static getApiVDepositTypeApplicableForList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<DepositTypeListDto>> {
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
     * @param id
     * @param version
     * @param tenant
     * @returns DepositTypeDto OK
     * @throws ApiError
     */
    public static getApiVDepositType(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<DepositTypeDto> {
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
     * @param id
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVDepositType(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: DepositTypeRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/DepositType/',
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
    public static postApiVDepositType(
        version: string,
        tenant?: string,
        requestBody?: DepositTypeRequestDto,
    ): CancelablePromise<any> {
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
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVDepositType(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
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
     * @returns DepositTypeListDto OK
     * @throws ApiError
     */
    public static getApiVDepositTypeDepositeTypeStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<DepositTypeListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositType/DepositeTypeStatus',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
