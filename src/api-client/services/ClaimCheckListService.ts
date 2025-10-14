/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { ClaimCheckListDto } from '../models/ClaimCheckListDto';
import type { ClaimCheckListRequestDto } from '../models/ClaimCheckListRequestDto';
import type { ClaimCheckListSaveRequestDto } from '../models/ClaimCheckListSaveRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClaimCheckListService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ClaimCheckListDto OK
     * @throws ApiError
     */
    public static postApiVClaimCheckListList(
        version: string,
        tenant?: string,
        requestBody?: ClaimCheckListRequestDto,
    ): CancelablePromise<Array<ClaimCheckListDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ClaimCheckList/list',
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
     * @returns ClaimCheckListDto OK
     * @throws ApiError
     */
    public static getApiVClaimCheckList(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<ClaimCheckListDto> {
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
     * @param id
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVClaimCheckList(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: ClaimCheckListSaveRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ClaimCheckList/{id}',
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
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVClaimCheckList(
        version: string,
        tenant?: string,
        requestBody?: ClaimCheckListSaveRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
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
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVClaimCheckList(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
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
