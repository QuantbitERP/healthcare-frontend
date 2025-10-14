/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateModeOfpaymentCommand } from '../models/CreateModeOfpaymentCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { ModeOfPaymentListRequestDto } from '../models/ModeOfPaymentListRequestDto';
import type { ModeOfPaymentListResponseDtoResultModel } from '../models/ModeOfPaymentListResponseDtoResultModel';
import type { ModeOfPaymentRequestDtoResultModel } from '../models/ModeOfPaymentRequestDtoResultModel';
import type { ModeOfPaymentResponseDtoResultModel } from '../models/ModeOfPaymentResponseDtoResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModeOfPaymentService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ModeOfPaymentListResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVModeOfPaymentModeOfPaymentTypeByFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: ModeOfPaymentListRequestDto,
    ): CancelablePromise<ModeOfPaymentListResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ModeOfPayment/modeOfPaymentTypeByFilterWithSearch',
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
            url: '/api/v1/ModeOfPayment/getPaymentType',
           
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
            url: '/api/v1/ModeOfPayment/getCreatedbyUser',
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
            url: '/api/v1/ModeOfPayment/getModifiedbyUser',
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
            url: '/api/v1/ModeOfPayment/modeOfPayment/pdf',
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
            url: '/api/v1/ModeOfPayment/modeOfPayment/excel',
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
            url: '/api/v1/ModeOfPayment/modeOfPayment/word',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    // /**
    //  * @param version
    //  * @param tenant
    //  * @param requestBody
    //  * @returns ModeOfPaymentResponseDtoResultModel OK
    //  * @throws ApiError
    //  */
    public static postApiVModeOfPaymentSave(
        version: string,
        tenant?: string,
        requestBody?: CreateModeOfpaymentCommand,
    ): CancelablePromise<ModeOfPaymentResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ModeOfPayment',
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
    //  * @param version
    //  * @param tenant
    //  * @param requestBody
    //  * @returns ModeOfPaymentResponseDtoResultModel OK
    //  * @throws ApiError
    //  */
    public static putApiVModeOfPaymentUpdate(
        version: string,
        tenant?: string,
        requestBody?: CreateModeOfpaymentCommand,
    ): CancelablePromise<ModeOfPaymentResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ModeOfPayment/Update',
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
    public static deleteApiVModeOfPayment(
        version: string,
        tenant?: string,
        requestBody?:string[],
    ): CancelablePromise<ModeOfPaymentResponseDtoResultModel> {
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
            url: '/api/v1/ModeOfPayment/{id}',
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
