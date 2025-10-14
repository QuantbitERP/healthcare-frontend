/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceGroupsService {
    /**
     * Retrieves a list of service groups
     * @param search Search term for service group name
     * @returns any no service groups found
     * @throws ApiError
     */
    public static getApiMnServiceGroups(
        search?: string,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/service_groups',
            query: {
                'search': search,
            },
        });
    }
}
