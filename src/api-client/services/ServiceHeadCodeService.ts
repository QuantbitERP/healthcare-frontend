/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { ServiceHeadCodeSettingListResponseDtoResultModel } from '../models/ServiceHeadCodeSettingListResponseDtoResultModel';
import type { ServiceHeadCodeSettingListRequestDto } from '../models/ServiceHeadCodeSettingListRequestDto';
import type { ServiceHeadCodeSettingRequestDto } from '../models/ServiceHeadCodeSettingRequestDto';
import type { ServiceHeadCodeSettingResponseDto } from '../models/ServiceHeadCodeSettingResponseDto';
import type { KVPair } from '../models/KVPair';
import type { HospitalListDto } from '../models/HospitalListDto';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';

export class ServiceHeadCodeService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns Blob OK
     * @throws ApiError
     */
    public static postApiVServiceHeadCodeSettingServiceHeadCodeSettingExcel(
        version: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ServiceHeadCodeSetting/ServiceHeadCodeSettingExcel',
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
     * @returns ServiceHeadCodeSettingResponseDto OK
     * @throws ApiError
     */
    public static postApiVServiceHeadCodeSettingSave(
        version: string,
        tenant?: string,
        requestBody?: Array<ServiceHeadCodeSettingRequestDto>,
    ): CancelablePromise<ServiceHeadCodeSettingResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ServiceHeadCodeSetting/save',
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
     * @returns ServiceHeadCodeSettingListResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVServiceHeadCodeSettingList(
        version: string,
        tenant?: string,
        requestBody?: ServiceHeadCodeSettingListRequestDto,
    ): CancelablePromise<ServiceHeadCodeSettingListResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ServiceHeadCodeSetting/list',
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
    public static getApiVPatientCompanyMasterPatientcompanies(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/PatientCompanyMaster/patientcompanies',
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
     * @returns KVPair OK
     * @throws ApiError
     */
    public static getApiVDepartmentsDepartmentKVlist(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Departments/departmentKVlist',
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
     * @returns HospitalListDto OK
     * @throws ApiError
     */
    public static getApiVHospitalHospitals(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<HospitalListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Hospital/hospitals',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
