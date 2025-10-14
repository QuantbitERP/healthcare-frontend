/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelServiceGroupDtoResultModel } from '../models/CancelServiceGroupDtoResultModel';
import type { CreateServiceGroupCommand } from '../models/CreateServiceGroupCommand';
import type { GetServiceGroupListRequestDto } from '../models/GetServiceGroupListRequestDto';
import type { KVPair } from '../models/KVPair';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { SequenceNoDto } from '../models/SequenceNoDto';
import type { ServiceGroupByIdDtoResultModel } from '../models/ServiceGroupByIdDtoResultModel';
import type { ServiceGroupListResponseDtoPagedResponseDtoResultModel } from '../models/ServiceGroupListResponseDtoPagedResponseDtoResultModel';
import type { ServiceGroupRequestDto } from '../models/ServiceGroupRequestDto';
import type { ServiceGroupResponceDTOResultModel } from '../models/ServiceGroupResponceDTOResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceGroupService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ServiceGroupResponceDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVServiceGroupSave(
        version: string,
        tenant?: string,
        requestBody?: CreateServiceGroupCommand,
    ): CancelablePromise<ServiceGroupResponceDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ServiceGroup/Save',
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
     * @returns ServiceGroupByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVServiceGroup(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<ServiceGroupByIdDtoResultModel> {
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
     * @param requestBody
     * @returns CancelServiceGroupDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVServiceGroupDelete(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<CancelServiceGroupDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ServiceGroup/Delete',
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
     * @returns ServiceGroupListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVServiceGroupList(
        version: string,
        tenant?: string,
        requestBody?: GetServiceGroupListRequestDto,
    ): CancelablePromise<ServiceGroupListResponseDtoPagedResponseDtoResultModel> {
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
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVServiceGroupSequenceNo(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceGroup/sequenceNo',
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
     * @returns KVPair OK
     * @throws ApiError
     */
    public static getApiVServiceGroupServicegroups(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceGroup/servicegroups',
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
    public static getApiVServiceGroupCreatedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceGroup/Createdby',
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
    public static getApiVServiceGroupModifiedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceGroup/Modifiedby',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
