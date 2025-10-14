/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServicesService {
    /**
     * Retrieves a list of services
     * @param search Search term for service name or service code
     * @param departmentId Filter by department ID
     * @param subDepartmentId Filter by sub-department ID
     * @param status Filter by status (active/inactive):
     * * `active`
     * * `inactive`
     *
     * @param codeType Filter by code type
     * @param hospitalId Filter by hospital ID
     * @param operationCategory Filter by operation category
     * @param createdBy Filter by creator name
     * @param modifiedBy Filter by modifier name
     * @param rateName Filter by rate name
     * @param dailyAutoCharges Filter by daily auto charges
     * @param oneTimeService Filter by one-time service
     * @param meMode Filter by ME mode
     * @param startDate Filter by start date
     * @param endDate Filter by end date
     * @param page Page number for pagination
     * @param perPage Number of items per page
     * @param sortBy Field to sort by
     * @param sortOrder Sort order (asc/desc)
     * @returns any no services found
     * @throws ApiError
     */
    public static getApiMnServices(
        search?: string,
        departmentId?: number,
        subDepartmentId?: number,
        status?: string,
        codeType?: string,
        hospitalId?: number,
        operationCategory?: string,
        createdBy?: string,
        modifiedBy?: string,
        rateName?: string,
        dailyAutoCharges?: boolean,
        oneTimeService?: boolean,
        meMode?: string,
        startDate?: string,
        endDate?: string,
        page?: number,
        perPage?: number,
        sortBy?: string,
        sortOrder?: string,
    ): CancelablePromise<{
        services?: Array<{
            id?: number;
            name?: string;
            code_type?: 'Service';
            service_code?: string;
            status?: 'active' | 'inactive';
            department_id?: number;
            department_name?: string;
            sub_department_id?: number;
            sub_department_name?: string;
            hospital_id?: number;
            hospital_name?: string;
        }>;
        meta?: {
            total_count?: number;
            total_pages?: number;
            current_page?: number;
            per_page?: number;
            sort_by?: string;
            sort_order?: 'asc' | 'desc';
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/services',
            query: {
                'search': search,
                'department_id': departmentId,
                'sub_department_id': subDepartmentId,
                'status': status,
                'code_type': codeType,
                'hospital_id': hospitalId,
                'operation_category': operationCategory,
                'created_by': createdBy,
                'modified_by': modifiedBy,
                'rate_name': rateName,
                'daily_auto_charges': dailyAutoCharges,
                'one_time_service': oneTimeService,
                'me_mode': meMode,
                'start_date': startDate,
                'end_date': endDate,
                'page': page,
                'per_page': perPage,
                'sort_by': sortBy,
                'sort_order': sortOrder,
            },
        });
    }
    /**
     * Creates or updates a service
     * @param requestBody
     * @returns any service updated
     * @throws ApiError
     */
    public static postApiMnServices(
        requestBody?: {
            /**
             * Service ID (required for update, omit for create)
             */
            id?: number;
            name: string;
            code: string;
            alias_name: string;
            code_type_id: number;
            department_id: number;
            sub_department_id: number;
            service_group_id: number;
            service_sub_group_id: number;
            operation_category_id: number;
            sub_sub_department_id: number;
            restriction_type_id: number;
            repeatable_type_id: number;
            time: string;
            time_days_list_id: number;
        },
    ): CancelablePromise<{
        id?: number;
        name?: string;
        code?: string;
        alias_name?: string;
        code_type_id?: number;
        department_id?: number;
        sub_department_id?: number;
        service_group_id?: number;
        service_sub_group_id?: number;
        operation_category_id?: number;
        sub_sub_department_id?: number;
        restriction_type_id?: number;
        repeatable_type_id?: number;
        time?: string;
        time_days_list_id?: number;
        status?: string;
        created_by?: {
            id?: number;
            name?: string;
        };
        created_on?: string;
        modified_by?: {
            id?: number;
            name?: string;
        };
        modified_on?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/services',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `service not found`,
                422: `invalid request`,
            },
        });
    }
    /**
     * Retrieves service statistics
     * @param startDate Start date for filtering statistics
     * @param endDate End date for filtering statistics
     * @returns any service statistics retrieved
     * @throws ApiError
     */
    public static getApiMnServicesStats(
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<{
        service_stats?: {
            total_count?: number;
            active_count?: number;
            deactive_count?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/services/stats',
            query: {
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                400: `invalid date range`,
            },
        });
    }
    /**
     * Deactivates a service
     * @param id ID of the service to deactivate
     * @returns any service deactivated
     * @throws ApiError
     */
    public static postApiMnServicesDeactivate(
        id: number,
    ): CancelablePromise<{
        message?: string;
        service?: {
            id?: number;
            status?: string;
            deactivated_at?: string;
            deactivated_by?: {
                id?: number;
                name?: string;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/services/{id}/deactivate',
            path: {
                'id': id,
            },
            errors: {
                404: `service not found`,
            },
        });
    }
    /**
     * Retrieves a service for editing
     * @param id ID of the service to retrieve for editing
     * @returns any service found
     * @throws ApiError
     */
    public static getApiMnServicesEdit(
        id: number,
    ): CancelablePromise<{
        id?: number;
        name?: string;
        code?: string;
        alias_name?: string;
        code_type_id?: number;
        department_id?: number;
        sub_department_id?: number;
        service_group_id?: number;
        service_sub_group_id?: number;
        operation_category_id?: number;
        sub_sub_department_id?: number;
        restriction_type_id?: number;
        repeatable_type_id?: number;
        time?: string;
        time_days_list_id?: number;
        status?: string;
        created_by?: {
            id?: number;
            name?: string;
        };
        created_on?: string;
        modified_by?: {
            id?: number;
            name?: string;
        };
        modified_on?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/services/{id}/edit',
            path: {
                'id': id,
            },
            errors: {
                404: `service not found`,
            },
        });
    }
    /**
     * Retrieves a list of composite services for a given service
     * @param serviceId ID of the service to get composite services for
     * @returns any composite services found
     * @throws ApiError
     */
    public static getApiMnServicesComposite(
        serviceId: number,
    ): CancelablePromise<{
        composite_services?: Array<{
            id?: number;
            service_id?: number;
            hospital_id?: number;
            is_printable?: boolean;
            created_by?: {
                id?: number;
                name?: string;
            };
            created_on?: string;
            modified_by?: {
                id?: number;
                name?: string;
            };
            modified_on?: string;
        }>;
        count?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/services/{service_id}/composite',
            path: {
                'service_id': serviceId,
            },
            errors: {
                404: `service not found`,
            },
        });
    }
    /**
     * Creates or updates multiple composite services
     * @param serviceId ID of the service to get composite services for
     * @param requestBody
     * @returns any composite services created or updated
     * @throws ApiError
     */
    public static postApiMnServicesComposite(
        serviceId: number,
        requestBody?: {
            services: Array<{
                /**
                 * Service ID (required for update, omit for create)
                 */
                id?: number;
                service_id: number;
                hospital_id: number;
                is_printable: boolean;
            }>;
        },
    ): CancelablePromise<{
        services?: Array<{
            id?: number;
            service_id?: number;
            hospital_id?: number;
            is_printable?: boolean;
            created_by?: {
                id?: number;
                name?: string;
            };
            created_on?: string;
            modified_by?: {
                id?: number;
                name?: string;
            };
            modified_on?: string;
        }>;
        message?: string;
        created_count?: number;
        updated_count?: number;
        total_count?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/services/{service_id}/composite',
            path: {
                'service_id': serviceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `invalid request - missing parameters`,
            },
        });
    }
    /**
     * Deletes multiple composite services
     * @param serviceId ID of the service to get composite services for
     * @param requestBody
     * @returns any composite services deleted
     * @throws ApiError
     */
    public static deleteApiMnServicesComposite(
        serviceId: number,
        requestBody?: {
            /**
             * Array of composite service IDs to delete
             */
            service_ids: Array<number>;
        },
    ): CancelablePromise<{
        deleted_ids?: Array<number>;
        message?: string;
        count?: number;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/mn/services/{service_id}/composite',
            path: {
                'service_id': serviceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `invalid request`,
            },
        });
    }
    /**
     * Retrieves a list of hospitals for a given service
     * @param serviceId ID of the service to get hospitals for
     * @returns any hospitals found
     * @throws ApiError
     */
    public static getApiMnServicesHospitals(
        serviceId: number,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
        no_of_permission: number;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/services/{service_id}/hospitals',
            path: {
                'service_id': serviceId,
            },
            errors: {
                404: `service not found`,
            },
        });
    }
    /**
     * Retrieves hospital details for editing
     * @param serviceId ID of the service
     * @param hospitalId ID of the hospital to get details for editing
     * @returns any hospital found
     * @throws ApiError
     */
    public static getApiMnServicesHospital(
        serviceId: number,
        hospitalId: number,
    ): CancelablePromise<{
        id: number;
        name: string;
        code: string;
        type: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
        phone: string;
        email: string;
        website: string;
        no_of_permission: number;
        status: string;
        created_by: {
            id?: number;
            name?: string;
        };
        created_on: string;
        modified_by: {
            id?: number;
            name?: string;
        };
        modified_on: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/services/{service_id}/hospital/{hospital_id}',
            path: {
                'service_id': serviceId,
                'hospital_id': hospitalId,
            },
            errors: {
                404: `hospital not found`,
            },
        });
    }
}
