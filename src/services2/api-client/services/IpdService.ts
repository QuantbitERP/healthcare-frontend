/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelBillResponseDtoListResultModelResultModel } from '../models/CancelBillResponseDtoListResultModelResultModel';
import type { CancelDocumentUploadListDtoResultModel } from '../models/CancelDocumentUploadListDtoResultModel';
import type { CancelIPDBillCommand } from '../models/CancelIPDBillCommand';
import type { CreateIPDBillCommand } from '../models/CreateIPDBillCommand';
import type { CreateIPDDraftBillCommand } from '../models/CreateIPDDraftBillCommand';
import type { CreateScanedImageCommand } from '../models/CreateScanedImageCommand';
import type { CurrentVisitServicesDtoListResultModelResultModel } from '../models/CurrentVisitServicesDtoListResultModelResultModel';
import type { DeleteDocumentUploadListCommand } from '../models/DeleteDocumentUploadListCommand';
import type { GetByIdRequestDto } from '../models/GetByIdRequestDto';
import type { IpdBilllistHeaderCountResultModel } from '../models/IpdBilllistHeaderCountResultModel';
import type { IpdBillPrintRequestDto } from '../models/IpdBillPrintRequestDto';
import type { IPDBillResponseDtoResultModel } from '../models/IPDBillResponseDtoResultModel';
import type { IpdDraftBillPrintRequestDto } from '../models/IpdDraftBillPrintRequestDto';
import type { IpdListRequestDto } from '../models/IpdListRequestDto';
import type { IpdListResponseDtoPagedResponseDtoResultModel } from '../models/IpdListResponseDtoPagedResponseDtoResultModel';
import type { KVPair } from '../models/KVPair';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { PatientIpdBillDetailsPrintDtoResultModel } from '../models/PatientIpdBillDetailsPrintDtoResultModel';
import type { PatientIpdDraftBillDetailsPrintDtoResultModel } from '../models/PatientIpdDraftBillDetailsPrintDtoResultModel';
import type { ScanedImageResponceDtoResultModel } from '../models/ScanedImageResponceDtoResultModel';
import type { SearchedServiceByIdRequestDto } from '../models/SearchedServiceByIdRequestDto';
import type { SearchedServiceByIdResponseDtoPagedResponseDtoResultModel } from '../models/SearchedServiceByIdResponseDtoPagedResponseDtoResultModel';
import type { StringResultModel } from '../models/StringResultModel';
import type { TransferLogResponceDtoListResultModelResultModel } from '../models/TransferLogResponceDtoListResultModelResultModel';
import type { UpdateIPDBillCommand } from '../models/UpdateIPDBillCommand';
import type { UpdatePatientRoomCategoryCommand } from '../models/UpdatePatientRoomCategoryCommand';
import type { UpdatePatientSchemeCompanyCommand } from '../models/UpdatePatientSchemeCompanyCommand';
import type { UpdateRoomCategoryResponseDtoResultModel } from '../models/UpdateRoomCategoryResponseDtoResultModel';
import type { UpdateUploadDocumentCommand } from '../models/UpdateUploadDocumentCommand';
import type { UploadDocumentByIdDtoResultModel } from '../models/UploadDocumentByIdDtoResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IpdService {
    /**
     * @param version
     * @param tenant
     * @returns KVPair OK
     * @throws ApiError
     */
    public static getApiVIpdBillingClassList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<KVPair>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IPD/billingClassList',
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
     * @returns IpdListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdList(
        version: string,
        tenant?: string,
        requestBody?: IpdListRequestDto,
    ): CancelablePromise<IpdListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/list',
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
     * @param startDate
     * @param endDate
     * @param hospid
     * @param tenant
     * @returns IpdBilllistHeaderCountResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdIpdBilllistHeaderCount(
        version: string,
        startDate?: string,
        endDate?: string,
        hospid?: string,
        tenant?: string,
    ): CancelablePromise<IpdBilllistHeaderCountResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/IpdBilllistHeaderCount',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'startDate': startDate,
                'endDate': endDate,
                'hospid': hospid,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns PatientIpdBillDetailsPrintDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdBillId(
        version: string,
        tenant?: string,
        requestBody?: GetByIdRequestDto,
    ): CancelablePromise<PatientIpdBillDetailsPrintDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/billId',
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
    public static getApiVIpdPaidStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IPD/paidStatus',
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
     * @returns ScanedImageResponceDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdDocumentUpload(
        version: string,
        tenant?: string,
        requestBody?: CreateScanedImageCommand,
    ): CancelablePromise<ScanedImageResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/DocumentUpload',
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
     * @returns CancelDocumentUploadListDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVIpdDocumentUpload(
        version: string,
        tenant?: string,
        requestBody?: DeleteDocumentUploadListCommand,
    ): CancelablePromise<CancelDocumentUploadListDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/IPD/DocumentUpload',
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
     * @returns ScanedImageResponceDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVIpdDocumentUpload(
        version: string,
        tenant?: string,
        requestBody?: UpdateUploadDocumentCommand,
    ): CancelablePromise<ScanedImageResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/IPD/DocumentUpload',
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
     * @returns SearchedServiceByIdResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdSearchServiceslist(
        version: string,
        tenant?: string,
        requestBody?: SearchedServiceByIdRequestDto,
    ): CancelablePromise<SearchedServiceByIdResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/SearchServiceslist',
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
     * @returns UploadDocumentByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVIpdDocumentUpload(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<UploadDocumentByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IPD/DocumentUpload/{id}',
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
     * @returns IPDBillResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdIpdbillsSavedraft(
        version: string,
        tenant?: string,
        requestBody?: CreateIPDDraftBillCommand,
    ): CancelablePromise<IPDBillResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/ipdbills/savedraft',
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
     * @returns IPDBillResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdIpdbillsSavefinal(
        version: string,
        tenant?: string,
        requestBody?: CreateIPDBillCommand,
    ): CancelablePromise<IPDBillResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/ipdbills/savefinal',
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
     * @returns PatientIpdDraftBillDetailsPrintDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdGetIpdDraftBillDetailsByBillId(
        version: string,
        tenant?: string,
        requestBody?: GetByIdRequestDto,
    ): CancelablePromise<PatientIpdDraftBillDetailsPrintDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/getIpdDraftBillDetailsByBillId',
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
     * @param visitId
     * @param version
     * @param tenant
     * @returns CurrentVisitServicesDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVIpdServicesOfCurrentVisit(
        visitId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<CurrentVisitServicesDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IPD/servicesOfCurrentVisit/{visitId}',
            path: {
                'visitId': visitId,
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVIpdIpdbillsPdf(
        version: string,
        tenant?: string,
        requestBody?: IpdBillPrintRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/Ipdbills/pdf',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVIpdIpdbillsExcel(
        version: string,
        tenant?: string,
        requestBody?: IpdBillPrintRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/Ipdbills/excel',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVIpdIpdbillsWord(
        version: string,
        tenant?: string,
        requestBody?: IpdBillPrintRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/Ipdbills/word',
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
     * @param patientVisitId
     * @param tenant
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVIpdGatePassPdf(
        version: string,
        patientVisitId?: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/GatePass/pdf',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'PatientVisitId': patientVisitId,
            },
        });
    }
    /**
     * @param version
     * @param patientVisitId
     * @param tenant
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVIpdGatePassExcel(
        version: string,
        patientVisitId?: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/GatePass/excel',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'PatientVisitId': patientVisitId,
            },
        });
    }
    /**
     * @param version
     * @param patientVisitId
     * @param tenant
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVIpdGatePassWord(
        version: string,
        patientVisitId?: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/GatePass/word',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'PatientVisitId': patientVisitId,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVIpdIpdDraftbillsPdf(
        version: string,
        tenant?: string,
        requestBody?: IpdDraftBillPrintRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/IpdDraftbills/pdf',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVIpdIpdDraftbillsExcel(
        version: string,
        tenant?: string,
        requestBody?: IpdDraftBillPrintRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/IpdDraftbills/excel',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVIpdIpdDraftbillsWord(
        version: string,
        tenant?: string,
        requestBody?: IpdDraftBillPrintRequestDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/IpdDraftbills/word',
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
     * @returns IPDBillResponseDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVIpdIpdbills(
        version: string,
        tenant?: string,
        requestBody?: UpdateIPDBillCommand,
    ): CancelablePromise<IPDBillResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/IPD/ipdbills',
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
     * @returns CancelBillResponseDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static deleteApiVIpdIpdbills(
        version: string,
        tenant?: string,
        requestBody?: CancelIPDBillCommand,
    ): CancelablePromise<CancelBillResponseDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/IPD/ipdbills',
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
     * @param visitId
     * @param version
     * @param tenant
     * @returns TransferLogResponceDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVIpdTransferLog(
        visitId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<TransferLogResponceDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/IPD/TransferLog/{visitId}',
            path: {
                'visitId': visitId,
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
     * @returns UpdateRoomCategoryResponseDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVIpdRoomcategoryupdate(
        version: string,
        tenant?: string,
        requestBody?: UpdatePatientRoomCategoryCommand,
    ): CancelablePromise<UpdateRoomCategoryResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/IPD/roomcategoryupdate',
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
     * @returns StringResultModel OK
     * @throws ApiError
     */
    public static postApiVIpdUpdatePatientCompany(
        version: string,
        tenant?: string,
        requestBody?: UpdatePatientSchemeCompanyCommand,
    ): CancelablePromise<StringResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/IPD/updatePatientCompany',
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
