/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GetServiceGroupListRequestDto } from '../models/GetServiceGroupListRequestDto';
import type { SequenceNoDto } from '../models/SequenceNoDto';
import type { ServiceGroupDto } from '../models/ServiceGroupDto';
import type { ServiceGroupRequestDto } from '../models/ServiceGroupRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceGroupService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVServiceGroup(
        version: string,
        tenant?: string,
        requestBody?: ServiceGroupRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ServiceGroup',
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
    public static deleteApiVServiceGroup(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ServiceGroup',
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
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVServiceGroup(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: ServiceGroupRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ServiceGroup/{id}',
            path: {
                'id': id,
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
     * @returns ServiceGroupDto OK
     * @throws ApiError
     */
    public static getApiVServiceGroup(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<ServiceGroupDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceGroup/{id}',
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
     * @returns SequenceNoDto OK
     * @throws ApiError
     */
    public static getApiVServiceGroupSequenceNoList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<SequenceNoDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceGroup/sequenceNoList',
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
     * @returns ServiceGroupDto OK
     * @throws ApiError
     */
    public static postApiVServiceGroupList(
        version: string,
        tenant?: string,
        requestBody?: GetServiceGroupListRequestDto,
    ): CancelablePromise<Array<ServiceGroupDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ServiceGroup/list',
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
