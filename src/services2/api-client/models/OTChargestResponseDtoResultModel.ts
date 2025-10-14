/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { OTChargestResponseDto } from './OTChargestResponseDto';
import type { ValidationError } from './ValidationError';
export type OTChargestResponseDtoResultModel = {
    data?: OTChargestResponseDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

