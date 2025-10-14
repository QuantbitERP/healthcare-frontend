/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelPayoutAdjustmentMasterResponseDtoListResultModel } from '../models/CancelPayoutAdjustmentMasterResponseDtoListResultModel';
import type { CreatePayoutAdjustmentMasterCommand } from '../models/CreatePayoutAdjustmentMasterCommand';
import type { DeletePayoutAdjustmentMasterCommand } from '../models/DeletePayoutAdjustmentMasterCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { PayoutadjustmentmasterFilterRequestDto } from '../models/PayoutadjustmentmasterFilterRequestDto';
import type { PayoutadjustmentmasterFilterResponseDtoPagedResponseDtoResultModel } from '../models/PayoutadjustmentmasterFilterResponseDtoPagedResponseDtoResultModel';
import type { PayoutAdjustmentMasterGetByIdResponseDtoResultModel } from '../models/PayoutAdjustmentMasterGetByIdResponseDtoResultModel';
import type { PayoutAdjustmentMasterSaveResponseDTOResultModel } from '../models/PayoutAdjustmentMasterSaveResponseDTOResultModel';
import type { UpdatePayoutAdjustmentMasterCommand } from '../models/UpdatePayoutAdjustmentMasterCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PayoutAdjustmentMasterService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns PayoutAdjustmentMasterSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVPayoutAdjustmentMaster(
        version: string,
        tenant?: string,
        requestBody?: CreatePayoutAdjustmentMasterCommand,
    ): CancelablePromise<PayoutAdjustmentMasterSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PayoutAdjustmentMaster',
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
     * @returns CancelPayoutAdjustmentMasterResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVPayoutAdjustmentMaster(
        version: string,
        tenant?: string,
        requestBody?: DeletePayoutAdjustmentMasterCommand,
    ): CancelablePromise<CancelPayoutAdjustmentMasterResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/PayoutAdjustmentMaster',
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
     * @returns PayoutAdjustmentMasterSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVPayoutAdjustmentMaster(
        version: string,
        tenant?: string,
        requestBody?: UpdatePayoutAdjustmentMasterCommand,
    ): CancelablePromise<PayoutAdjustmentMasterSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PayoutAdjustmentMaster',
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
    public static getApiVPayoutAdjustmentMasterGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PayoutAdjustmentMaster/GetCreatedBy',
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
    public static getApiVPayoutAdjustmentMasterGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PayoutAdjustmentMaster/GetModifiedBy',
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
     * @returns PayoutAdjustmentMasterGetByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVPayoutAdjustmentMasterGetById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<PayoutAdjustmentMasterGetByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PayoutAdjustmentMaster/GetById{id}',
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
     * @returns PayoutadjustmentmasterFilterResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVPayoutAdjustmentMasterList(
        version: string,
        tenant?: string,
        requestBody?: PayoutadjustmentmasterFilterRequestDto,
    ): CancelablePromise<PayoutadjustmentmasterFilterResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PayoutAdjustmentMaster/list',
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
