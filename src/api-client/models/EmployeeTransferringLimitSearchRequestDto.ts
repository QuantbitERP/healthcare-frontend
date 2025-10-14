/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type EmployeeTransferringLimitSearchRequestDto = {
    searchText?: string | null;
    categoryId?: string;
    CategoryName?: string | null;
    designationId?: string;
    DesignationName?: string | null;
    referredDoctorId?: string;
    referredDoctorName?: string | null;
    currentApplicableRate?: boolean;
    createdBy?: Array<string> | null;
    modifiedBy?: Array<string> | null;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
};

