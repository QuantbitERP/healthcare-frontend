/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { InvoicingBillSaveDto } from './InvoicingBillSaveDto';
export type InvoicingSaveDto = {
    invoiceDate?: string | null;
    company?: string;
    submissionRefNo?: string | null;
    submissionDate?: string | null;
    selectedBills?: Array<InvoicingBillSaveDto> | null;
    coverLetterId?: string;
    coverLetterContents?: string | null;
    remarks?: string | null;
};

