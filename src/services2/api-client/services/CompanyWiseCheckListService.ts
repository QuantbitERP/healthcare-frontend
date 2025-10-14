/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CompanyWiseCheckListSerachFilterRequestDto } from '../models/CompanyWiseCheckListSerachFilterRequestDto';
import type { CompanyWiseCheckListSerachFilterResponseDtoPagedResponseDtoResultModel } from '../models/CompanyWiseCheckListSerachFilterResponseDtoPagedResponseDtoResultModel';
import type { CompanyWiseClaimCheckListResponseDtoListResultModel } from '../models/CompanyWiseClaimCheckListResponseDtoListResultModel';
import type { CreateCompanyWiseClaimCheckCommand } from '../models/CreateCompanyWiseClaimCheckCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CompanyWiseCheckListService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns CompanyWiseCheckListSerachFilterResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVCompanyWiseclaimCheckListFilterSearchList(
        version: string,
        tenant?: string,
        requestBody?: CompanyWiseCheckListSerachFilterRequestDto,
    ): CancelablePromise<CompanyWiseCheckListSerachFilterResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/companyWiseclaimCheckList/FilterSearchList',
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
     * @returns CompanyWiseClaimCheckListResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static postApiVCompanyWiseclaimCheckListSave(
        version: string,
        tenant?: string,
        requestBody?: CreateCompanyWiseClaimCheckCommand,
    ): CancelablePromise<CompanyWiseClaimCheckListResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/companyWiseclaimCheckList/save',
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
    public static getApiVCompanyWiseclaimCheckListGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/companyWiseclaimCheckList/GetCreatedBy',
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
    public static getApiVCompanyWiseclaimCheckListGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/companyWiseclaimCheckList/GetModifiedBy',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
