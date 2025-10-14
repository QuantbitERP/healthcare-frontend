/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponseResultModel } from '../models/LoginResponseResultModel';
import type { ValidateTokenRequest } from '../models/ValidateTokenRequest';
import type { ValidateTokenResponseResultModel } from '../models/ValidateTokenResponseResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns LoginResponseResultModel OK
     * @throws ApiError
     */
    public static postApiVUserAuthenticate(
        version: string,
        tenant?: string,
        requestBody?: LoginRequest,
    ): CancelablePromise<LoginResponseResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/User/authenticate',
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
     * @returns ValidateTokenResponseResultModel OK
     * @throws ApiError
     */
    public static postApiVUserValidateToken(
        version: string,
        tenant?: string,
        requestBody?: ValidateTokenRequest,
    ): CancelablePromise<ValidateTokenResponseResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/User/validateToken',
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
    public static getApiVUserCreatedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/User/createdByList',
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
    public static getApiVUserModifiedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/User/modifiedByList',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
