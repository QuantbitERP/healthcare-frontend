/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PackageResponceDto } from './PackageResponceDto';
import type { ValidationError } from './ValidationError';
export type PackageResponceDtoResultModel = {
    data?: PackageResponceDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

