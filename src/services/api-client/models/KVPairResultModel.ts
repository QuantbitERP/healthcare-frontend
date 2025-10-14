/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { KVPair } from './KVPair';
import type { ValidationError } from './ValidationError';
export type KVPairResultModel = {
    data?: KVPair;
    isError?: boolean;
    errorMessage?: string | null;
    validationErrors?: Array<ValidationError> | null;
    errorCode?: string | null;
};

