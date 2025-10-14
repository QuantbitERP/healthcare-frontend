/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { RemovePackageResponseDto } from './RemovePackageResponseDto';
import type { ValidationError } from './ValidationError';
export type RemovePackageResponseDtoResultModel = {
    data?: RemovePackageResponseDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

