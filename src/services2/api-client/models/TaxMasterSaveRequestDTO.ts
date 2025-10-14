/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { TaxDetailsSaveRequestDTO } from './TaxDetailsSaveRequestDTO';
export type TaxMasterSaveRequestDTO = {
    id?: string;
    name?: string | null;
    taxcode?: number;
    isBlock?: boolean;
    taxDetails?: Array<TaxDetailsSaveRequestDTO> | null;
};

