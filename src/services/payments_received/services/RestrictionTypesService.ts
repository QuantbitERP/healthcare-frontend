/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RestrictionTypesService {
    /**
     * Retrieves a list of restriction types
     * @param search Search term for restriction type name or description
     * @returns any no restriction types found
     * @throws ApiError
     */
    public static getApiMnRestrictionTypes(
        search?: string,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
        description: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/restriction_types',
            query: {
                'search': search,
            },
        });
    }
}
