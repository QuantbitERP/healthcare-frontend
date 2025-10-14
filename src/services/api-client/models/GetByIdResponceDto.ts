/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ChargesEstimationServices } from './ChargesEstimationServices';
export type GetByIdResponceDto = {
    patientid?: string | null;
    patientname?: string | null;
    patientaddress?: string | null;
    age?: number | null;
    gender?: number | null;
    contactNo?: string | null;
    abhaId?: string | null;
    adharCardId?: string | null;
    isregistered?: boolean | null;
    schemecompanyid?: string | null;
    schemecompanName?: string | null;
    schemecompanytypeid?: string | null;
    patientcategoryid?: string;
    patientcategoryName?: string | null;
    visitTypeiId?: number | null;
    hospitaldoctorid?: string | null;
    hospitaldoctName?: string | null;
    billingRoomcategoryid?: string | null;
    billingRoomcategoryName?: string | null;
    admissiondate?: string | null;
    dischargedate?: string | null;
    noofdays?: number | null;
    estimationTypeId?: number;
    diagnosisnote?: string | null;
    remark?: string | null;
    totalAmount?: number;
    totalDiscount?: number;
    totalEstimatedAmount?: number;
    chargesEstimationServices?: Array<ChargesEstimationServices> | null;
};

