/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateSuggestServiceCommand } from '../models/CreateSuggestServiceCommand';
import type { DeleteSuggestServicesCommand } from '../models/DeleteSuggestServicesCommand';
import type { GetVisitDetailsByIdResponseDtoResultModel } from '../models/GetVisitDetailsByIdResponseDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { SearchedServiceByHospitalIdRequestDto } from '../models/SearchedServiceByHospitalIdRequestDto';
import type { SearchedServiceByHospitalIdResponseDtoListResultModel } from '../models/SearchedServiceByHospitalIdResponseDtoListResultModel';
import type { SearchedServiceByHospitalIdResponseDtoPagedResponseDtoResultModel } from '../models/SearchedServiceByHospitalIdResponseDtoPagedResponseDtoResultModel';
import type { SuggestServicesDeleteResponceDtoResultModel } from '../models/SuggestServicesDeleteResponceDtoResultModel';
import type { SuggestServicesGetByIdDtoResultModel } from '../models/SuggestServicesGetByIdDtoResultModel';
import type { SuggestServicesGetByIdResponseDtoResultModel } from '../models/SuggestServicesGetByIdResponseDtoResultModel';
import type { SuggestServicesListRequestDto } from '../models/SuggestServicesListRequestDto';
import type { SuggestServicesListResponseDtoPagedResponseDtoResultModel } from '../models/SuggestServicesListResponseDtoPagedResponseDtoResultModel';
import type { SuggestServicesPatientVisitIDResponseDtoPagedResponseDtoResultModel } from '../models/SuggestServicesPatientVisitIDResponseDtoPagedResponseDtoResultModel';
import type { SuggestServicesSaveResponseDtoResultModel } from '../models/SuggestServicesSaveResponseDtoResultModel';
import type { UpdateSuggestServiceCommand } from '../models/UpdateSuggestServiceCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SuggestServicesService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns SuggestServicesListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVSuggestServicesList(
        version: string,
        tenant?: string,
        requestBody?: SuggestServicesListRequestDto,
    ): CancelablePromise<SuggestServicesListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/SuggestServices/list',
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
     * @param patientid
     * @param patientVisitId
     * @param tenant
     * @returns SuggestServicesGetByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVSuggestServicesId(
        version: string,
        patientid?: string,
        patientVisitId?: string,
        tenant?: string,
    ): CancelablePromise<SuggestServicesGetByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/SuggestServices/id',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'Patientid': patientid,
                'PatientVisitID': patientVisitId,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns SearchedServiceByHospitalIdResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVSuggestServicesSearchServiceslist(
        version: string,
        tenant?: string,
        requestBody?: SearchedServiceByHospitalIdRequestDto,
    ): CancelablePromise<SearchedServiceByHospitalIdResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/SuggestServices/SearchServiceslist',
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
     * @returns SuggestServicesDeleteResponceDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVSuggestServices(
        version: string,
        tenant?: string,
        requestBody?: DeleteSuggestServicesCommand,
    ): CancelablePromise<SuggestServicesDeleteResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/SuggestServices',
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
     * @returns SuggestServicesSaveResponseDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVSuggestServices(
        version: string,
        tenant?: string,
        requestBody?: UpdateSuggestServiceCommand,
    ): CancelablePromise<SuggestServicesSaveResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/SuggestServices',
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
    public static getApiVSuggestServicesPriorityEnum(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/SuggestServices/PriorityEnum',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param visitId
     * @param version
     * @param tenant
     * @returns SuggestServicesPatientVisitIDResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVSuggestServicesGetRequisitionDetailsByPatientVisitId(
        visitId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<SuggestServicesPatientVisitIDResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/SuggestServices/GetRequisitionDetailsByPatientVisitID{VisitId}',
            path: {
                'VisitId': visitId,
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
     * @returns SuggestServicesSaveResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVSuggestServicesSave(
        version: string,
        tenant?: string,
        requestBody?: CreateSuggestServiceCommand,
    ): CancelablePromise<SuggestServicesSaveResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/SuggestServices/save',
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
     * @returns SuggestServicesGetByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVSuggestServicesGetPatinetWiseInvestigationById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<SuggestServicesGetByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/SuggestServices/GetPatinetWiseInvestigationById/{Id}',
            path: {
                'Id': id,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param hospitalServiceId
     * @param version
     * @param tenant
     * @returns SearchedServiceByHospitalIdResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static getApiVSuggestServicesGetProfileServicesByHospitalserviceId(
        hospitalServiceId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<SearchedServiceByHospitalIdResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/SuggestServices/GetProfileServicesByHospitalserviceId{HospitalServiceId}',
            path: {
                'HospitalServiceId': hospitalServiceId,
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
    public static getApiVSuggestServicesAdmitteddoctors(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/SuggestServices/admitteddoctors',
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
     * @param patientid
     * @param patientVisitId
     * @param tenant
     * @returns GetVisitDetailsByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVSuggestServicesVisitdetails(
        version: string,
        patientid?: string,
        patientVisitId?: string,
        tenant?: string,
    ): CancelablePromise<GetVisitDetailsByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/SuggestServices/visitdetails',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'Patientid': patientid,
                'PatientVisitID': patientVisitId,
            },
        });
    }
}
