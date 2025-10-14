/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CreateTaxMasterCommand } from '../models/CreateTaxMasterCommand';
import type { GSTTaxDeleteResponseDtoListResultModel } from '../models/GSTTaxDeleteResponseDtoListResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { KVPairResultModel } from '../models/KVPairResultModel';
import type { TaxMasterByIdDtoResultModel } from '../models/TaxMasterByIdDtoResultModel';
import type { TaxMasterListRequestDto } from '../models/TaxMasterListRequestDto';
import type { TaxMasterListResponseDtoListResultModelResultModel } from '../models/TaxMasterListResponseDtoListResultModelResultModel';
import type { TaxMasterResponceDtoResultModel } from '../models/TaxMasterResponceDtoResultModel';
import type { UpdateTaxMasterCommand } from '../models/UpdateTaxMasterCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaxMasterService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns TaxMasterListResponseDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVTaxMasterList(
        version: string,
        tenant?: string,
        requestBody?: TaxMasterListRequestDto,
    ): CancelablePromise<TaxMasterListResponseDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaxMaster/list',
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
    public static getApiVTaxMasterGetModifiedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaxMaster/getModifiedbyUser',
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
     * @returns TaxMasterResponceDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVTaxMasterSave(
        version: string,
        tenant?: string,
        requestBody?: CreateTaxMasterCommand,
    ): CancelablePromise<TaxMasterResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/TaxMaster/Save',
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
     * @returns TaxMasterResponceDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVTaxMaster(
        version: string,
        tenant?: string,
        requestBody?: UpdateTaxMasterCommand,
    ): CancelablePromise<TaxMasterResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TaxMaster',
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
     * @returns GSTTaxDeleteResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVTaxMaster(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<GSTTaxDeleteResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TaxMaster',
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
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVTaxMasterTaxTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaxMaster/TaxTypes',
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
    public static getApiVTaxMasterGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaxMaster/getCreatedBy',
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
     * @returns TaxMasterByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVTaxMasterGetTaxMasterById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<TaxMasterByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaxMaster/GetTaxMasterById/{Id}',
            path: {
                'Id': id,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
