/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateScheduleofChargeTypeCommand } from '../models/CreateScheduleofChargeTypeCommand';
import type { GetScheduleofChargeTypeByIdDtoResultModel } from '../models/GetScheduleofChargeTypeByIdDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { ScheduleofChargeTypeDeleteResponseDtoListResultModel } from '../models/ScheduleofChargeTypeDeleteResponseDtoListResultModel';
import type { ScheduleofChargeTypeOutputDtoResultModel } from '../models/ScheduleofChargeTypeOutputDtoResultModel';
import type { ScheduleofChargeTypeResponseDtoPagedResponseDtoResultModel } from '../models/ScheduleofChargeTypeResponseDtoPagedResponseDtoResultModel';
import type { ScheduleofChargeTypeSearchRequestDto } from '../models/ScheduleofChargeTypeSearchRequestDto';
import type { UpdateScheduleofChargeTypeCommand } from '../models/UpdateScheduleofChargeTypeCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ScheduleofChargeTypeService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ScheduleofChargeTypeOutputDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVScheduleofChargeTypeSave(
        version: string,
        tenant?: string,
        requestBody?: CreateScheduleofChargeTypeCommand,
    ): CancelablePromise<ScheduleofChargeTypeOutputDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ScheduleofChargeType/save',
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
     * @returns ScheduleofChargeTypeOutputDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVScheduleofChargeType(
        version: string,
        tenant?: string,
        requestBody?: UpdateScheduleofChargeTypeCommand,
    ): CancelablePromise<ScheduleofChargeTypeOutputDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ScheduleofChargeType',
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
     * @returns ScheduleofChargeTypeDeleteResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVScheduleofChargeType(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<ScheduleofChargeTypeDeleteResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ScheduleofChargeType',
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
    public static getApiVScheduleofChargeTypeScheduleofChargeTypeFilterType(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ScheduleofChargeType/ScheduleofChargeTypeFilterType',
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
    public static getApiVScheduleofChargeTypeCreatedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ScheduleofChargeType/createdby',
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
     * @returns ScheduleofChargeTypeResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVScheduleofChargeTypeList(
        version: string,
        tenant?: string,
        requestBody?: ScheduleofChargeTypeSearchRequestDto,
    ): CancelablePromise<ScheduleofChargeTypeResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ScheduleofChargeType/list',
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
     * @returns GetScheduleofChargeTypeByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVScheduleofChargeType(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GetScheduleofChargeTypeByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ScheduleofChargeType/{Id}',
            path: {
                'Id': id,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
