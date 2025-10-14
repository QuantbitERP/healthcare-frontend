/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { KVPair } from '../models/KVPair';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

type BedListResponse = {
    data: {
        items: KVPair[];
    };
};

export class BedService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns KVPair OK
     * @throws ApiError
     */
    public static postApiVBedBedlistByRoom(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<BedListResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Bed/BedlistByRoom',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
