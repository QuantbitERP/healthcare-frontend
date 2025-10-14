/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GetBillDetailsDTO } from './GetBillDetailsDTO';
import type { ValidationError } from './ValidationError';
export type GetBillDetailsDTOResultModel = {
    data?: GetBillDetailsDTO;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

