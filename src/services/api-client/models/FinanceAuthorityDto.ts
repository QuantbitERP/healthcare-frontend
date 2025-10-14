/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type FinanceAuthorityDto = {
    id?: string;
    isActive?: boolean | null;
    transactedBy?: string | null;
    transactedDate?: string | null;
    remark?: string | null;
    lastChanged?: string | null;
    version?: number | null;
    authName?: string | null;
    mobileNumber?: string | null;
    email?: string | null;
    doctorId?: string | null;
    employeeId?: string | null;
    isBlock?: boolean;
    createdBy?: string | null;
    createdOn?: string | null;
    modifiedBy?: string | null;
    modifiedOn?: string | null;
    doctorName?: string | null;
    employeeName?: string | null;
};

// Update payload DTO for Finance Authority
export type FinanceAuthorityUpdatePayload = {
    id: string;
    authName: string;
    mobileNumber: string;
    email: string;
    doctorId: string;
    employeeId: string;
    isBlock: boolean;
};

