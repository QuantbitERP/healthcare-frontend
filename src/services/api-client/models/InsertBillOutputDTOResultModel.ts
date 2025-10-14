/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { InsertBillOutputDTO } from './InsertBillOutputDTO';
import type { ValidationError } from './ValidationError';
export type InsertBillOutputDTOResultModel = {
    data?: InsertBillOutputDTO;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

