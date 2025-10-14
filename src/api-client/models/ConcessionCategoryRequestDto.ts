/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

import { ValidationError } from "./ValidationError";

/* tslint:disable */
export type ConcessionCategoryRequestDto = {
    id?: string;
    name?: string | null;
    defaultPercentage?: number;
    concessionCategoryTypeId?: number;
    user?: string | null;
    isBlock?: boolean;
};

export type ConcessionCategoryById={
 data:ConcessionCategoryRequestDto,
 isError?: boolean;
 errorMessage?: string | null;
 validationErrors?: Array<ValidationError> | null;
 errorCode?: string | null;
}


