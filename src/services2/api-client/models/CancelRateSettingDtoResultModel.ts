/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelRateSettingDto } from './CancelRateSettingDto';
import type { ValidationError } from './ValidationError';
export type CancelRateSettingDtoResultModel = {
    data?: CancelRateSettingDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

