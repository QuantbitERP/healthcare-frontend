/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PackageCountResponseDto } from './PackageCountResponseDto';
import type { ValidationError } from './ValidationError';
export type PackageCountResponseDtoResultModel = {
    data?: PackageCountResponseDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

