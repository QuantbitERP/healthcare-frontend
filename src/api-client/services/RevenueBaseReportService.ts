/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { RevenueReportRequestDto } from '../models/RevenueReportRequestDto';
import type { RevenueReportResponseDtoListResultModelResultModel } from '../models/RevenueReportResponseDtoListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RevenueBaseReportService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns RevenueReportResponseDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVRevenueBaseReportRevenuebasereport(
        version: string,
        tenant?: string,
        requestBody?: RevenueReportRequestDto,
    ): CancelablePromise<RevenueReportResponseDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/RevenueBaseReport/revenuebasereport',
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
