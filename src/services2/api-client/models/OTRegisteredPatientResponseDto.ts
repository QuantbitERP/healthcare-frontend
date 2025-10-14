/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { OTChargeDto } from './OTChargeDto';
export type OTRegisteredPatientResponseDto = {
    otSerialNo?: string | null;
    date?: string;
    patientName?: string | null;
    uhid?: string | null;
    visitTypeId?: number;
    primarySurgeryName?: string | null;
    wardId?: string;
    wardName?: string | null;
    roomId?: string;
    roomName?: string | null;
    bedId?: string;
    bedName?: string | null;
    modifiedBy?: string | null;
    modifiedDate?: string;
    casePaperId?: string;
    gender?: number;
    age?: number;
    categoryName?: string | null;
    associateDoctor?: string | null;
    department?: string | null;
    primarySurgeon?: string | null;
    secondarySurgeon?: string | null;
    anesthetist?: string | null;
    otCharges?: Array<OTChargeDto> | null;
};

