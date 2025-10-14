/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubDepartmentsService {
    /**
     * Retrieves a list of sub-departments for dropdown
     * @param search Search term to filter sub-departments by name
     * @param departmentId Filter sub-departments by department ID
     * @returns any no sub-departments found
     * @throws ApiError
     */
    public static getApiMnSubDepartments(
        search?: string,
        departmentId?: number,
    ): CancelablePromise<{
        sub_departments: Array<{
            id: number;
            name: string;
            department_id: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/sub_departments',
            query: {
                'search': search,
                'department_id': departmentId,
            },
        });
    }
}
