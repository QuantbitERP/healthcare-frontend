/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ServiceHeadCodeSettingListRequestDto } from '../models/ServiceHeadCodeSettingListRequestDto';
import type { ServiceHeadCodeSettingListResponseDtoPagedResponseDtoResultModel } from '../models/ServiceHeadCodeSettingListResponseDtoPagedResponseDtoResultModel';
import type { ServiceHeadCodeSettingListResponseDtoResultModel } from '../models/ServiceHeadCodeSettingListResponseDtoResultModel';
import type { ServiceHeadCodeSettingRequestDto } from '../models/ServiceHeadCodeSettingRequestDto';
import type { ServiceHeadCodeSettingResponseDto } from '../models/ServiceHeadCodeSettingResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceHeadCodeSettingService {
    /**
     * @param version
     * @param tenant
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVServiceHeadCodeSettingServiceHeadCodeSettingExcel(
        version: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ServiceHeadCodeSetting/serviceHeadCodeSetting/excel',
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
            url: '/api/v{version}/ServiceHeadCodeSetting/save',
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
            url: '/api/v{version}/ServiceHeadCodeSetting/list',
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
     * @returns ServiceHeadCodeSettingListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVServiceHeadCodeSettingPagedlist(
        version: string,
        tenant?: string,
        requestBody?: ServiceHeadCodeSettingListRequestDto,
    ): CancelablePromise<ServiceHeadCodeSettingListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ServiceHeadCodeSetting/Pagedlist',
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
