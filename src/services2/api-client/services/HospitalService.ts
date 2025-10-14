/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GetHospitalDepartmentwiseDoctorDto } from '../models/GetHospitalDepartmentwiseDoctorDto';
import type { GetHospitalwisedepartmentsRequestDto } from '../models/GetHospitalwisedepartmentsRequestDto';
import type { GetSubDepartmentsListAsyncRequestDto } from '../models/GetSubDepartmentsListAsyncRequestDto';
import type { KVPair } from '../models/KVPair';
import type { KVPairResultModel } from '../models/KVPairResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HospitalService {
    /**
     * @param version
     * @param tenant
     * @returns KVPair OK
     * @throws ApiError
     */
    public static getApiVHospitalHospitals(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<KVPair>> {
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
     * @param version
     * @param tenant
     * @param requestBody
     * @returns KVPair OK
     * @throws ApiError
     */
    public static postApiVHospitalSubDepartments(
        version: string,
        tenant?: string,
        requestBody?: GetSubDepartmentsListAsyncRequestDto,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Hospital/SubDepartments',
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
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static postApiVHospitalHospitalwisedepartments(
        version: string,
        tenant?: string,
        requestBody?: GetHospitalwisedepartmentsRequestDto,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Hospital/Hospitalwisedepartments',
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
    public static postApiVHospitalHospitalwiseHospitaldepartments(
        hospitalId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Hospital/HospitalwiseHospitaldepartments/{hospitalId}',
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
     * @returns KVPair OK
     * @throws ApiError
     */
    public static postApiVHospitalHospitalDepartmentDoctors(
        version: string,
        tenant?: string,
        requestBody?: GetHospitalDepartmentwiseDoctorDto,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Hospital/HospitalDepartmentDoctors',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVHospitalHospitalDoctors(
        hospitalId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Hospital/HospitalDoctors/{hospitalId}',
            path: {
                'hospitalId': hospitalId,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
