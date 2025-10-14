/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PackagesService {
    /**
     * Retrieves visit types for dropdown
     * @param search Search term to filter visit types by name (case-insensitive)
     * @returns any all visit types when no search term
     * @throws ApiError
     */
    public static getApiMnPackagesVisitTypes(
        search?: string,
    ): CancelablePromise<{
        visit_types: Array<{
            id: string;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/packages/visit_types',
            query: {
                'search': search,
            },
        });
    }
    /**
     * Retrieves package types for dropdown
     * @param search Search term to filter package types by name (case-insensitive)
     * @returns any all package types when no search term
     * @throws ApiError
     */
    public static getApiMnPackagesPackageTypes(
        search?: string,
    ): CancelablePromise<{
        package_types: Array<{
            id: string;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/packages/package_types',
            query: {
                'search': search,
            },
        });
    }
    /**
     * Retrieves statuses for dropdown
     * @param search Search term to filter statuses by name (case-insensitive)
     * @returns any all statuses when no search term
     * @throws ApiError
     */
    public static getApiMnPackagesStatuses(
        search?: string,
    ): CancelablePromise<{
        statuses: Array<{
            id: string;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/packages/statuses',
            query: {
                'search': search,
            },
        });
    }
    /**
     * Retrieves package statistics
     * @returns any package statistics retrieved
     * @throws ApiError
     */
    public static getApiMnPackagesStats(): CancelablePromise<{
        package_stats: {
            total_count: number;
            health_checkup_count: number;
            medical_count: number;
            surgical_count: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/packages/stats',
        });
    }
    /**
     * Retrieves a list of packages
     * @param search Search term for package name
     * @param status Filter by status:
     * * `active`
     * * `inactive`
     * * `draft`
     *
     * @param packageType Filter by package type
     * @param applicableFor Filter by applicable for
     * @param effectiveDate Filter by effective date (YYYY-MM-DD)
     * @param validFrom Filter by valid from date (YYYY-MM-DD)
     * @param validTo Filter by valid to date (YYYY-MM-DD)
     * @param deactivated Filter by deactivated status (true/false)
     * @param currentVersion Filter by current version status (true/false)
     * @param sortBy Field to sort by
     * @param sortOrder Sort order (asc/desc)
     * @param page Page number for pagination
     * @param perPage Number of items per page
     * @returns any packages filtered by current version
     * @throws ApiError
     */
    public static getApiMnPackages(
        search?: string,
        status?: string,
        packageType?: string,
        applicableFor?: string,
        effectiveDate?: string,
        validFrom?: string,
        validTo?: string,
        deactivated?: boolean,
        currentVersion?: boolean,
        sortBy?: string,
        sortOrder?: string,
        page?: number,
        perPage?: number,
    ): CancelablePromise<{
        packages: Array<{
            id: number;
            package_name: string;
            status: string;
            package_type: string;
            applicable_for: string;
            effective_date: string;
            valid_from: string;
            valid_to: string;
            created_by: string;
            created_on: string;
            modified_by: string;
            modified_on: string;
            deactivated: boolean;
            current_version: boolean;
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
            url: '/api/mn/packages',
            query: {
                'search': search,
                'status': status,
                'package_type': packageType,
                'applicable_for': applicableFor,
                'effective_date': effectiveDate,
                'valid_from': validFrom,
                'valid_to': validTo,
                'deactivated': deactivated,
                'current_version': currentVersion,
                'sort_by': sortBy,
                'sort_order': sortOrder,
                'page': page,
                'per_page': perPage,
            },
        });
    }
}
