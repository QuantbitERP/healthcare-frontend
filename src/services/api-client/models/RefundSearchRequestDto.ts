/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type RefundSearchRequestDto = {
    searchText?: string | null;
    status?: Array<string> | null;
    approvedBy?: Array<string> | null;
    refundType?: Array<string> | null;
    refundScope?: Array<string> | null;
    cancelledBills?: boolean;
    meMode?: string | null;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
};

