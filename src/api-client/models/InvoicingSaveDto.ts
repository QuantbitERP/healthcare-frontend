/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { InvoicingBillDto } from './InvoicingBillDto';
export type InvoicingSaveDto = {
    invoiceNo?: string | null;
    invoiceDate?: string | null;
    company?: string | null;
    submissionRefNo?: string | null;
    submissionDate?: string | null;
    selectedBills?: Array<InvoicingBillDto> | null;
    isCoverLetterAvailable?: boolean | null;
    coverLetterId?: string | null;
    coverLetterContents?: string | null;
    remarks?: string | null;
};

