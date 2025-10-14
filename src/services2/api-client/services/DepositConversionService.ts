/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateDepositConversionCommand } from '../models/CreateDepositConversionCommand';
import type { DepositConversionGetByIdResponseDtoResultModel } from '../models/DepositConversionGetByIdResponseDtoResultModel';
import type { DepositConversionReceiptDetailsResponseDtoResultModel } from '../models/DepositConversionReceiptDetailsResponseDtoResultModel';
import type { DepositConversionSaveResponseDtoListResultModel } from '../models/DepositConversionSaveResponseDtoListResultModel';
import type { DepositConversionSearchFilterResponseDtoPagedResponseDto } from '../models/DepositConversionSearchFilterResponseDtoPagedResponseDto';
import type { DepositConversionSearchRequestDto } from '../models/DepositConversionSearchRequestDto';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepositConversionService {
    /**
     * @param patientId
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVDepositConversionReceiptNoList(
        patientId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositConversion/receiptNoList{PatientId}',
            path: {
                'PatientId': patientId,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param receiptId
     * @param version
     * @param tenant
     * @returns DepositConversionReceiptDetailsResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVDepositConversionReceiptDetails(
        receiptId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<DepositConversionReceiptDetailsResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositConversion/receiptDetails/{receiptId}',
            path: {
                'receiptId': receiptId,
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
    public static getApiVDepositConversionGetCreatedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositConversion/GetCreatedByList',
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
    public static getApiVDepositConversionGetModifiedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositConversion/GetModifiedByList',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVDepositConversionGetDepositTypeList(
        version: string,
        tenant?: string,
        requestBody?: Array<number>,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DepositConversion/GetDepositTypeList',
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
     * @returns DepositConversionSearchFilterResponseDtoPagedResponseDto OK
     * @throws ApiError
     */
    public static postApiVDepositConversionList(
        version: string,
        tenant?: string,
        requestBody?: DepositConversionSearchRequestDto,
    ): CancelablePromise<DepositConversionSearchFilterResponseDtoPagedResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DepositConversion/list',
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
     * @returns DepositConversionSaveResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static postApiVDepositConversionSave(
        version: string,
        tenant?: string,
        requestBody?: CreateDepositConversionCommand,
    ): CancelablePromise<DepositConversionSaveResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DepositConversion/Save',
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
     * @returns DepositConversionGetByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVDepositConversionGetById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<DepositConversionGetByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositConversion/GetById{id}',
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
    public static getApiVDepositConversionTransferToEnum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepositConversion/TransferToEnum',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
