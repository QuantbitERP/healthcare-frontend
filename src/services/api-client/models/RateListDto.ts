/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import { KVPair } from "@/api-client";

export type RateListDto = {
    id?: string;
    serviceCode?: string | null;
    serviceName?: string | null;
    department?: string | null;
    serviceGroup?: string | null;
    effectiveFrom?: string;
    status?: string | null;
    classOutpatientGeneral?: number;
    classOutpatientSpecial?: number;
    classSuperSpecialityOpd?: number;
    classHealthCheck?: number;
    classCriticalCare?: number;
    classDelux?: number;
    classGeneralWard?: number;
    classSemiPrivate?: number;
    classSharedPrivateAc?: number;
    classSuperDelux?: number;
    classEmergencyWard?: number;
    classDayCare?: number;
    modifiedBy?: string | null;
    modifiedDate?: string;
    createdBy?: string | null;
    createdDate?: string;
};

export type CommonResponseDto = {
    data: {
      items:KVPair[]
    }|null;
    isError: boolean;
    errorMessage: string | null;
    validationErrors: string | null;
    errorCode: string | null;
  }

  
      