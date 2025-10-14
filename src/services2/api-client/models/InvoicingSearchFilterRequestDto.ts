/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type InvoicingSearchFilterRequestDto = {
    startDate?: string;
    endDate?: string;
    searchTerm?: string | null;
    companyList?: Array<string> | null;
    associateCompanyList?: Array<string> | null;
    billStatus?: Array<number> | null;
    billType?: Array<number> | null;
    iscCverLetterAvailable?: boolean | null;
    pageNumber?: number;
    pageSize?: number;
};

