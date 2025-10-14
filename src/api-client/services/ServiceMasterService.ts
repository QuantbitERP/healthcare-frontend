/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { AdditionalServiceGroupListDto } from '../models/AdditionalServiceGroupListDto';
import type { CompositeServiceDto } from '../models/CompositeServiceDto';
import type { KVPair } from '../models/KVPair';
import type { RateTypeDto } from '../models/RateTypeDto';
import type { RepeatableTypeDto } from '../models/RepeatableTypeDto';
import type { RestrictionTypeDto } from '../models/RestrictionTypeDto';
import type { SaveServiceMasterDto } from '../models/SaveServiceMasterDto';
import type { SaveServiceMasterRequestDto } from '../models/SaveServiceMasterRequestDto';
import type { ServiceCodeTypeDto } from '../models/ServiceCodeTypeDto';
import type { ServiceCountSummaryDto } from '../models/ServiceCountSummaryDto';
import type { ServiceCreatedByDto } from '../models/ServiceCreatedByDto';
import type { ServiceGroupListDto } from '../models/ServiceGroupListDto';
import type { ServiceListRequestDto } from '../models/ServiceListRequestDto';
import type { ServiceTypeDto } from '../models/ServiceTypeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceMasterService {
    /**
     * @param version
     * @param tenant
     * @returns ServiceCreatedByDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterCreatedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<ServiceCreatedByDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/createdByList',
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
     * @returns ServiceCodeTypeDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterServiceCodeTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<ServiceCodeTypeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/serviceCodeTypes',
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
     * @returns ServiceGroupListDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterServiceGroups(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<ServiceGroupListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/serviceGroups',
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
     * @returns AdditionalServiceGroupListDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterAdditionalServiceGroups(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<AdditionalServiceGroupListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/additionalServiceGroups',
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
     * @returns ServiceCountSummaryDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterCountSummary(
        version: string,
        tenant?: string,
    ): CancelablePromise<ServiceCountSummaryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/countSummary',
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
     * @returns RepeatableTypeDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterRepeatableTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<RepeatableTypeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/repeatableTypes',
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
     * @returns RateTypeDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterRateNames(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<RateTypeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/rateNames',
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
     * @returns RestrictionTypeDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterRestrictionTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<RestrictionTypeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/restrictionTypes',
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
     * @returns CompositeServiceDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterCompositeServices(
        version: string,
        tenant?: string,
    ): CancelablePromise<CompositeServiceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/compositeServices',
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
     * @returns SaveServiceMasterDto OK
     * @throws ApiError
     */
    public static postApiVServiceMasterList(
        version: string,
        tenant?: string,
        requestBody?: ServiceListRequestDto,
    ): CancelablePromise<Array<SaveServiceMasterDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ServiceMaster/list',
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
    public static postApiVServiceMaster(
        version: string,
        tenant?: string,
        requestBody?: SaveServiceMasterRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ServiceMaster',
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
    public static deleteApiVServiceMaster(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ServiceMaster',
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
    public static putApiVServiceMaster(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: SaveServiceMasterRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/ServiceMaster/{id}',
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
     * @returns SaveServiceMasterDto OK
     * @throws ApiError
     */
    public static getApiVServiceMaster(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<SaveServiceMasterDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/{id}',
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
     * @returns ServiceTypeDto OK
     * @throws ApiError
     */
    public static getApiVServiceMasterServiceTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<ServiceTypeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/serviceTypes',
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
    public static getApiVServiceMasterServices(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ServiceMaster/services',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
