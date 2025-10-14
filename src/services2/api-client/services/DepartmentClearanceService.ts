/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DepartmentClearanceExcelRequestDto } from '../models/DepartmentClearanceExcelRequestDto';
import type { DepartmentClearanceSaveRequestResponseDtoListResultModel } from '../models/DepartmentClearanceSaveRequestResponseDtoListResultModel';
import type { GetDepartmentClearanceRequestDto } from '../models/GetDepartmentClearanceRequestDto';
import type { GetDepartmentClearanceResponseDtoPagedResponseDtoResultModel } from '../models/GetDepartmentClearanceResponseDtoPagedResponseDtoResultModel';
import type { KVPairResultModel } from '../models/KVPairResultModel';
import type { UpdateDepartmentClearanceCommand } from '../models/UpdateDepartmentClearanceCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepartmentClearanceService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns GetDepartmentClearanceResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVDepartmentClearanceGetDepartmentClearanceList(
        version: string,
        tenant?: string,
        requestBody?: GetDepartmentClearanceRequestDto,
    ): CancelablePromise<GetDepartmentClearanceResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DepartmentClearance/GetDepartmentClearanceList',
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
     * @returns DepartmentClearanceSaveRequestResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static postApiVDepartmentClearanceUpdate(
        version: string,
        tenant?: string,
        requestBody?: UpdateDepartmentClearanceCommand,
    ): CancelablePromise<DepartmentClearanceSaveRequestResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DepartmentClearance/Update',
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
     * @param hospitalId
     * @param version
     * @param tenant
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVDepartmentClearanceNoDuesRequiredDepartments(
        hospitalId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DepartmentClearance/NoDuesRequiredDepartments/{hospitalId}',
            path: {
                'hospitalId': hospitalId,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVDepartmentClearanceExcel(
        version: string,
        tenant?: string,
        requestBody?: DepartmentClearanceExcelRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DepartmentClearance/excel',
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
