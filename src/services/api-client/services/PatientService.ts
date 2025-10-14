/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GetPatientsDto } from '../models/GetPatientsDto';
import type { PatientSearchDtoListResultModelResultModel } from '../models/PatientSearchDtoListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns PatientSearchDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPatientPatients(
        version: string,
        tenant?: string,
        requestBody?: GetPatientsDto,
    ): CancelablePromise<PatientSearchDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Patient/patients',
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
