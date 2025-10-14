/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelDoctorBasicAmountSettingResponseDtoListResultModel } from '../models/CancelDoctorBasicAmountSettingResponseDtoListResultModel';
import type { DeleteDoctorBasicAmountSettingCommand } from '../models/DeleteDoctorBasicAmountSettingCommand';
import type { DoctorBasicAmountSettingGetByIdResponseDtoResultModel } from '../models/DoctorBasicAmountSettingGetByIdResponseDtoResultModel';
import type { DoctorBasicAmountSettingListRequestDto } from '../models/DoctorBasicAmountSettingListRequestDto';
import type { DoctorBasicAmountSettingListResponseDtoPagedResponseDtoResultModel } from '../models/DoctorBasicAmountSettingListResponseDtoPagedResponseDtoResultModel';
import type { DoctorBasicAmountSettingSaveResponseDTOResultModel } from '../models/DoctorBasicAmountSettingSaveResponseDTOResultModel';
import type { KVPairResultModel } from '../models/KVPairResultModel';
import type { UpdateDoctorBasicAmountSettingCommand } from '../models/UpdateDoctorBasicAmountSettingCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorBasicAmountSettingService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVDoctorBasicAmountSettingGetAdjustmentHeads(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorBasicAmountSetting/GetAdjustmentHeads',
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
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVDoctorBasicAmountSettingGetCalculationMode(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorBasicAmountSetting/GetCalculationMode',
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
     * @returns DoctorBasicAmountSettingListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVDoctorBasicAmountSettingList(
        version: string,
        tenant?: string,
        requestBody?: DoctorBasicAmountSettingListRequestDto,
    ): CancelablePromise<DoctorBasicAmountSettingListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorBasicAmountSetting/list',
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
     * @returns DoctorBasicAmountSettingSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVDoctorBasicAmountSetting(
        version: string,
        tenant?: string,
        requestBody?: UpdateDoctorBasicAmountSettingCommand,
    ): CancelablePromise<DoctorBasicAmountSettingSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorBasicAmountSetting',
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
     * @returns CancelDoctorBasicAmountSettingResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVDoctorBasicAmountSetting(
        version: string,
        tenant?: string,
        requestBody?: DeleteDoctorBasicAmountSettingCommand,
    ): CancelablePromise<CancelDoctorBasicAmountSettingResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/DoctorBasicAmountSetting',
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
     * @returns DoctorBasicAmountSettingGetByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVDoctorBasicAmountSettingGetById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<DoctorBasicAmountSettingGetByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorBasicAmountSetting/GetById{id}',
            path: {
                'id': id,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
