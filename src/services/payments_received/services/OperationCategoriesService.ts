/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OperationCategoriesService {
    /**
     * Retrieves a list of operation categories
     * @param search Search term for operation category name or description
     * @returns any no operation categories found
     * @throws ApiError
     */
    public static getApiMnOperationCategories(
        search?: string,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
        description: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/operation_categories',
            query: {
                'search': search,
            },
        });
    }
}
