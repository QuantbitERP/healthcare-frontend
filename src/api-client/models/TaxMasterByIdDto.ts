/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { TaxMasterDetilas } from './TaxMasterDetilas';
export type TaxMasterByIdDto = {
    id?: string | null;
    name?: string | null;
    taxcode?: number;
    isBlock?: boolean;
    taxpercentage?: number;
    cesspercentage?: number | null;
    taxDetails?: Array<TaxMasterDetilas> | null;
};

