/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { RateSettingResponceDto } from './RateSettingResponceDto';
import type { ValidationError } from './ValidationError';
export type RateSettingResponceDtoResultModel = {
    data?: RateSettingResponceDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

