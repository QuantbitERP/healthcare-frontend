/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CodeTypesService {
    /**
     * Retrieves a list of code types for dropdown
     * @param search Search term to filter code types by name
     * @returns any no code types found
     * @throws ApiError
     */
    public static getApiMnCodeTypes(
        search?: string,
    ): CancelablePromise<{
        code_types: Array<{
            id: number;
            name: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/code_types',
            query: {
                'search': search,
            },
        });
    }
}
