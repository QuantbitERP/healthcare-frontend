/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateScheduleofChargeTypeCommand } from '../models/CreateScheduleofChargeTypeCommand';
import type { DeleteScheduleofChargeTypeCommand } from '../models/DeleteScheduleofChargeTypeCommand';
import type { GetScheduleofChargeTypeByIdDtoResultModel } from '../models/GetScheduleofChargeTypeByIdDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { ScheduleofChargeTypeOutputDtoResultModel } from '../models/ScheduleofChargeTypeOutputDtoResultModel';
import type { ScheduleofChargeTypeResponseDtoResultModel } from '../models/ScheduleofChargeTypeResponseDtoResultModel';
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
    public static postApiVScheduleofChargeTypeScheduleofchargetypeSave(
        version: string,
        tenant?: string,
        requestBody?: CreateScheduleofChargeTypeCommand,
    ): CancelablePromise<ScheduleofChargeTypeOutputDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ScheduleofChargeType/scheduleofchargetype/save',
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
    public static putApiVScheduleofChargeTypeScheduleofchargetypeUpdate(
        version: string,
        tenant?: string,
        requestBody?: UpdateScheduleofChargeTypeCommand,
    ): CancelablePromise<ScheduleofChargeTypeOutputDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ScheduleofChargeType/scheduleofchargetype/update',
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
    public static deleteApiVScheduleofChargeTypeScheduleofchargetypeDelete(
        version: string,
        tenant?: string,
        requestBody?: DeleteScheduleofChargeTypeCommand,
    ): CancelablePromise<ScheduleofChargeTypeOutputDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ScheduleofChargeType/scheduleofchargetype/delete',
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
     * @param hospitalId
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVScheduleofChargeTypeCreatedby(
        version: string,
        hospitalId?: string,
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
            query: {
                'hospitalId': hospitalId,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ScheduleofChargeTypeResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVScheduleofChargeTypeGetScheduleofChargeTypeByFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: ScheduleofChargeTypeSearchRequestDto,
    ): CancelablePromise<ScheduleofChargeTypeResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ScheduleofChargeType/getScheduleofChargeTypeByFilterWithSearch',
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
    public static getApiVScheduleofChargeTypeScheduleofChargeType(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GetScheduleofChargeTypeByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ScheduleofChargeType/ScheduleofChargeType/{Id}',
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
