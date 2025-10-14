/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { SuggestServiceDetailDto } from './SuggestServiceDetailDto';
export type SuggestServicesSaveRequestDto = {
    hospitalId?: string;
    patientvisitid?: string;
    serviceDetails?: Array<SuggestServiceDetailDto> | null;
    clinicalRemarks?: string | null;
};

