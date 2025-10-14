/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelClaimChecklistResponseDtoListResultModel } from '../models/CancelClaimChecklistResponseDtoListResultModel';
import type { ClaimCheckListByIdDtoResultModel } from '../models/ClaimCheckListByIdDtoResultModel';
import type { ClaimCheckListSaveResponseDtoResultModel } from '../models/ClaimCheckListSaveResponseDtoResultModel';
import type { ClaimCheckListSerachFilterRequestDto } from '../models/ClaimCheckListSerachFilterRequestDto';
import type { ClaimCheckListSerachFilterResponseDtoPagedResponseDtoResultModel } from '../models/ClaimCheckListSerachFilterResponseDtoPagedResponseDtoResultModel';
import type { CreateClaimCheckCommand } from '../models/CreateClaimCheckCommand';
import type { DeleteClaimChecklistCommand } from '../models/DeleteClaimChecklistCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { UpdateClaimCheckListCommand } from '../models/UpdateClaimCheckListCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClaimCheckListService {
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns ClaimCheckListByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVClaimCheckList(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<ClaimCheckListByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ClaimCheckList/{Id}',
            path: {
                'Id': id,
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
     * @returns ClaimCheckListSaveResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVClaimCheckListSave(
        version: string,
        tenant?: string,
        requestBody?: CreateClaimCheckCommand,
    ): CancelablePromise<ClaimCheckListSaveResponseDtoResultModel> {
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
     * @param version
     * @param tenant
     * @param requestBody
     * @returns CancelClaimChecklistResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVClaimCheckListDelete(
        version: string,
        tenant?: string,
        requestBody?: DeleteClaimChecklistCommand,
    ): CancelablePromise<CancelClaimChecklistResponseDtoListResultModel> {
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
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVClaimCheckListGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
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
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVClaimCheckListGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
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
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ClaimCheckListSerachFilterResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVClaimCheckListFilterSearchList(
        version: string,
        tenant?: string,
        requestBody?: ClaimCheckListSerachFilterRequestDto,
    ): CancelablePromise<ClaimCheckListSerachFilterResponseDtoPagedResponseDtoResultModel> {
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
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ClaimCheckListSaveResponseDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVClaimCheckList(
        version: string,
        tenant?: string,
        requestBody?: UpdateClaimCheckListCommand,
    ): CancelablePromise<ClaimCheckListSaveResponseDtoResultModel> {
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
