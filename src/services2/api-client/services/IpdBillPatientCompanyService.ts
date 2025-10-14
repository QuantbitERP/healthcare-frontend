/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateIPDBillPatientCompanyCommand } from '../models/CreateIPDBillPatientCompanyCommand';
import type { IPDBillPatientCompanyGetByIdResponseDTOListResultModel } from '../models/IPDBillPatientCompanyGetByIdResponseDTOListResultModel';
import type { IPDBillPatientCompanyGetByPatientVisitIdRequestDTO } from '../models/IPDBillPatientCompanyGetByPatientVisitIdRequestDTO';
import type { IPDBillPatientCompanySaveResponseDtoListResultModel } from '../models/IPDBillPatientCompanySaveResponseDtoListResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IpdBillPatientCompanyService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns IPDBillPatientCompanyGetByIdResponseDTOListResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdBillPatientCompanyList(
        version: string,
        tenant?: string,
        requestBody?: IPDBillPatientCompanyGetByPatientVisitIdRequestDTO,
    ): CancelablePromise<IPDBillPatientCompanyGetByIdResponseDTOListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPDBillPatientCompany/list',
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
     * @returns IPDBillPatientCompanySaveResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdBillPatientCompanyPatientTypeByBillTypeSave(
        version: string,
        tenant?: string,
        requestBody?: CreateIPDBillPatientCompanyCommand,
    ): CancelablePromise<IPDBillPatientCompanySaveResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPDBillPatientCompany/PatientTypeByBillTypeSave',
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
