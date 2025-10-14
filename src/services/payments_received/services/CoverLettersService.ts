/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CoverLettersService {
    /**
     * Retrieves a list of cover letters
     * @param companyId Filter by company ID
     * @param templateName Filter by template name (case-insensitive partial match)
     * @param companyName Filter by company name (case-insensitive partial match)
     * @param sortBy Field to sort by:
     * * `template_name`
     * * `company_name`
     * * `modified_on`
     * * `created_on`
     *
     * @param sortOrder Sort order (asc/desc)
     * @param page Page number for pagination
     * @param perPage Number of items per page
     * @returns any cover letters filtered by company name
     * @throws ApiError
     */
    public static getApiMnCoverLetters(
        companyId?: number,
        templateName?: string,
        companyName?: string,
        sortBy?: string,
        sortOrder?: string,
        page?: number,
        perPage?: number,
    ): CancelablePromise<{
        cover_letters: Array<{
            template_id: number;
            template_name: string;
            company_id: number;
            company_name: string;
            modified_by: string;
            created_by: string;
            modified_on: string;
            created_on: string;
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
            url: '/api/mn/cover_letters',
            query: {
                'company_id': companyId,
                'template_name': templateName,
                'company_name': companyName,
                'sort_by': sortBy,
                'sort_order': sortOrder,
                'page': page,
                'per_page': perPage,
            },
        });
    }
    /**
     * Creates a new cover letter
     * @param requestBody
     * @returns any cover letter created
     * @throws ApiError
     */
    public static postApiMnCoverLetters(
        requestBody?: {
            template_name: string;
            company_id: number;
            content: string;
            status?: 'Active' | 'Inactive';
            category?: string;
            tags?: Array<string>;
            language?: string;
            is_customizable?: boolean;
        },
    ): CancelablePromise<{
        message: string;
        cover_letter: {
            template_id?: number;
            template_name?: string;
            company_id?: number;
            company_name?: string;
            content?: string;
            status?: string;
            version?: string;
            modified_by?: string;
            created_by?: string;
            modified_on?: string;
            created_on?: string;
            last_used?: string | null;
            usage_count?: number;
            metadata?: {
                category?: string;
                tags?: Array<string>;
                language?: string;
                is_customizable?: boolean;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/cover_letters',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `invalid request`,
            },
        });
    }
    /**
     * Deletes a cover letter
     * @param id Template ID of the cover letter to delete
     * @returns any cover letter deleted
     * @throws ApiError
     */
    public static deleteApiMnCoverLetters(
        id: number,
    ): CancelablePromise<{
        message: string;
        deleted_cover_letter: {
            template_id: number;
            template_name: string;
            company_id: number;
            company_name: string;
            modified_by: string;
            created_by: string;
            modified_on: string;
            created_on: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/mn/cover_letters/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `unprocessable entity`,
            },
        });
    }
    /**
     * Retrieves cover letter details
     * @param id Template ID of the cover letter to delete
     * @returns any cover letter details found
     * @throws ApiError
     */
    public static getApiMnCoverLetters1(
        id: number,
    ): CancelablePromise<{
        cover_letter: {
            template_id: number;
            template_name: string;
            company_id: number;
            company_name: string;
            modified_by: string;
            created_by: string;
            modified_on: string;
            created_on: string;
            content: string;
            status: string;
            version: string;
            last_used: string;
            usage_count: number;
            metadata: {
                category?: string;
                tags?: Array<string>;
                language?: string;
                is_customizable?: boolean;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/cover_letters/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `cover letter not found`,
            },
        });
    }
    /**
     * Updates a cover letter
     * @param id Template ID of the cover letter to delete
     * @param requestBody
     * @returns any cover letter updated
     * @throws ApiError
     */
    public static putApiMnCoverLetters(
        id: number,
        requestBody?: {
            template_name?: string;
            content?: string;
            status?: 'Active' | 'Inactive';
            category?: string;
            tags?: Array<string>;
            language?: string;
            is_customizable?: boolean;
        },
    ): CancelablePromise<{
        message: string;
        cover_letter: {
            template_id?: number;
            template_name?: string;
            company_id?: number;
            company_name?: string;
            content?: string;
            status?: string;
            version?: string;
            modified_by?: string;
            created_by?: string;
            modified_on?: string;
            created_on?: string;
            last_used?: string;
            usage_count?: number;
            metadata?: {
                category?: string;
                tags?: Array<string>;
                language?: string;
                is_customizable?: boolean;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/mn/cover_letters/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `invalid request`,
            },
        });
    }
}
