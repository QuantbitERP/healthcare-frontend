/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { FinanceAuthorityResponceDto } from './FinanceAuthorityResponceDto';
import type { ValidationError } from './ValidationError';
export type FinanceAuthorityResponceDtoResultModel = {
    data?: FinanceAuthorityResponceDto;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

