/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CancelDoctorDataDtoResultModel } from '../models/CancelDoctorDataDtoResultModel';
import type { CreateDoctorMasterCommand } from '../models/CreateDoctorMasterCommand';
import type { DoctorMasterGetByIdResponseDtoResultModel } from '../models/DoctorMasterGetByIdResponseDtoResultModel';
import type { DoctorMasterListRequestDto } from '../models/DoctorMasterListRequestDto';
import type { DoctorMasterListResponseDto } from '../models/DoctorMasterListResponseDto';
import type { DoctorMasterListResponseDtoListResultModel } from '../models/DoctorMasterListResponseDtoListResultModel';
import type { DoctorMasterPrimaryDetailsSaveRequestDTO } from '../models/DoctorMasterPrimaryDetailsSaveRequestDTO';
import type { DoctorMasterSaveResponceDTOResultModel } from '../models/DoctorMasterSaveResponceDTOResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorMasterService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns DoctorMasterListResponseDto OK
     * @throws ApiError
     */
    public static postApiVDoctorMasterList(
        version: string,
        tenant?: string,
        requestBody?: DoctorMasterListRequestDto,
    ): CancelablePromise<Array<DoctorMasterListResponseDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorMaster/list',
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
     * @returns DoctorMasterListResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static postApiVDoctorMasterDoctorMasterslist(
        version: string,
        tenant?: string,
        requestBody?: DoctorMasterListRequestDto,
    ): CancelablePromise<DoctorMasterListResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorMaster/DoctorMasterslist',
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
    public static getApiVDoctorMasterDoctorAffiliationType(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/doctorAffiliationType',
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
    public static getApiVDoctorMasterSpecialization(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/specialization',
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
     * @returns CancelDoctorDataDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVDoctorMasterDelete(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<CancelDoctorDataDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/DoctorMaster/Delete',
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
    public static getApiVDoctorMasterDoctorRole(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/DoctorRole',
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
     * @returns DoctorMasterGetByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVDoctorMaster(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<DoctorMasterGetByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/{id}',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVDoctorMasterDoctorPrefix(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/DoctorPrefix',
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
    public static getApiVDoctorMasterFollowupChargesType(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/followupChargesType',
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
    public static getApiVDoctorMasterGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/getCreatedBy',
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
    public static getApiVDoctorMasterGetModifiedbyUser(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/getModifiedbyUser',
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
     * @returns DoctorMasterSaveResponceDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVDoctorMasterSave(
        version: string,
        tenant?: string,
        requestBody?: CreateDoctorMasterCommand,
    ): CancelablePromise<DoctorMasterSaveResponceDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorMaster/Save',
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
     * @param id
     * @param tenant
     * @param requestBody
     * @returns DoctorMasterSaveResponceDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVDoctorMasterUpdate(
        version: string,
        id?: string,
        tenant?: string,
        requestBody?: DoctorMasterPrimaryDetailsSaveRequestDTO,
    ): CancelablePromise<DoctorMasterSaveResponceDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/DoctorMaster/Update',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
