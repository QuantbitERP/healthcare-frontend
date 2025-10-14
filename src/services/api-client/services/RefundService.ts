/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { RefundSearchRequestDto } from '../models/RefundSearchRequestDto';
import type { RefundStatusCountDto } from '../models/RefundStatusCountDto';
import type { SaveRefundDto } from '../models/SaveRefundDto';
import type { SaveRefundRequestDto } from '../models/SaveRefundRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RefundService {
    /**
     * @param version
     * @param formDate
     * @param toDate
     * @param tenant
     * @returns RefundStatusCountDto OK
     * @throws ApiError
     */
    public static getApiVRefundRefundStatusCount(
        version: string,
        formDate?: string,
        toDate?: string,
        tenant?: string,
    ): CancelablePromise<RefundStatusCountDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Refund/refundStatusCount',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'formDate': formDate,
                'toDate': toDate,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns RefundStatusCountDto OK
     * @throws ApiError
     */
    public static postApiVRefundGetRefundByFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: RefundSearchRequestDto,
    ): CancelablePromise<RefundStatusCountDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Refund/getRefundByFilterWithSearch',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRefundGetRefundType(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Refund/getRefundType',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRefundRefundScope(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Refund/refundScope',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRefundStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Refund/status',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRefundApprovedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Refund/approvedBy',
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
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVRefund(
        version: string,
        tenant?: string,
        requestBody?: SaveRefundRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Refund',
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
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVRefund(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/Refund',
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
    public static putApiVRefund(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: SaveRefundRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/Refund/{id}',
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
     * @returns SaveRefundDto OK
     * @throws ApiError
     */
    public static getApiVRefund(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<SaveRefundDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Refund/{id}',
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
     * @param billid
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVRefundGetBillByserviceDetails(
        version: string,
        billid?: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Refund/getBillByserviceDetails',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'Billid': billid,
            },
        });
    }
}
