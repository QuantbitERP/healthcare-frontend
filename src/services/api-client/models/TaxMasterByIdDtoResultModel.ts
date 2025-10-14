/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { TaxMasterByIdDto } from './TaxMasterByIdDto';
import type { ValidationError } from './ValidationError';
export type TaxMasterByIdDtoResultModel = {
    data?: TaxMasterByIdDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

