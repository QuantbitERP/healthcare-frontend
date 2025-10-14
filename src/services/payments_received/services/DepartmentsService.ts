/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepartmentsService {
    /**
     * Retrieves a list of departments for dropdown
     * @param search Search term to filter departments by name
     * @returns any no departments found
     * @throws ApiError
     */
    public static getApiMnDepartments(
        search?: string,
    ): CancelablePromise<{
        departments: Array<{
            id: number;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/departments',
            query: {
                'search': search,
            },
        });
    }
}
