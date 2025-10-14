/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RatesService {
    /**
     * Retrieves rate names for dropdown
     * @returns any rate names retrieved
     * @throws ApiError
     */
    public static getApiMnRateNames(): CancelablePromise<{
        rate_names: Array<{
            id: string;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/rate_names',
        });
    }
    /**
     * Retrieves rate types for dropdown
     * @returns any rate types retrieved
     * @throws ApiError
     */
    public static getApiMnRateTypes(): CancelablePromise<{
        rate_types: Array<{
            id: string;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/rate_types',
        });
    }
    /**
     * Retrieves form types for dropdown
     * @returns any form types retrieved
     * @throws ApiError
     */
    public static getApiMnFormTypes(): CancelablePromise<{
        form_types: Array<{
            id: string;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/form_types',
        });
    }
    /**
     * Retrieves billing classes for dropdown
     * @returns any billing classes retrieved
     * @throws ApiError
     */
    public static getApiMnBillingClasses(): CancelablePromise<{
        billing_classes: Array<{
            id: string;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/billing_classes',
        });
    }
    /**
     * Retrieves a list of services with rates
     * @param search Search term for service name, code, department, or service group
     * @param department Filter by department name
     * @param serviceGroup Filter by service group name
     * @param sortBy Field to sort by:
     * * `service_code`
     * * `service_name`
     * * `department`
     * * `service_group`
     * * `outpatient_general`
     * * `outpatient_special`
     * * `super_speciality_opd`
     * * `health_check`
     *
     * @param sortOrder Sort order (asc/desc)
     * @param page Page number for pagination
     * @param perPage Number of items per page
     * @returns any services sorted by rates
     * @throws ApiError
     */
    public static getApiMnServicesList(
        search?: string,
        department?: string,
        serviceGroup?: string,
        sortBy?: string,
        sortOrder?: string,
        page?: number,
        perPage?: number,
    ): CancelablePromise<{
        services: Array<{
            service_code: string;
            service_id: number;
            service_name: string;
            department: string;
            service_group: string;
            outpatient_general: number;
            outpatient_special: number;
            super_speciality_opd: number;
            health_check: number;
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
            url: '/api/mn/services_list',
            query: {
                'search': search,
                'department': department,
                'service_group': serviceGroup,
                'sort_by': sortBy,
                'sort_order': sortOrder,
                'page': page,
                'per_page': perPage,
            },
        });
    }
    /**
     * Retrieves rate statistics
     * @returns any rate statistics retrieved
     * @throws ApiError
     */
    public static getApiMnRatesStats(): CancelablePromise<{
        rate_stats: {
            total_count: number;
            active_count: number;
            deactive_count: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/rates/stats',
        });
    }
    /**
     * Upload rates Excel file
     * @param formData Excel file (.xls, .xlsx) containing rates data
     * @returns any file uploaded successfully
     * @throws ApiError
     */
    public static postApiMnRatesUpload(
        formData: Blob,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/rates/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `no file uploaded`,
                422: `invalid file type`,
            },
        });
    }
}
