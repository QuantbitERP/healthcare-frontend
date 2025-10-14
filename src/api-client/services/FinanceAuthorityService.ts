/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CreateFinanceAuthorityCommand } from '../models/CreateFinanceAuthorityCommand';
import type { DeleteFinanceAuthorityCommand } from '../models/DeleteFinanceAuthorityCommand';
import type { FinanceAuthorityDeleteResponseDtoResultModel } from '../models/FinanceAuthorityDeleteResponseDtoResultModel';
import type { FinanceAuthorityListRequestDto } from '../models/FinanceAuthorityListRequestDto';
import type { FinanceAuthorityListResponseDtoListResultModelResultModel } from '../models/FinanceAuthorityListResponseDtoListResultModelResultModel';
import type { FinanceAuthorityRequestDtoResultModel } from '../models/FinanceAuthorityRequestDtoResultModel';
import type { FinanceAuthorityResponceDtoResultModel } from '../models/FinanceAuthorityResponceDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { UpdateFinanceAuthorityCommand } from '../models/UpdateFinanceAuthorityCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FinanceAuthorityService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns FinanceAuthorityResponceDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVFinanceAuthority(
        version: string,
        tenant?: string,
        requestBody?: CreateFinanceAuthorityCommand,
    ): CancelablePromise<FinanceAuthorityResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/FinanceAuthority',
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
     * @returns FinanceAuthorityResponceDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVFinanceAuthority(
        version: string,
        tenant?: string,
        requestBody?: UpdateFinanceAuthorityCommand,
    ): CancelablePromise<FinanceAuthorityResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/FinanceAuthority',
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
     * @returns FinanceAuthorityDeleteResponseDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVFinanceAuthority(
        version: string,
        tenant?: string,
        requestBody?: DeleteFinanceAuthorityCommand,
    ): CancelablePromise<FinanceAuthorityDeleteResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/FinanceAuthority',
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
    public static getApiVFinanceAuthorityConcessionGivenBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FinanceAuthority/concessionGivenBy',
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
    public static getApiVFinanceAuthorityEmployee(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FinanceAuthority/employee',
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
    public static getApiVFinanceAuthorityCreatedby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FinanceAuthority/createdby',
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
    public static getApiVFinanceAuthorityModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FinanceAuthority/modifiedBy',
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
     * @returns FinanceAuthorityListResponseDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVFinanceAuthorityList(
        version: string,
        tenant?: string,
        requestBody?: FinanceAuthorityListRequestDto,
    ): CancelablePromise<FinanceAuthorityListResponseDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/FinanceAuthority/list',
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
    public static getApiVFinanceAuthorityGetDoctorList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FinanceAuthority/getDoctorList',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns FinanceAuthorityRequestDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVFinanceAuthority(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<FinanceAuthorityRequestDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/FinanceAuthority/{id}',
            path: {
                'id': id,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
