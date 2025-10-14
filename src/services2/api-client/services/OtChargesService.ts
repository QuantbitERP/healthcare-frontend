/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { createOTCharges } from '../models/createOTCharges';
import type { DeleteOTChargesCommand } from '../models/DeleteOTChargesCommand';
import type { GetHospitalServicesDto } from '../models/GetHospitalServicesDto';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { OTChargesDeleteResponseDTOResultModel } from '../models/OTChargesDeleteResponseDTOResultModel';
import type { OTChargestResponseDtoResultModel } from '../models/OTChargestResponseDtoResultModel';
import type { OTRegisteredPatientListRequestDto } from '../models/OTRegisteredPatientListRequestDto';
import type { OTRegisteredPatientListResponseDtoResultModel } from '../models/OTRegisteredPatientListResponseDtoResultModel';
import type { OTRegisteredPatientResponseDtoResultModel } from '../models/OTRegisteredPatientResponseDtoResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OtChargesService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns OTRegisteredPatientListResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVOtChargesList(
        version: string,
        tenant?: string,
        requestBody?: OTRegisteredPatientListRequestDto,
    ): CancelablePromise<OTRegisteredPatientListResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OTCharges/List',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOtChargesCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTCharges/createdBy',
            path: {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOtChargesModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTCharges/modifiedBy',
            path: {
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
     * @returns OTChargestResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVOtChargesSave(
        version: string,
        tenant?: string,
        requestBody?: createOTCharges,
    ): CancelablePromise<OTChargestResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OTCharges/save',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVOtChargesHospitalServices(
        version: string,
        tenant?: string,
        requestBody?: GetHospitalServicesDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OTCharges/hospital/services',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOtChargesConcessionGivenBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTCharges/concessionGivenBy',
            path: {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOtChargesConcessionCategories(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTCharges/concessionCategories',
            path: {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOtChargesSurgeonNames(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTCharges/surgeonNames',
            path: {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOtChargesSurgeryNames(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTCharges/surgeryNames',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param version
     * @param otSerialNo
     * @param tenant
     * @returns OTRegisteredPatientResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVOtChargesOtChargesDetails(
        version: string,
        otSerialNo?: string,
        tenant?: string,
    ): CancelablePromise<OTRegisteredPatientResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OTCharges/otChargesDetails',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'otSerialNo': otSerialNo,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns OTChargesDeleteResponseDTOResultModel OK
     * @throws ApiError
     */
    public static deleteApiVOtCharges(
        version: string,
        tenant?: string,
        requestBody?: DeleteOTChargesCommand,
    ): CancelablePromise<OTChargesDeleteResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/OTCharges',
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
