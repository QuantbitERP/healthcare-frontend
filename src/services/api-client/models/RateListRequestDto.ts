/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type RateListRequestDto = {
    hospitalId?: string;
    rateNameId?: string;
    departmentId?: string;
    rateTypeId?: string;
    serviceGroupId?: string;
    applicableFromId?: string;
    statusIds?: Array<string> | null;
    billingClassIds?: Array<string> | null;
    startDate?: string;
    endDate?: string;
    currentApplicableRate?: boolean | null;
};

