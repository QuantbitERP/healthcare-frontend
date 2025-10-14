/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type EmployeeTransferringLimitDto = {
    id?: string;
    employeeName?: string | null;
    employeeCode?: string | null;
    category?: string | null;
    designation?: string | null;
    dateAndTimeOfTransfer?: string;
    fromVisitType?: string | null;
    toVisitType?: string | null;
    availableLimitFromCategory?: number;
    transferAmount?: number;
    opdAvailableLimit?: number;
    ipdAvailableLimit?: number;
    totalAvailableLimit?: number;
    opdEmployeeBalance?: number;
    ipdEmployeeBalance?: number;
    totalAmount?: number;
    referredDoctor?: string | null;
    modifiedOn?: string;
    modifiedBy?: string | null;
    createdOn?: string;
    createdBy?: string | null;
};

