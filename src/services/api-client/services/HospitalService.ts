/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { HospitalListDto } from '../models/HospitalListDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { CommonResponseDto } from '../models/RateListDto';
export class HospitalService {
    /**
     * @param version
     * @param tenant
     * @returns HospitalListDto OK
     * @throws ApiError
     */
    public static getApiVHospitalHospitals(
        version: string,
        tenant?: string,
    ): CancelablePromise<CommonResponseDto> {
        return __request(OpenAPI, { 
            method: 'GET',
            url: '/api/v{version}/Hospital/hospitals',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param hospitalId
     * @param version
     * @param tenant
     * @returns HospitalListDto OK
     * @throws ApiError
     */
    public static getApiVHospital(
        hospitalId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<HospitalListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Hospital/{hospitalId}',
            path: {
                'HospitalId': hospitalId,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
