/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GSTTaxDeleteResponseDto } from './GSTTaxDeleteResponseDto';
import type { ValidationError } from './ValidationError';
export type GSTTaxDeleteResponseDtoListResultModel = {
    data?: Array<GSTTaxDeleteResponseDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

