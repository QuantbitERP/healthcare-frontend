/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GridPreferenceGetResponseDtoResultModel } from '../models/GridPreferenceGetResponseDtoResultModel';
import type { GridPreferenceSaveRequestDto } from '../models/GridPreferenceSaveRequestDto';
import type { GridPreferenceUpdateRequestDto } from '../models/GridPreferenceUpdateRequestDto';
import type { GuidResultModel } from '../models/GuidResultModel';
import type { StringListResultModel } from '../models/StringListResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GridPreferenceService {
    /**
     * @param userId
     * @param pageId
     * @param gridId
     * @param version
     * @param tenant
     * @returns GridPreferenceGetResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVGridPreference(
        userId: string,
        pageId: string,
        gridId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GridPreferenceGetResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/GridPreference/{userId}/{pageId}/{gridId}',
            path: {
                'userId': userId,
                'pageId': pageId,
                'gridId': gridId,
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
     * @returns GuidResultModel OK
     * @throws ApiError
     */
    public static postApiVGridPreference(
        version: string,
        tenant?: string,
        requestBody?: GridPreferenceSaveRequestDto,
    ): CancelablePromise<GuidResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/GridPreference',
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
     * @returns GuidResultModel OK
     * @throws ApiError
     */
    public static putApiVGridPreference(
        version: string,
        tenant?: string,
        requestBody?: GridPreferenceUpdateRequestDto,
    ): CancelablePromise<GuidResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/GridPreference',
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
     * @returns StringListResultModel OK
     * @throws ApiError
     */
    public static getApiVGridPreferencePagelist(
        version: string,
        tenant?: string,
    ): CancelablePromise<StringListResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/GridPreference/pagelist',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
