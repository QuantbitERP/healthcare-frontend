/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmployeesService {
    /**
     * Retrieves a list of employees
     * @param employeeCode Filter by employee code (case-insensitive partial match)
     * @param employeeName Filter by employee name (case-insensitive partial match)
     * @param categoryId Filter by category ID
     * @param designationId Filter by designation ID
     * @param doctorId Filter by doctor ID
     * @param sortBy Field to sort by:
     * * `employee_id`
     * * `employee_code`
     * * `employee_name`
     * * `category_name`
     * * `designation_name`
     * * `doctor_name`
     * * `modified_on`
     * * `created_on`
     *
     * @param sortOrder Sort order (asc/desc)
     * @param page Page number for pagination
     * @param perPage Number of items per page
     * @returns any employees filtered by doctor
     * @throws ApiError
     */
    public static getApiMnEmployees(
        employeeCode?: string,
        employeeName?: string,
        categoryId?: number,
        designationId?: number,
        doctorId?: number,
        sortBy?: string,
        sortOrder?: string,
        page?: number,
        perPage?: number,
    ): CancelablePromise<{
        employees: Array<{
            employee_id: number;
            employee_name: string;
            employee_code: string;
            category_id: number;
            category_name: string;
            designation_id: number;
            designation_name: string;
            doctor_id: number;
            doctor_name: string;
            modified_on: string;
            modified_by: string;
            created_on: string;
            created_by: string;
        }>;
        meta: {
            total_count: number;
            total_pages: number;
            current_page: number;
            per_page: number;
            sort_by: string;
            sort_order: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/employees',
            query: {
                'employee_code': employeeCode,
                'employee_name': employeeName,
                'category_id': categoryId,
                'designation_id': designationId,
                'doctor_id': doctorId,
                'sort_by': sortBy,
                'sort_order': sortOrder,
                'page': page,
                'per_page': perPage,
            },
        });
    }
    /**
     * Retrieves a list of designations
     * @param search Search designations by name (case-insensitive partial match)
     * @returns any all designations
     * @throws ApiError
     */
    public static getApiMnEmployeesDesignations(
        search?: string,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/employees/designations',
            query: {
                'search': search,
            },
        });
    }
    /**
     * Retrieves column configurations for employees list
     * @returns any columns found
     * @throws ApiError
     */
    public static getApiMnEmployeesColumns(): CancelablePromise<Array<{
        id: string;
        name: string;
        selected: boolean;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/employees/columns',
        });
    }
    /**
     * Saves column configurations for employees list
     * @param requestBody
     * @returns any columns saved successfully
     * @throws ApiError
     */
    public static postApiMnEmployeesColumns(
        requestBody?: {
            columns: Array<{
                id: string;
                name: string;
                selected: boolean;
            }>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/employees/columns',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `invalid column configuration`,
            },
        });
    }
    /**
     * Saves employee transferring limit
     * @param requestBody
     * @returns any transferring limit saved successfully
     * @throws ApiError
     */
    public static postApiMnEmployeesTransferringLimit(
        requestBody?: {
            /**
             * ID of the employee
             */
            employee_id: number;
            /**
             * Transferring limit amount
             */
            transferring_limit: number;
            /**
             * User who modified the limit
             */
            modified_by?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/employees/transferring_limit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `invalid transferring limit format`,
            },
        });
    }
    /**
     * Deletes employee transferring limit
     * @param employeeId ID of the employee whose transferring limit is to be deleted
     * @param deletedBy User who deleted the limit
     * @returns any transferring limit deleted successfully
     * @throws ApiError
     */
    public static deleteApiMnEmployeesTransferringLimit(
        employeeId: number,
        deletedBy?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/mn/employees/transferring_limit',
            query: {
                'employee_id': employeeId,
                'deleted_by': deletedBy,
            },
            errors: {
                422: `missing employee ID`,
            },
        });
    }
    /**
     * Retrieves field definitions for employee transferring limits
     * @returns any fields found
     * @throws ApiError
     */
    public static getApiMnEmployeesTransferringLimitFields(): CancelablePromise<Array<{
        id: string;
        name: string;
        type: 'integer' | 'string' | 'number' | 'datetime';
        required: boolean;
        editable: boolean;
        visible: boolean;
        order: number;
        validation?: {
            min?: number;
            message?: string;
        };
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/employees/transferring_limit/fields',
        });
    }
}
