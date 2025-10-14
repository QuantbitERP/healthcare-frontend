/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubSubDepartmentsService {
    /**
     * Retrieves a list of sub-sub-departments
     * @param search Search term for sub-sub-department name, sub-department name, or department name
     * @param departmentId Filter by department ID
     * @param subDepartmentId Filter by sub-department ID
     * @returns any no sub-sub-departments found
     * @throws ApiError
     */
    public static getApiMnSubSubDepartments(
        search?: string,
        departmentId?: number,
        subDepartmentId?: number,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
        sub_department_id: number;
        sub_department_name: string;
        department_id: number;
        department_name: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/sub_sub_departments',
            query: {
                'search': search,
                'department_id': departmentId,
                'sub_department_id': subDepartmentId,
            },
        });
    }
}
