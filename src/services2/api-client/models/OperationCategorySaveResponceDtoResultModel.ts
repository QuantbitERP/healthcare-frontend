/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { OperationCategorySaveResponceDto } from './OperationCategorySaveResponceDto';
import type { ValidationError } from './ValidationError';
export type OperationCategorySaveResponceDtoResultModel = {
    data?: OperationCategorySaveResponceDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

