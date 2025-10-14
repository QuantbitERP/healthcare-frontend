/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GetByIdResponceDto } from './GetByIdResponceDto';
import type { ValidationError } from './ValidationError';
export type GetByIdResponceDtoResultModel = {
    data?: GetByIdResponceDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

