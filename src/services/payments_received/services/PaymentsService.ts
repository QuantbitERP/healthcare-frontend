/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentsService {
    /**
     * Retrieves payment statistics
     * @returns any payment statistics retrieved
     * @throws ApiError
     */
    public static getApiMnPaymentsStats(): CancelablePromise<{
        payment_stats: {
            /**
             * Total amount received from all payments
             */
            total_patient_amount: string;
            /**
             * Total concession amount given
             */
            total_company_amount: string;
            /**
             * Total TDS amount
             */
            total_amount: string;
            /**
             * Total processing amount
             */
            no_of_patient_receipts: string;
            /**
             * Total disallowed amount
             */
            no_of_company_receipts: string;
            /**
             * Total write off amount
             */
            total_receipts: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/payments/stats',
        });
    }
    /**
     * Retrieves a list of payments
     * @param paymentMode Filter by payment mode:
     * * `Cash`
     * * `Online`
     * * `Card`
     *
     * @param companyId Filter by company ID
     * @param paymentDate Filter by payment date (YYYY-MM-DD)
     * @param referenceNo Filter by reference number
     * @param sortBy Field to sort by
     * @param sortOrder Sort order (asc/desc)
     * @param page Page number for pagination
     * @param perPage Number of items per page
     * @returns any payments found
     * @throws ApiError
     */
    public static getApiMnPayments(
        paymentMode?: string,
        companyId?: number,
        paymentDate?: string,
        referenceNo?: string,
        sortBy?: string,
        sortOrder?: string,
        page?: number,
        perPage?: number,
    ): CancelablePromise<{
        payments: Array<{
            id: number;
            company_id: number;
            amount_received: string;
            payment_date: string;
            reference_no: string;
            payment_mode: string;
            concession_amount: string;
            concession_percentage: number;
            concession_given_by?: string | null;
            concession_remark?: string | null;
            tds: string;
            processing_amount: string;
            disallowed_amount: string;
            write_off_amount: string;
            created_by: string;
            created_by_id: number;
            created_on: string;
            modified_by: string;
            modified_by_id: number;
            modified_on: string;
        }>;
        meta: {
            total_count: number;
            total_pages: number;
            current_page: number;
            per_page: number;
            sort_by: string;
            sort_order: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/payments',
            query: {
                'payment_mode': paymentMode,
                'company_id': companyId,
                'payment_date': paymentDate,
                'reference_no': referenceNo,
                'sort_by': sortBy,
                'sort_order': sortOrder,
                'page': page,
                'per_page': perPage,
            },
        });
    }
    /**
     * Retrieves payment details by ID
     * @param id ID of the payment to retrieve
     * @returns any payment found
     * @throws ApiError
     */
    public static getApiMnPayments1(
        id: number,
    ): CancelablePromise<{
        payment: {
            id: number;
            company_id: number;
            amount_received: string;
            payment_date: string;
            reference_no: string;
            payment_mode: string;
            concession_amount: string;
            concession_percentage: number;
            concession_given_by?: string | null;
            concession_remark?: string | null;
            tds: string;
            processing_amount: string;
            disallowed_amount: string;
            write_off_amount: string;
            created_by: string;
            created_by_id: number;
            created_on: string;
            modified_by: string;
            modified_by_id: number;
            modified_on: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/payments/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `payment not found`,
            },
        });
    }
    /**
     * Deletes a payment
     * @param id ID of the payment to delete
     * @param deleteReason Reason for deleting the payment
     * @param deletedById ID of the user deleting the payment
     * @returns any payment deleted
     * @throws ApiError
     */
    public static deleteApiMnPayments(
        id: number,
        deleteReason: string,
        deletedById: number,
    ): CancelablePromise<{
        message: string;
        payment: {
            id: number;
            reference_no: string;
            amount_received: string;
            delete_reason: string;
            deleted_by: string;
            deleted_by_id: number;
            deleted_at: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/mn/payments/{id}',
            path: {
                'id': id,
            },
            query: {
                'delete_reason': deleteReason,
                'deleted_by_id': deletedById,
            },
            errors: {
                404: `payment not found`,
                422: `missing delete reason`,
            },
        });
    }
    /**
     * Retrieves a list of companies for dropdown
     * @param search Search term for company name or code
     * @returns any companies filtered by search term
     * @throws ApiError
     */
    public static getApiMnPaymentsCompanies(
        search?: string,
    ): CancelablePromise<{
        companies: Array<{
            id: number;
            name: string;
            code: string;
            status: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/payments/companies',
            query: {
                'search': search,
            },
        });
    }
    /**
     * Retrieves a list of concessions for dropdown
     * @param search Search term for concession name, code, or description
     * @param status Filter by concession status:
     * * `Active`
     * * `Inactive`
     *
     * @returns any concessions filtered by status
     * @throws ApiError
     */
    public static getApiMnPaymentsConcessions(
        search?: string,
        status?: string,
    ): CancelablePromise<{
        concessions: Array<{
            id: number;
            name: string;
            code: string;
            percentage: number;
            status: string;
            description: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/payments/concessions',
            query: {
                'search': search,
                'status': status,
            },
        });
    }
    /**
     * Records a new payment with associated bills
     * @param requestBody
     * @returns any payment recorded successfully
     * @throws ApiError
     */
    public static postApiMnPaymentsRecord(
        requestBody?: {
            /**
             * ID of the company (required)
             */
            company_id: number;
            /**
             * Total amount received (required)
             */
            amount_received: number;
            /**
             * Payment date (required)
             */
            payment_date: string;
            /**
             * Reference number (optional, auto-generated if not provided)
             */
            reference_no?: string;
            /**
             * Payment mode (required)
             */
            payment_mode: string;
            /**
             * Concession given by (optional)
             */
            concession_given_by?: string;
            /**
             * Concession remark (optional)
             */
            concession_remark?: string;
            /**
             * Write off amount (optional)
             */
            write_off_amount?: number;
            /**
             * ID of the user creating the payment (required)
             */
            created_by_id: number;
            /**
             * Array of bills to record payment for (at least one bill required)
             */
            bills: Array<{
                /**
                 * ID of the bill (required)
                 */
                bill_id: number;
                /**
                 * Bill amount (required)
                 */
                amount: number;
                /**
                 * Concession percentage for this bill (optional)
                 */
                concession_percentage?: number;
                /**
                 * Concession amount for this bill (optional)
                 */
                concession_amount?: number;
                /**
                 * TDS amount for this bill (optional)
                 */
                tds?: number;
                /**
                 * Processing amount for this bill (optional)
                 */
                processing_amount?: number;
                /**
                 * Disallowed amount for this bill (optional)
                 */
                disallow_amount?: number;
            }>;
        },
    ): CancelablePromise<{
        payment: {
            id: number;
            company_id: number;
            amount_received: string;
            payment_date: string;
            reference_no: string;
            payment_mode: string;
            concession_amount: string;
            concession_percentage: number;
            concession_given_by?: string | null;
            concession_remark?: string | null;
            tds: string;
            processing_amount: string;
            disallowed_amount: string;
            write_off_amount: string;
            created_by: string;
            created_by_id: number;
            created_on: string;
            modified_by: string;
            modified_by_id: number;
            modified_on: string;
            status: string;
        };
        bills: Array<{
            bill_id: number;
            bill_no: string;
            patient_name: string;
            bill_amount: string;
            concession_percentage: number;
            concession_amount: string;
            tds: string;
            processing_amount: string;
            disallow_amount: string;
            net_amount: string;
        }>;
        summary: {
            total_bill_amount: string;
            total_concession_amount: string;
            total_tds: string;
            total_processing_amount: string;
            total_disallow_amount: string;
            total_net_amount: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/payments/record',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `bill not found`,
                422: `invalid request`,
            },
        });
    }
    /**
     * Creates or updates a payment
     * @param requestBody
     * @returns any payment updated
     * @throws ApiError
     */
    public static postApiMnPaymentsSave(
        requestBody?: {
            /**
             * Payment ID (required for update, omit for create)
             */
            id?: number;
            /**
             * ID of the company (required for create)
             */
            company_id?: number;
            /**
             * Amount received (required for create)
             */
            amount_received?: number;
            /**
             * Payment date (required for create)
             */
            payment_date?: string;
            /**
             * Reference number (optional)
             */
            reference_no?: string;
            /**
             * Payment mode (required for create)
             */
            payment_mode?: string;
            /**
             * Concession amount (optional)
             */
            concession_amount?: number;
            /**
             * Concession percentage (optional)
             */
            concession_percentage?: number;
            /**
             * Concession given by (optional)
             */
            concession_given_by?: string;
            /**
             * Concession remark (optional)
             */
            concession_remark?: string;
            /**
             * TDS amount (optional)
             */
            tds?: number;
            /**
             * Processing amount (optional)
             */
            processing_amount?: number;
            /**
             * Disallowed amount (optional)
             */
            disallowed_amount?: number;
            /**
             * Write off amount (optional)
             */
            write_off_amount?: number;
            /**
             * ID of the user creating the payment (required for create)
             */
            created_by_id?: number;
            /**
             * ID of the user updating the payment (required for update)
             */
            modified_by_id?: number;
        },
    ): CancelablePromise<{
        payment: {
            id: number;
            company_id: number;
            amount_received: string;
            payment_date: string;
            reference_no: string;
            payment_mode: string;
            concession_amount: string;
            concession_percentage: number;
            concession_given_by?: string;
            concession_remark?: string;
            tds: string;
            processing_amount: string;
            disallowed_amount: string;
            write_off_amount: string;
            created_by: string;
            created_by_id: number;
            created_on: string;
            modified_by: string;
            modified_by_id: number;
            modified_on: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/payments/save',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `payment not found`,
                422: `invalid request`,
            },
        });
    }
    /**
     * Retrieves column configuration for payments list
     * @returns any column configuration retrieved
     * @throws ApiError
     */
    public static getApiMnPaymentsColumns(): CancelablePromise<{
        all_columns: Array<{
            id: string;
            name: string;
            selected: boolean;
        }>;
        selected_columns: Array<{
            id: string;
            name: string;
            selected: boolean;
        }>;
        unselected_columns: Array<{
            id: string;
            name: string;
            selected: boolean;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/payments/columns',
        });
    }
    /**
     * Saves column preferences for payments list
     * @param requestBody
     * @returns any column preferences saved
     * @throws ApiError
     */
    public static postApiMnPaymentsColumns(
        requestBody?: {
            /**
             * Array of column IDs that should be selected
             */
            selected_columns: Array<string>;
        },
    ): CancelablePromise<{
        all_columns: Array<{
            id: string;
            name: string;
            selected: boolean;
        }>;
        selected_columns: Array<{
            id: string;
            name: string;
            selected: boolean;
        }>;
        unselected_columns: Array<{
            id: string;
            name: string;
            selected: boolean;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/payments/columns',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `invalid request`,
            },
        });
    }
    /**
     * Retrieves bills associated with a payment
     * @param id ID of the payment to get bills for
     * @param hospitalId Filter by hospital ID
     * @param patientId Filter by patient ID
     * @param patientName Filter by patient name (case-insensitive partial match)
     * @param referralNo Filter by referral number (case-insensitive partial match)
     * @param visitNo Filter by visit number
     * @param billNo Filter by bill number (case-insensitive partial match)
     * @param claimNo Filter by claim number (case-insensitive partial match)
     * @param sortBy Field to sort by:
     * * `patient_name`
     * * `referral_no`
     * * `visit_no`
     * * `bill_no`
     * * `bill_datetime`
     * * `claim_no`
     * * `bill_amount`
     * * `company_amount`
     * * `balance_amount`
     *
     * @param sortOrder Sort order (asc/desc)
     * @param page Page number for pagination
     * @param perPage Number of items per page
     * @returns any bills found
     * @throws ApiError
     */
    public static getApiMnPaymentsBills(
        id: number,
        hospitalId?: number,
        patientId?: number,
        patientName?: string,
        referralNo?: string,
        visitNo?: string,
        billNo?: string,
        claimNo?: string,
        sortBy?: string,
        sortOrder?: string,
        page?: number,
        perPage?: number,
    ): CancelablePromise<{
        bills: Array<{
            id: number;
            hospital_id: number;
            patient_id: number;
            patient_name: string;
            referral_no: string;
            visit_no: string;
            bill_no: string;
            bill_datetime: string;
            claim_no: string;
            bill_amount: string;
            company_amount: string;
            balance_amount: string;
        }>;
        meta: {
            total_count: number;
            total_pages: number;
            current_page: number;
            per_page: number;
            sort_by: string;
            sort_order: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/payments/{id}/bills',
            path: {
                'id': id,
            },
            query: {
                'hospital_id': hospitalId,
                'patient_id': patientId,
                'patient_name': patientName,
                'referral_no': referralNo,
                'visit_no': visitNo,
                'bill_no': billNo,
                'claim_no': claimNo,
                'sort_by': sortBy,
                'sort_order': sortOrder,
                'page': page,
                'per_page': perPage,
            },
            errors: {
                404: `payment not found`,
            },
        });
    }
    /**
     * Distributes a payment across multiple bills
     * @param requestBody
     * @returns any payment distributed successfully
     * @throws ApiError
     */
    public static postApiMnPaymentsDistribute(
        requestBody?: {
            /**
             * ID of the payment to distribute
             */
            payment_id: number;
            /**
             * Total amount to distribute (must match payment amount)
             */
            total_amount: number;
            /**
             * Array of bills to distribute the payment across (minimum 2 bills required)
             */
            bills: Array<{
                /**
                 * ID of the bill
                 */
                bill_id: number;
                /**
                 * Bill amount
                 */
                amount: number;
                /**
                 * Concession percentage for this bill
                 */
                concession_percentage?: number;
                /**
                 * Concession amount for this bill
                 */
                concession_amount?: number;
                /**
                 * TDS amount for this bill
                 */
                tds?: number;
                /**
                 * Processing amount for this bill
                 */
                processing_amount?: number;
                /**
                 * Disallowed amount for this bill
                 */
                disallow_amount?: number;
            }>;
        },
    ): CancelablePromise<{
        payment: {
            id: number;
            reference_no: string;
            total_amount: string;
            distributed_amount: string;
            status: string;
        };
        bills: Array<{
            bill_id: number;
            bill_no: string;
            patient_name: string;
            bill_amount: string;
            concession_percentage: number;
            concession_amount: string;
            tds: string;
            processing_amount: string;
            disallow_amount: string;
            net_amount: string;
        }>;
        summary: {
            total_bill_amount: string;
            total_concession_amount: string;
            total_tds: string;
            total_processing_amount: string;
            total_disallow_amount: string;
            total_net_amount: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mn/payments/distribute',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `payment not found`,
                422: `invalid request`,
            },
        });
    }
}
