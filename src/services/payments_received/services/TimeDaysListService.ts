/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TimeDaysListService {
    /**
     * Retrieves a list of time units
     * @param search Search term for time unit name or description
     * @returns any no time units found
     * @throws ApiError
     */
    public static getApiMnTimeDaysList(
        search?: string,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
        description: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/time_days_list',
            query: {
                'search': search,
            },
        });
    }
}
