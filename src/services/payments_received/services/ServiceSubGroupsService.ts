/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceSubGroupsService {
    /**
     * Retrieves a list of service sub-groups
     * @param search Search term for sub-group name or service group name
     * @param serviceGroupId Filter by service group ID
     * @returns any no service sub-groups found
     * @throws ApiError
     */
    public static getApiMnServiceSubGroups(
        search?: string,
        serviceGroupId?: number,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
        service_group_id: number;
        service_group_name: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/service_sub_groups',
            query: {
                'search': search,
                'service_group_id': serviceGroupId,
            },
        });
    }
}
