/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ClaimCheckListDataDto } from '../models/ClaimCheckListDataDto';
import type { CompanyWiseClaimCheckListDtoWithoutSubList } from '../models/CompanyWiseClaimCheckListDtoWithoutSubList';
import type { CompanyWiseClaimCheckListRequestDto } from '../models/CompanyWiseClaimCheckListRequestDto';
import type { CompanyWiseClaimCheckListSaveRequestDto } from '../models/CompanyWiseClaimCheckListSaveRequestDto';
import type { CompanyWiseClaimCheckListUpdateRequestrDTO } from '../models/CompanyWiseClaimCheckListUpdateRequestrDTO';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CompanyWiseCheckListService {
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns ClaimCheckListDataDto OK
     * @throws ApiError
     */
    public static getApiVCompanyWiseclaimCheckList(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<ClaimCheckListDataDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/companyWiseclaimCheckList/{id}',
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
     * @param requestBody
     * @returns CompanyWiseClaimCheckListDtoWithoutSubList OK
     * @throws ApiError
     */
    public static postApiVCompanyWiseclaimCheckListList(
        version: string,
        tenant?: string,
        requestBody?: CompanyWiseClaimCheckListRequestDto,
    ): CancelablePromise<Array<CompanyWiseClaimCheckListDtoWithoutSubList>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'api/v1/companyWiseclaimCheckList/FilterSearchList',
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
     * @param id
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVCompanyWiseclaimCheckListUpdate(
        version: string,
        id?: string,
        tenant?: string,
        requestBody?: CompanyWiseClaimCheckListUpdateRequestrDTO,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/companyWiseclaimCheckList/Update',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'id': id,
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
    public static postApiVCompanyWiseclaimCheckList(
        version: string,
        tenant?: string,
        requestBody?: CompanyWiseClaimCheckListSaveRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/companyWiseclaimCheckList',
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
    public static postApiVCompanyWiseclaimCheckListSave(
        version: string,
        tenant?: string,
        requestBody?: CompanyWiseClaimCheckListSaveRequestDto,
    ): CancelablePromise<any> {
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
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVCompanyWiseclaimCheckList(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/companyWiseclaimCheckList',
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

    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns CompanyWiseClaimCheckListDtoWithoutSubList OK
     * @throws ApiError
     */
    public static getApiVCompanyWiseclaimCheckListFilterSearchList(
        version: string,
        tenant?: string,
        requestBody?: CompanyWiseClaimCheckListRequestDto,
    ): CancelablePromise<Array<CompanyWiseClaimCheckListDtoWithoutSubList>> {
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
}
