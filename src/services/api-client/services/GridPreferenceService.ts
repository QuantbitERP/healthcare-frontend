/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GridPreferenceDto } from '../models/GridPreferenceDto';
import type { GridPreferenceDtoResultModel } from '../models/GridPreferenceDtoResultModel';
import type { GuidResultModel } from '../models/GuidResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GridPreferenceService {
    /**
     * @param userId
     * @param pageId
     * @param version
     * @param tenant
     * @returns GridPreferenceDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVGridPreference(
        userId: string,
        pageId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GridPreferenceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/GridPreference/{userId}/{pageId}',
            path: {
                'userId': userId,
                'pageId': pageId,
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
        requestBody?: GridPreferenceDto,
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
}
