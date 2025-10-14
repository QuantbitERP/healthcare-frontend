/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HospitalsService {
    /**
     * Retrieves a list of hospitals for dropdown
     * @param search Search term to filter hospitals by name
     * @returns any no hospitals found
     * @throws ApiError
     */
    public static getApiMnHospitals(
        search?: string,
    ): CancelablePromise<{
        hospitals: Array<{
            id: number;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/hospitals',
            query: {
                'search': search,
            },
        });
    }
}
