/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ScanedImageResponceDto } from './ScanedImageResponceDto';
import type { ValidationError } from './ValidationError';
export type ScanedImageResponceDtoResultModel = {
    data?: ScanedImageResponceDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

