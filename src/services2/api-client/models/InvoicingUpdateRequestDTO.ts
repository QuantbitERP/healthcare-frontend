/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { InvoicingBillUpdateDto } from './InvoicingBillUpdateDto';
export type InvoicingUpdateRequestDTO = {
    invoiceId?: string;
    invoiceDate?: string | null;
    submissionRefNo?: string | null;
    submissionDate?: string | null;
    selectedBills?: Array<InvoicingBillUpdateDto> | null;
    coverLetterId?: string;
    coverLetterContents?: string | null;
    remarks?: string | null;
};

