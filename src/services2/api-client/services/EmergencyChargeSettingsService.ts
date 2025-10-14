/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { EmergencyChargeSettingRequestDto } from '../models/EmergencyChargeSettingRequestDto';
import type { EmergencyChargeSettingsSearchRequestDto } from '../models/EmergencyChargeSettingsSearchRequestDto';
import type { EmergencyChargeSettingsSearchResponseDto } from '../models/EmergencyChargeSettingsSearchResponseDto';
import type { EmergencyChargeSettingUpdateDto } from '../models/EmergencyChargeSettingUpdateDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmergencyChargeSettingsService {
    /**
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVEmergencyChargeSettingsCreatedByListForEmrCharSetting(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmergencyChargeSettings/createdByListForEmrCharSetting',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVEmergencyChargeSettingsGetServicemodifiedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmergencyChargeSettings/getServicemodifiedByList',
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
     * @returns EmergencyChargeSettingsSearchResponseDto OK
     * @throws ApiError
     */
    public static postApiVEmergencyChargeSettingsGetHospitalFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: EmergencyChargeSettingsSearchRequestDto,
    ): CancelablePromise<EmergencyChargeSettingsSearchResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmergencyChargeSettings/getHospitalFilterWithSearch',
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
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVEmergencyChargeSettingsCreateEmergencyChargeSetting(
        version: string,
        tenant?: string,
        requestBody?: EmergencyChargeSettingRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/EmergencyChargeSettings/CreateEmergencyChargeSetting',
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
     * @param id
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiVEmergencyChargeSettings(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: EmergencyChargeSettingRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/EmergencyChargeSettings/{id}',
            path: {
                'id': id,
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
     * @param id
     * @param version
     * @param tenant
     * @returns EmergencyChargeSettingUpdateDto OK
     * @throws ApiError
     */
    public static getApiVEmergencyChargeSettings(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<EmergencyChargeSettingUpdateDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/EmergencyChargeSettings/{id}',
            path: {
                'id': id,
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
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVEmergencyChargeSettings(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/EmergencyChargeSettings',
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
