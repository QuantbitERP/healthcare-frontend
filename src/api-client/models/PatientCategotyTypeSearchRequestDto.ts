/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type PatientCategotyTypeSearchRequestDto = {
    patientCategoryTypeIds?: Array<string> | null;
    searchTerm?: string | null;
    selfPaying?: boolean;
   // modifiedBy?: Array<string> | null;
   modifiedByList: Array<string>|null;
   createdByList:Array<string>|null;
    //createdBy?: Array<string> | null;
   // fromDate?: string | null;
    //toDate?: string | null;
   // page?: number | null;
    pageSize: number;
    page: number;
};

