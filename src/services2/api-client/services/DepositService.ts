/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateDepositCommand } from '../models/CreateDepositCommand';
import type { DeleteDepositIdCommand } from '../models/DeleteDepositIdCommand';
import type { DepositConversionLogDtoListResultModel } from '../models/DepositConversionLogDtoListResultModel';
import type { DepositDeleteResponseDtoResultModel } from '../models/DepositDeleteResponseDtoResultModel';
import type { DepositListRequestDto } from '../models/DepositListRequestDto';
import type { DepositListResponseDtoPagedResponseDtoResultModel } from '../models/DepositListResponseDtoPagedResponseDtoResultModel';
import type { DepositRecieptResponceDTOResultModel } from '../models/DepositRecieptResponceDTOResultModel';
import type { DepositUpdateResponceDtoResultModel } from '../models/DepositUpdateResponceDtoResultModel';
import type { GetBillDetailsDTOResultModel } from '../models/GetBillDetailsDTOResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { UpdateDepositCommand } from '../models/UpdateDepositCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepositService {
    /**
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVDepositBankList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Deposit/bankList',
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
    public static getApiVDepositGetCreatedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Deposit/GetCreatedby',
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
     * @returns DepositDeleteResponseDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVDeposit(
        version: string,
        tenant?: string,
        requestBody?: DeleteDepositIdCommand,
    ): CancelablePromise<DepositDeleteResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Deposit',
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
     * @returns DepositUpdateResponceDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVDeposit(
        version: string,
        tenant?: string,
        requestBody?: UpdateDepositCommand,
    ): CancelablePromise<DepositUpdateResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Deposit',
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
    public static getApiVDepositGetModifiedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Deposit/GetModifiedby',
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
     * @returns DepositListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVDepositList(
        version: string,
        tenant?: string,
        requestBody?: DepositListRequestDto,
    ): CancelablePromise<DepositListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Deposit/list',
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
     * @returns DepositRecieptResponceDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVDepositSave(
        version: string,
        tenant?: string,
        requestBody?: CreateDepositCommand,
    ): CancelablePromise<DepositRecieptResponceDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Deposit/Save',
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
     * @param receiptId
     * @param version
     * @param tenant
     * @returns GetBillDetailsDTOResultModel OK
     * @throws ApiError
     */
    public static getApiVDepositDeposit(
        receiptId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GetBillDetailsDTOResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Deposit/Deposit/{ReceiptId}',
            path: {
                'ReceiptId': receiptId,
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
    public static getApiVDepositGetDepositBlockingType(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Deposit/GetDepositBlockingType',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param patientId
     * @param version
     * @param tenant
     * @returns DepositConversionLogDtoListResultModel OK
     * @throws ApiError
     */
    public static getApiVDepositDepositConversionLog(
        patientId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<DepositConversionLogDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Deposit/DepositConversionLog/{patientId}',
            path: {
                'patientId': patientId,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
