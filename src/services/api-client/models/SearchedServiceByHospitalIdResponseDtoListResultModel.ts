/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { SearchedServiceByHospitalIdResponseDto } from './SearchedServiceByHospitalIdResponseDto';
import type { ValidationError } from './ValidationError';
export type SearchedServiceByHospitalIdResponseDtoListResultModel = {
    data?: Array<SearchedServiceByHospitalIdResponseDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

