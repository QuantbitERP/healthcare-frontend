/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateInvoicingCommand } from '../models/CreateInvoicingCommand';
import type { InvoicingSaveResponseDTOResultModel } from '../models/InvoicingSaveResponseDTOResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { UpdateInvoicingCommand } from '../models/UpdateInvoicingCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvoicingService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVInvoicingGetBillTypeEnum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Invoicing/GetBillTypeEnum',
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
    public static getApiVInvoicingGetBillStatusType(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Invoicing/GetBillStatusType',
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
     * @returns InvoicingSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVInvoicing(
        version: string,
        tenant?: string,
        requestBody?: CreateInvoicingCommand,
    ): CancelablePromise<InvoicingSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Invoicing',
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
     * @returns InvoicingSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVInvoicing(
        version: string,
        tenant?: string,
        requestBody?: UpdateInvoicingCommand,
    ): CancelablePromise<InvoicingSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Invoicing',
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
