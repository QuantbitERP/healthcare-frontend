/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { NoDuesPendingCommand } from '../models/NoDuesPendingCommand';
import type { NoDuesPendingResponseDtoResultModel } from '../models/NoDuesPendingResponseDtoResultModel';
import type { PatientClearanceRequestDto } from '../models/PatientClearanceRequestDto';
import type { PatientClearanceResponseDtoResultModel } from '../models/PatientClearanceResponseDtoResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NoDuesPendingService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns NoDuesPendingResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVNoDuesPendingCreatenoduespending(
        version: string,
        tenant?: string,
        requestBody?: NoDuesPendingCommand,
    ): CancelablePromise<NoDuesPendingResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/NoDuesPending/createnoduespending',
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
     * @param requestBody
     * @returns PatientClearanceResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVNoDuesPendingGetPatientClearance(
        version: string,
        tenant?: string,
        requestBody?: PatientClearanceRequestDto,
    ): CancelablePromise<PatientClearanceResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/NoDuesPending/GetPatientClearance',
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
