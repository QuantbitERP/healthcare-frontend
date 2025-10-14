/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateDoctorWiseSettingCommand } from '../models/CreateDoctorWiseSettingCommand';
import type { DeleteDoctorWiseSettingCommand } from '../models/DeleteDoctorWiseSettingCommand';
import type { DoctorWiseSettingDeleteResponseDTOListResultModel } from '../models/DoctorWiseSettingDeleteResponseDTOListResultModel';
import type { DoctorWiseSettingFilterSearchRequsetDTO } from '../models/DoctorWiseSettingFilterSearchRequsetDTO';
import type { DoctorWiseSettingFilterSearchResponseDTOPagedResponseDtoResultModel } from '../models/DoctorWiseSettingFilterSearchResponseDTOPagedResponseDtoResultModel';
import type { DoctorWiseSettingGetByIdRequestDTO } from '../models/DoctorWiseSettingGetByIdRequestDTO';
import type { DoctorWiseSettingGetByIdResponseDTOPagedResponseDtoResultModel } from '../models/DoctorWiseSettingGetByIdResponseDTOPagedResponseDtoResultModel';
import type { DoctorWiseSettingSaveResponseDTOResultModel } from '../models/DoctorWiseSettingSaveResponseDTOResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { KVPairResultModel } from '../models/KVPairResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorWiseSettingService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVDoctorWiseSettingGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorWiseSetting/GetModifiedBy',
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
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVDoctorWiseSettingGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorWiseSetting/GetCreatedBy',
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
     * @returns DoctorWiseSettingSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVDoctorWiseSetting(
        version: string,
        tenant?: string,
        requestBody?: CreateDoctorWiseSettingCommand,
    ): CancelablePromise<DoctorWiseSettingSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorWiseSetting',
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
     * @returns DoctorWiseSettingDeleteResponseDTOListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVDoctorWiseSetting(
        version: string,
        tenant?: string,
        requestBody?: DeleteDoctorWiseSettingCommand,
    ): CancelablePromise<DoctorWiseSettingDeleteResponseDTOListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/DoctorWiseSetting',
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
     * @returns DoctorWiseSettingGetByIdResponseDTOPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVDoctorWiseSettingGetById(
        version: string,
        tenant?: string,
        requestBody?: DoctorWiseSettingGetByIdRequestDTO,
    ): CancelablePromise<DoctorWiseSettingGetByIdResponseDTOPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorWiseSetting/GetById',
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
     * @returns DoctorWiseSettingFilterSearchResponseDTOPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVDoctorWiseSettingList(
        version: string,
        tenant?: string,
        requestBody?: DoctorWiseSettingFilterSearchRequsetDTO,
    ): CancelablePromise<DoctorWiseSettingFilterSearchResponseDTOPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorWiseSetting/list',
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
    public static getApiVDoctorWiseSettingDefinationTypeEnum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorWiseSetting/DefinationTypeEnum',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
