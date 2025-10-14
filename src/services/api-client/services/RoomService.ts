/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { KVPair } from '../models/KVPair';
import type { Query } from '../models/Query';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

type RoomListResponse = {
    data: {
        items: KVPair[];
    };
};

export class RoomService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns KVPair OK
     * @throws ApiError
     */
    public static postApiVRoomRoomlistByWard(
        version: string,
        tenant?: string,
        requestBody?: Query,
    ): CancelablePromise<RoomListResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Room/RoomlistByWard',
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
