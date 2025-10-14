/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
export type ServiceHeadCodeSettingListRequestDto = {
    departmentId?: string | null;
    hospitalId?: string | null;
    companyId?: string | null;
    searchTerm?: string | null;
    page?: number;
    pageSize?: number;
};

// Wrapped request body type for the API
export type ServiceHeadCodeSettingListWrappedRequestDto = {
    serviceHeadCodeSettingListRequestDto: ServiceHeadCodeSettingListRequestDto;
};

