/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { IPDBillResponseDto } from './IPDBillResponseDto';
import type { ValidationError } from './ValidationError';
export type IPDBillResponseDtoResultModel = {
    data?: IPDBillResponseDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

