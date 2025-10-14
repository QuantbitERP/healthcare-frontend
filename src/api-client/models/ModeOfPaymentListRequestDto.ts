/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type ModeOfPaymentListRequestDto = {
    searchTerm: string | null;
    paymentType?: Array<string> | null;
    startDate?: string;
    endDate?: string;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    page?: number;
    pageSize?: number;
};

