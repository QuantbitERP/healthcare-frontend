/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PackageDeleteResponceDto } from './PackageDeleteResponceDto';
import type { ValidationError } from './ValidationError';
export type PackageDeleteResponceDtoListResultModel = {
    data?: Array<PackageDeleteResponceDto> | null;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

