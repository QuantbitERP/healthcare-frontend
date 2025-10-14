/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type RateSettingListRequestDto = {
    hospitalIdList?: Array<string> | null;
    departmentIdList?: Array<string> | null;
    rateNameList?: Array<string> | null;
    rateCatList?: Array<number> | null;
    status?: Array<number> | null;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    currentApplicable?: boolean;
    searchTerm?: string | null;
    page?: number;
    pageSize?: number;
};

