import { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { ApprovedBy, RefundScope, RefundScoreDto, RefundsListRequestDto, RefundsListResponseDto, RefundStatus, RefundType, RefundsDto, ServiceDetail } from "../models/RefundsDto";
import { request as __request } from '../core/request';


export class RefundsService {
    /**
     * @param requestBody
     * @returns GetBillsResponse Success
     * @throws ApiError
     */
    public static postApiV1Refunds(requestBody?: RefundsListRequestDto): CancelablePromise<RefundsListResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Refund/getRefundByFilterWithSearch',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    public static postApiV1RefundScore(fromDate:string,toDate:string): CancelablePromise<RefundScoreDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Refund/refundStatusCount',
            query:{
                fromDate:fromDate,
                toDate:toDate
            },
            mediaType: 'application/json',
        });
    }
    public static postApiV1RefundsStatus(
    ): CancelablePromise<Array<RefundStatus>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Refund/status',
            mediaType: 'application/json',
        });
    }
    public static postApiV1RefundScope(): CancelablePromise<Array<RefundScope>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Refund/refundScope',
            mediaType: 'application/json',
        });
    }
    public static postApiV1RefundType(): CancelablePromise<Array<RefundType>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Refund/getRefundType',
            mediaType: 'application/json',
        });
    }
    public static postApiV1RefundApporvedBy(): CancelablePromise<Array<ApprovedBy>>
     {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Refund/approvedBy',
            mediaType: 'application/json',
        });
    }
    public static GetRefundById(refundId: string): CancelablePromise<RefundsDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: `/api/v1/Refund/${refundId}`,
            mediaType: 'application/json',
        });
    }
    public static putApiV1Refund(refundId: string, requestBody: RefundsDto): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: `/api/v1/Refund/${refundId}`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    public static deleteApiV1Refund(refundIdList: string[]): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/Refund',
            body: refundIdList,
            mediaType: 'application/json',
        });
    }
    public static getBillByserviceDetails(Billid: string): CancelablePromise<Array<ServiceDetail>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Refund/getBillByserviceDetails',
            query: { Billid },
            mediaType: 'application/json',
        });
    }
    
}