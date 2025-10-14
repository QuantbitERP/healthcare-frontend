/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { GetServicewiseBillReportDto } from '../models/GetServicewiseBillReportDto';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { ServicewiseBillReportDtoListResultModelResultModel } from '../models/ServicewiseBillReportDtoListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServicewiseBillReportService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ServicewiseBillReportDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVServicewiseBillReportServicewisebillreport(
        version: string,
        tenant?: string,
        requestBody?: GetServicewiseBillReportDto,
    ): CancelablePromise<ServicewiseBillReportDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ServicewiseBillReport/servicewisebillreport',
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
    public static getApiVServicewiseBillReportGroupby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServicewiseBillReport/groupby',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
