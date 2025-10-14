/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { SelectedBillsDto } from './SelectedBillsDto';
export type InvoicingGetByIdResponseDto = {
    id?: string;
    invoiceNumber?: string | null;
    invoiceDate?: string | null;
    company?: string | null;
    submissionReference?: string | null;
    submissionDate?: string | null;
    coverletter?: string;
    remarks?: string | null;
    coverLetterFormatResult?: string | null;
    bills?: Array<SelectedBillsDto> | null;
};

