/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { GenderDto } from '../models/GenderDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GenderService {
    /**
     * @param version
     * @param tenant
     * @returns GenderDto OK
     * @throws ApiError
     */
    public static getApiVGenderList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<GenderDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Gender/list',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
