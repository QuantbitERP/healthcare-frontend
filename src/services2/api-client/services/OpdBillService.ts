/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelBillCommand } from '../models/CancelBillCommand';
import type { CancelBillReasonDTOListResultModelResultModel } from '../models/CancelBillReasonDTOListResultModelResultModel';
import type { CancelBillResponseDtoListResultModelResultModel } from '../models/CancelBillResponseDtoListResultModelResultModel';
import type { CancelDraftBillCommand } from '../models/CancelDraftBillCommand';
import type { CancelDraftBillResponseDtoResultModel } from '../models/CancelDraftBillResponseDtoResultModel';
import type { CancelServiceCommand } from '../models/CancelServiceCommand';
import type { CancelServiceResponseDtoResultModel } from '../models/CancelServiceResponseDtoResultModel';
import type { CreateBillCommand } from '../models/CreateBillCommand';
import type { DecimalResultModel } from '../models/DecimalResultModel';
import type { EmployeeCatagoryListDTO } from '../models/EmployeeCatagoryListDTO';
import type { EmployeeSubCatagoryListDTO } from '../models/EmployeeSubCatagoryListDTO';
import type { GetBillDetailsDTO } from '../models/GetBillDetailsDTO';
import type { GetBillDetailsDTOResultModel } from '../models/GetBillDetailsDTOResultModel';
import type { GetBillsDto } from '../models/GetBillsDto';
import type { GetBillsResponseDtoListResultModelResultModel } from '../models/GetBillsResponseDtoListResultModelResultModel';
import type { GetDepositBalanceDto } from '../models/GetDepositBalanceDto';
import type { GetDraftBillByIdResponseDTOResultModel } from '../models/GetDraftBillByIdResponseDTOResultModel';
import type { GetHospitalServicesDto } from '../models/GetHospitalServicesDto';
import type { GetSchemeCompaniesDto } from '../models/GetSchemeCompaniesDto';
import type { GetServiceRateRequest } from '../models/GetServiceRateRequest';
import type { InsertBillOutputDTOResultModel } from '../models/InsertBillOutputDTOResultModel';
import type { InsertUpdateDraftBillCommand } from '../models/InsertUpdateDraftBillCommand';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { KVPairResultModel } from '../models/KVPairResultModel';
import type { PackageDto } from '../models/PackageDto';
import type { PatientDuesDetailsDtoListResultModel } from '../models/PatientDuesDetailsDtoListResultModel';
import type { ReportMetadata } from '../models/ReportMetadata';
import type { ReportRequestDto } from '../models/ReportRequestDto';
import type { ReportResponseDto } from '../models/ReportResponseDto';
import type { ReportSummary } from '../models/ReportSummary';
import type { ServiceRateAndMediclaimResponseResultModel } from '../models/ServiceRateAndMediclaimResponseResultModel';
import type { TodaysBillGrossDTOResultModel } from '../models/TodaysBillGrossDTOResultModel';
import type { UpdateBillCommand } from '../models/UpdateBillCommand';
import type { VisitTypeEnumDtoListResultModelResultModel } from '../models/VisitTypeEnumDtoListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OpdBillService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns GetBillsResponseDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbills(
        version: string,
        tenant?: string,
        requestBody?: GetBillsDto,
    ): CancelablePromise<GetBillsResponseDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills',
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
     * @returns InsertBillOutputDTOResultModel OK
     * @throws ApiError
     */
    public static putApiVOpdBillOpdbills(
        version: string,
        tenant?: string,
        requestBody?: UpdateBillCommand,
    ): CancelablePromise<InsertBillOutputDTOResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/OPDBill/opdbills',
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
    public static deleteApiVOpdBillOpdbills(
        version: string,
        tenant?: string,
        requestBody?: CancelBillCommand,
    ): CancelablePromise<CancelBillResponseDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/OPDBill/opdbills',
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
     * @param billId
     * @param version
     * @param tenant
     * @returns GetBillDetailsDTOResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbills(
        billId: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GetBillDetailsDTOResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/{billId}',
            path: {
                'billId': billId,
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
     * @returns InsertBillOutputDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsSave(
        version: string,
        tenant?: string,
        requestBody?: CreateBillCommand,
    ): CancelablePromise<InsertBillOutputDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/save',
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
     * @returns GetDraftBillByIdResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsDraft(
        version: string,
        tenant?: string,
        requestBody?: InsertUpdateDraftBillCommand,
    ): CancelablePromise<GetDraftBillByIdResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/draft',
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
     * @param tempDocumentNo
     * @param tenant
     * @returns GetDraftBillByIdResponseDTOResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsDraft(
        version: string,
        tempDocumentNo?: string,
        tenant?: string,
    ): CancelablePromise<GetDraftBillByIdResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/draft',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'tempDocumentNo': tempDocumentNo,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns CancelDraftBillResponseDtoResultModel OK
     * @throws ApiError
     */
    public static deleteApiVOpdBillOpdbillsDraft(
        version: string,
        tenant?: string,
        requestBody?: CancelDraftBillCommand,
    ): CancelablePromise<CancelDraftBillResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/OPDBill/opdbills/draft',
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
     * @param tenant
     * @returns TodaysBillGrossDTOResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsGross(
        version: string,
        startDate?: string,
        endDate?: string,
        tenant?: string,
    ): CancelablePromise<TodaysBillGrossDTOResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/gross',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsHospitalServices(
        version: string,
        tenant?: string,
        requestBody?: GetHospitalServicesDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/hospital/services',
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
     * @returns ServiceRateAndMediclaimResponseResultModel OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsServiceRate(
        version: string,
        tenant?: string,
        requestBody?: GetServiceRateRequest,
    ): CancelablePromise<ServiceRateAndMediclaimResponseResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/service/rate',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsSchemeCompanies(
        version: string,
        tenant?: string,
        requestBody?: GetSchemeCompaniesDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/schemeCompanies',
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
     * @returns DecimalResultModel OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsPatientDeposit(
        version: string,
        tenant?: string,
        requestBody?: GetDepositBalanceDto,
    ): CancelablePromise<DecimalResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/patient/deposit',
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
     * @param hospitalId
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsUsers(
        version: string,
        hospitalId?: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/users',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'hospitalId': hospitalId,
            },
        });
    }
    /**
     * @param version
     * @param hospitalId
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsCreatedby(
        version: string,
        hospitalId?: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/createdby',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'hospitalId': hospitalId,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsPatientCategories(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/patient/categories',
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
     * @param hospitalServiceId
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsDoctors(
        version: string,
        hospitalServiceId?: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/doctors',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'hospitalServiceId': hospitalServiceId,
            },
        });
    }
    /**
     * @param version
     * @param billId
     * @param direction
     * @param onlyForSamePatient
     * @param tenant
     * @returns GetBillDetailsDTO OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsSingleOpdBill(
        version: string,
        billId?: string,
        direction?: number,
        onlyForSamePatient?: boolean,
        tenant?: string,
    ): CancelablePromise<GetBillDetailsDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/singleOPDBill',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'billId': billId,
                'direction': direction,
                'onlyForSamePatient': onlyForSamePatient,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsPaymentsMode(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/payments/mode',
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
    public static getApiVOpdBillOpdbillsStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/status',
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
     * @returns VisitTypeEnumDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsPatientVisitType(
        version: string,
        tenant?: string,
    ): CancelablePromise<VisitTypeEnumDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/patient/visitType',
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
     * @returns CancelBillReasonDTOListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsCancelReasons(
        version: string,
        tenant?: string,
    ): CancelablePromise<CancelBillReasonDTOListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/cancelReasons',
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
     * @returns CancelBillReasonDTOListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsRefundReasons(
        version: string,
        tenant?: string,
    ): CancelablePromise<CancelBillReasonDTOListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/refundReasons',
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
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsPdf(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/pdf',
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
    public static postApiVOpdBillOpdbillsExcel(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/excel',
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
    public static postApiVOpdBillOpdbillsWord(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/word',
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
     * @returns EmployeeCatagoryListDTO OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsEmployeeCategories(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<EmployeeCatagoryListDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/employeeCategories',
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
     * @returns EmployeeSubCatagoryListDTO OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsEmployeeSubCategories(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<EmployeeSubCatagoryListDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/employeeSubCategories',
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
    public static getApiVOpdBillOpdbillsGstList(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/gstList',
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
     * @returns PackageDto OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsPackages(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<PackageDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/packages',
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
     * @returns ReportSummary OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsReports(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<ReportSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/reports',
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
     * @param reportName
     * @param tenant
     * @returns ReportMetadata OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsReportsAttributes(
        version: string,
        reportName?: string,
        tenant?: string,
    ): CancelablePromise<Array<ReportMetadata>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/reports/attributes',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'reportName': reportName,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ReportResponseDto OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsReportsData(
        version: string,
        tenant?: string,
        requestBody?: ReportRequestDto,
    ): CancelablePromise<ReportResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/reports/data',
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
     * @returns CancelServiceResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsServiceCancelAndRefund(
        version: string,
        tenant?: string,
        requestBody?: CancelServiceCommand,
    ): CancelablePromise<CancelServiceResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/service/CancelAndRefund',
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
     * @param patientId
     * @param tenant
     * @returns PatientDuesDetailsDtoListResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsPatientduesdetails(
        version: string,
        patientId?: string,
        tenant?: string,
    ): CancelablePromise<PatientDuesDetailsDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/patientduesdetails',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'PatientId': patientId,
            },
        });
    }
    /**
     * @param version
     * @param billId
     * @param tenant
     * @returns binary OK
     * @throws ApiError
     */
    public static postApiVOpdBillOpdbillsCasepaperpdf(
        version: string,
        billId?: string,
        tenant?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/OPDBill/opdbills/casepaperpdf',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'billId': billId,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsPatientPaidby(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/patient/paidby',
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
     * @param patientHospitalId
     * @param tenant
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVOpdBillOpdbillsOpdBillingClass(
        version: string,
        patientHospitalId?: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/OPDBill/opdbills/opdBillingClass',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'patientHospitalId': patientHospitalId,
            },
        });
    }
}
