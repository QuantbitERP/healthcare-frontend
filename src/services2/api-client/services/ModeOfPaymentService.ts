/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateModeOfpaymentCommand } from '../models/CreateModeOfpaymentCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { ModeOfPaymentDeleteResponseDtoListResultModel } from '../models/ModeOfPaymentDeleteResponseDtoListResultModel';
import type { ModeOfPaymentListRequestDto } from '../models/ModeOfPaymentListRequestDto';
import type { ModeOfPaymentListResponseDtoPagedResponseDtoResultModel } from '../models/ModeOfPaymentListResponseDtoPagedResponseDtoResultModel';
import type { ModeOfPaymentRequestDtoResultModel } from '../models/ModeOfPaymentRequestDtoResultModel';
import type { ModeOfPaymentResponseDtoResultModel } from '../models/ModeOfPaymentResponseDtoResultModel';
import type { UpdateModeOfPaymentCommand } from '../models/UpdateModeOfPaymentCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModeOfPaymentService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ModeOfPaymentListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVModeOfPaymentModeOfPaymentTypeByFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: ModeOfPaymentListRequestDto,
    ): CancelablePromise<ModeOfPaymentListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ModeOfPayment/modeOfPaymentTypeByFilterWithSearch',
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
    public static getApiVModeOfPaymentGetPaymentType(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ModeOfPayment/getPaymentType',
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
    public static getApiVModeOfPaymentGetCreatedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ModeOfPayment/getCreatedbyUser',
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
    public static getApiVModeOfPaymentGetModifiedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ModeOfPayment/getModifiedbyUser',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVModeOfPaymentModeOfPaymentPdf(
        version: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ModeOfPayment/modeOfPayment/pdf',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVModeOfPaymentModeOfPaymentExcel(
        version: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ModeOfPayment/modeOfPayment/excel',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVModeOfPaymentModeOfPaymentWord(
        version: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ModeOfPayment/modeOfPayment/word',
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
     * @returns ModeOfPaymentResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVModeOfPayment(
        version: string,
        tenant?: string,
        requestBody?: CreateModeOfpaymentCommand,
    ): CancelablePromise<ModeOfPaymentResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ModeOfPayment',
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
     * @returns ModeOfPaymentResponseDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVModeOfPayment(
        version: string,
        tenant?: string,
        requestBody?: UpdateModeOfPaymentCommand,
    ): CancelablePromise<ModeOfPaymentResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ModeOfPayment',
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
     * @returns ModeOfPaymentDeleteResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVModeOfPayment(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<ModeOfPaymentDeleteResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ModeOfPayment',
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
     * @returns ModeOfPaymentRequestDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVModeOfPayment(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<ModeOfPaymentRequestDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ModeOfPayment/{id}',
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
