/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RepeatableTypesService {
    /**
     * Retrieves a list of repeatable types
     * @param search Search term for repeatable type name or description
     * @returns any no repeatable types found
     * @throws ApiError
     */
    public static getApiMnRepeatableTypes(
        search?: string,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
        description: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/repeatable_types',
            query: {
                'search': search,
            },
        });
    }
}
