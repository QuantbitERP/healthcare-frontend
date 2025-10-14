/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DailyAutoChargesService {
    /**
     * Retrieves a list of room categories for daily auto charges
     * @param search Search term for room category name or description
     * @returns any no room categories found
     * @throws ApiError
     */
    public static getApiMnDailyAutoCharges(
        search?: string,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
        description: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/daily_auto_charges',
            query: {
                'search': search,
            },
        });
    }
}
