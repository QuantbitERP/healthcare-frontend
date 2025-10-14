/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GstRatesService {
    /**
     * Retrieves a list of GST rates
     * @param search Search term for GST rate name or description
     * @returns any no GST rates found
     * @throws ApiError
     */
    public static getApiMnGstRates(
        search?: string,
    ): CancelablePromise<Array<{
        id: number;
        name: string;
        description: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/gst_rates',
            query: {
                'search': search,
            },
        });
    }
}
