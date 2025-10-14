/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { KVPair } from '../models/KVPair';
import type { WardDto } from '../models/WardDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WardService {
    /**
     * @param version
     * @param tenant
     * @returns WardDto OK
     * @throws ApiError
     */
    public static getApiVWardList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<WardDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Ward/list',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns KVPair OK
     * @throws ApiError
     */
    public static getApiVWardWardlist(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Ward/wardlist',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
