/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ChargesEstimationSaveServiceDto } from './ChargesEstimationSaveServiceDto';
export type ChargesEstimationSaveRequestDto = {
    chargeEstimationid?: string | null;
    hospitalid?: string;
    isregistered?: boolean | null;
    patientid?: string | null;
    patientname?: string | null;
    patientaddress?: string | null;
    age?: number | null;
    gender?: number | null;
    contactNo?: string | null;
    abhaId?: string | null;
    admissiondate?: string | null;
    dischargedate?: string | null;
    noofdays?: number | null;
    consultationdoctorid?: string | null;
    billingClassId?: string | null;
    schemecompanyid?: string | null;
    visitTypeiId?: number;
    estimationTypeId?: number;
    totalAmount?: number;
    totalDiscount?: number | null;
    gstId?: string | null;
    cgstAmount?: number | null;
    sgstAmount?: number | null;
    totalGstAmount?: number | null;
    totalEstimatedAmount?: number;
    diagnosisnote?: string | null;
    remark?: string | null;
    serviceDetails?: Array<ChargesEstimationSaveServiceDto> | null;
};

