/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DesignationDto } from '../models/DesignationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DesignationService {
    /**
     * @param version
     * @param tenant
     * @returns DesignationDto OK
     * @throws ApiError
     */
    public static getApiVDesignationList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<DesignationDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Designation/list',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
