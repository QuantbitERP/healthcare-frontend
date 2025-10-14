/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { ServiceHeadCodeSettingListResponseDto } from './ServiceHeadCodeSettingListResponseDto';
import type { ValidationError } from './ValidationError';
export type ServiceHeadCodeSettingListResponseDtoResultModel = {
    data?:{items:   Array<ServiceHeadCodeSettingListResponseDto>;}
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

