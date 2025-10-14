/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatusesService {
    /**
     * Retrieves a list of statuses for dropdown
     * @param search Search term to filter statuses by name
     * @returns any no statuses found
     * @throws ApiError
     */
    public static getApiMnStatuses(
        search?: string,
    ): CancelablePromise<{
        statuses: Array<{
            id: number;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/statuses',
            query: {
                'search': search,
            },
        });
    }
}
