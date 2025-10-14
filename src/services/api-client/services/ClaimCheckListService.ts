/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ClaimCheckListRequestDto } from '../models/ClaimCheckListRequestDto';
import type { ClaimCheckListSaveRequestDto } from '../models/ClaimCheckListSaveRequestDto';
import type { ClaimCheckListByIdDtoResultModel } from '../models/ClaimCheckListByIdDtoResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ClaimCheckListService {
    /**
     * Get claim checklist by ID
     * @param id
     * @param version
     * @param tenant
     * @returns ClaimCheckListDto OK
     * @throws ApiError
     */
    public static getApiVClaimCheckList(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<ClaimCheckListByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ClaimCheckList/{id}',
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
     * Save claim checklist (create or update)
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVClaimCheckListSave(
        version: string,
        tenant?: string,
        requestBody?: ClaimCheckListSaveRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ClaimCheckList/Save',
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
     * Delete claim checklist
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVClaimCheckList(
        version: string,
        tenant?: string,
        requestBody?: { model: { ids: string[] } },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ClaimCheckList/Delete',
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
     * Get created by users list
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVClaimCheckListGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ClaimCheckList/GetCreatedBy',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }

    /**
     * Get modified by users list
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVClaimCheckListGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ClaimCheckList/GetModifiedBy',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }

    /**
     * Filter and search claim checklist list
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVClaimCheckListFilterSearchList(
        version: string,
        tenant?: string,
        requestBody?: ClaimCheckListRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ClaimCheckList/FilterSearchList',
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
     * Update claim checklist
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVClaimCheckList(
        version: string,
        tenant?: string,
        requestBody?: ClaimCheckListSaveRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ClaimCheckList',
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
