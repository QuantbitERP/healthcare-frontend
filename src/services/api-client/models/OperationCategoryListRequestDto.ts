/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

export type OperationCategoryListRequestDto = {
    hospitalId?: string;
    startDate?: string;
    endDate?: string;
    createdByList?: Array<string> | null;
    modifiedByList?: Array<string> | null;
    status?: Array<number> | null;
    searchTerm?: string | null;
    page:number;
    pageSize:number;
};

