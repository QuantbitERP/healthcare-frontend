/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { CompanyListDto } from '../models/CompanyListDto';
import type { ConcessionGivenByDto } from '../models/ConcessionGivenByDto';
import type { PatientListDto } from '../models/PatientListDto';
import type { PaymentModeListDto } from '../models/PaymentModeListDto';
import type { PaymentReceiptRequestDto } from '../models/PaymentReceiptRequestDto';
import type { PaymentReceivedCountSummeryDto } from '../models/PaymentReceivedCountSummeryDto';
import type { PaymentReceivedDto } from '../models/PaymentReceivedDto';
import type { PaymentReceivedResponseDtoResultModel } from '../models/PaymentReceivedResponseDtoResultModel';
import type { PaymentTypeListDto } from '../models/PaymentTypeListDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentReceivedService {
    /**
     * @param version
     * @param tenant
     * @returns ConcessionGivenByDto OK
     * @throws ApiError
     */
    public static getApiVPaymentReceivedConcessionGivenBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<ConcessionGivenByDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/concessionGivenBy',
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
     * @returns PaymentModeListDto OK
     * @throws ApiError
     */
    public static getApiVPaymentReceivedPaymentModes(
        version: string,
        tenant?: string,
    ): CancelablePromise<PaymentModeListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/paymentModes',
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
     * @param searchText
     * @param tenant
     * @returns PaymentReceivedDto OK
     * @throws ApiError
     */
    public static postApiVPaymentReceivedSearchByName(
        version: string,
        searchText?: string,
        tenant?: string,
    ): CancelablePromise<PaymentReceivedDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PaymentReceived/searchByName',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'SearchText': searchText,
            },
        });
    }
    /**
     * @param version
     * @param startDate
     * @param endDate
     * @param tenant
     * @returns PaymentReceivedCountSummeryDto OK
     * @throws ApiError
     */
    public static getApiVPaymentReceivedCountSummary(
        version: string,
        startDate?: string,
        endDate?: string,
        tenant?: string,
    ): CancelablePromise<PaymentReceivedCountSummeryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/countSummary',
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
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVPaymentReceivedPaymentReceipts(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/paymentReceipts',
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
     * @returns any OK
     * @throws ApiError
     */
    public static postApiVPaymentReceived(
        version: string,
        tenant?: string,
        requestBody?: PaymentReceiptRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PaymentReceived',
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
    public static deleteApiVPaymentReceived(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/PaymentReceived',
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
    public static putApiVPaymentReceived(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: PaymentReceiptRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PaymentReceived/{id}',
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
     * @param version
     * @param tenant
     * @returns PaymentTypeListDto OK
     * @throws ApiError
     */
    public static getApiVPaymentReceivedPaymentTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<PaymentTypeListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/paymentTypes',
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
     * @returns CompanyListDto OK
     * @throws ApiError
     */
    public static getApiVPaymentReceivedCompanyList(
        version: string,
        tenant?: string,
    ): CancelablePromise<CompanyListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/companyList',
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
     * @returns PatientListDto OK
     * @throws ApiError
     */
    public static getApiVPaymentReceivedPatientList(
        version: string,
        tenant?: string,
    ): CancelablePromise<PatientListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/patientList',
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
     * @returns PaymentReceivedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVPaymentReceivedPaymentReceivedId(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<PaymentReceivedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/paymentReceivedId/{Id}',
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
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVPaymentReceivedCreatedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/CreatedByList',
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
    public static getApiVPaymentReceivedModifiedByList(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PaymentReceived/ModifiedByList',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
