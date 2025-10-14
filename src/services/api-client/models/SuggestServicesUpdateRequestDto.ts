/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { UpdateSuggestServiceDetailDto } from './UpdateSuggestServiceDetailDto';
export type SuggestServicesUpdateRequestDto = {
    investigationRequisitionId?: string;
    billRequisitionId?: string | null;
    hospitalId?: string;
    patientvisitid?: string;
    serviceDetails?: Array<UpdateSuggestServiceDetailDto> | null;
    clinicalRemarks?: string | null;
};

