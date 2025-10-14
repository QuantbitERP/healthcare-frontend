/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateDoctorProfessionalFeeSettingCommand } from '../models/CreateDoctorProfessionalFeeSettingCommand';
import type { DoctorProfessionalFeeSettingSaveResponseDTOResultModel } from '../models/DoctorProfessionalFeeSettingSaveResponseDTOResultModel';
import type { GetDoctorProfessionalFeeSettingDTOResultModel } from '../models/GetDoctorProfessionalFeeSettingDTOResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorProfessionalFeeSettingService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns DoctorProfessionalFeeSettingSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVDoctorProfessionalFeeSetting(
        version: string,
        tenant?: string,
        requestBody?: CreateDoctorProfessionalFeeSettingCommand,
    ): CancelablePromise<DoctorProfessionalFeeSettingSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorProfessionalFeeSetting',
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
    /**
     * @param version
     * @param tenant
     * @returns GetDoctorProfessionalFeeSettingDTOResultModel OK
     * @throws ApiError
     */
    public static getApiVDoctorProfessionalFeeSetting(
        version: string,
        tenant?: string,
    ): CancelablePromise<GetDoctorProfessionalFeeSettingDTOResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorProfessionalFeeSetting',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
