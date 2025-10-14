/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AssociateCompanyListRequestDto } from '../models/AssociateCompanyListRequestDto';
import type { AssociateCompanyListResponseDtoResultModel } from '../models/AssociateCompanyListResponseDtoResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaxMasterService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns AssociateCompanyListResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVTaxMasterTaxMasterByFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: AssociateCompanyListRequestDto,
    ): CancelablePromise<AssociateCompanyListResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaxMaster/TaxMasterByFilterWithSearch',
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
