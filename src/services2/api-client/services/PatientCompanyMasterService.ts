/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreatePatientCompanyCommand } from '../models/CreatePatientCompanyCommand';
import type { DeletePatientCompanyMasterIdCommand } from '../models/DeletePatientCompanyMasterIdCommand';
import type { InsertPatientCompanyResponseDTOResultModel } from '../models/InsertPatientCompanyResponseDTOResultModel';
import type { KVPair } from '../models/KVPair';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { PatientCompanyMasterDeleteResponceDTO } from '../models/PatientCompanyMasterDeleteResponceDTO';
import type { PatientCompanyMasterGetByIdResponceDtoResultModel } from '../models/PatientCompanyMasterGetByIdResponceDtoResultModel';
import type { PatientCompanyMasterListRequestDto } from '../models/PatientCompanyMasterListRequestDto';
import type { PatientCompanyMasterListResponseDtoPagedResponseDtoResultModel } from '../models/PatientCompanyMasterListResponseDtoPagedResponseDtoResultModel';
import type { UpdatePatientCompanyCommand } from '../models/UpdatePatientCompanyCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientCompanyMasterService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVPatientCompanyMasterGetPatientCategoryList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCompanyMaster/getPatientCategoryList',
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
    public static getApiVPatientCompanyMasterGetRateNameList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCompanyMaster/getRateNameList',
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
     * @returns PatientCompanyMasterListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVPatientCompanyMasterList(
        version: string,
        tenant?: string,
        requestBody?: PatientCompanyMasterListRequestDto,
    ): CancelablePromise<PatientCompanyMasterListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PatientCompanyMaster/list',
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
    public static getApiVPatientCompanyMasterGetCreatedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCompanyMaster/getCreatedbyUser',
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
    public static getApiVPatientCompanyMasterGetModifiedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCompanyMaster/getModifiedbyUser',
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
     * @returns PatientCompanyMasterGetByIdResponceDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVPatientCompanyMaster(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<PatientCompanyMasterGetByIdResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PatientCompanyMaster/{id}',
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
     * @returns KVPair OK
     * @throws ApiError
     */
    public static getApiVPatientCompanyMasterPatientcompanies(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/AssociateSchemeCompany/getAssociateCompanies',
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
     * @returns InsertPatientCompanyResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVPatientCompanyMasterSave(
        version: string,
        tenant?: string,
        requestBody?: CreatePatientCompanyCommand,
    ): CancelablePromise<InsertPatientCompanyResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PatientCompanyMaster/save',
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
     * @returns InsertPatientCompanyResponseDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVPatientCompanyMasterUpdate(
        version: string,
        tenant?: string,
        requestBody?: UpdatePatientCompanyCommand,
    ): CancelablePromise<InsertPatientCompanyResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PatientCompanyMaster/update',
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
     * @returns PatientCompanyMasterDeleteResponceDTO OK
     * @throws ApiError
     */
    public static deleteApiVPatientCompanyMasterDelete(
        version: string,
        tenant?: string,
        requestBody?: DeletePatientCompanyMasterIdCommand,
    ): CancelablePromise<Array<PatientCompanyMasterDeleteResponceDTO>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/PatientCompanyMaster/Delete',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVPatientCompanyMasterPatientCompanyMasterExcelExcel(
        version: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PatientCompanyMaster/PatientCompanyMasterExcel/excel',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
