/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DepartmentClearanceSaveRequestResponseDtoListResultModel } from '../models/DepartmentClearanceSaveRequestResponseDtoListResultModel';
import type { GetDepartmentClearanceRequestDto } from '../models/GetDepartmentClearanceRequestDto';
import type { GetDepartmentClearanceResponseDtoPagedResponseDtoResultModel } from '../models/GetDepartmentClearanceResponseDtoPagedResponseDtoResultModel';
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
}
