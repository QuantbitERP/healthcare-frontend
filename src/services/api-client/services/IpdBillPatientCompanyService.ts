/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { IpdBillPatientCompanyListRequestDto } from '../models/IpdBillPatientCompanyResponseDto';
import type { IpdBillPatientCompanyListResponseDto } from '../models/IpdBillPatientCompanyResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class IpdBillPatientCompanyService {
    /**
     * Get IPD Bill Patient Company list by patient visit ID
     * @param requestBody
     * @returns IpdBillPatientCompanyListResponseDto OK
     * @throws ApiError
     */
    public static postApiVIPDBillPatientCompanyList(
        requestBody?: IpdBillPatientCompanyListRequestDto,
    ): CancelablePromise<IpdBillPatientCompanyListResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/IPDBillPatientCompany/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Save IPD Bill Patient Company data
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVIPDBillPatientCompanyPatientTypeByBillTypeSave(
        requestBody?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/IPDBillPatientCompany/PatientTypeByBillTypeSave',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
