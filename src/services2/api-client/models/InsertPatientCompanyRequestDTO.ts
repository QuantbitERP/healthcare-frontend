/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DiscountDetailsDto } from './DiscountDetailsDto';
import type { DocumentDetailsDto } from './DocumentDetailsDto';
import type { ExclusionDto } from './ExclusionDto';
export type InsertPatientCompanyRequestDTO = {
    id?: string;
    hospitalIds?: Array<string> | null;
    name?: string | null;
    schemeCompanyTypeId?: string | null;
    scheduleOfChargesTypeId?: string | null;
    shortName?: string | null;
    isMediclaim?: boolean;
    isExcludeFromDoctorProfessionalFee?: boolean;
    isIPMaterial?: boolean;
    isIPService?: boolean;
    isOPMaterial?: boolean;
    isOPService?: boolean;
    associateSchemeCompanyIds?: Array<string> | null;
    licenseNo?: string | null;
    gstNumber?: string | null;
    website?: string | null;
    panNo?: string | null;
    registrationNo?: string | null;
    contactNo?: string | null;
    mobileNo?: string | null;
    faxNo1?: string | null;
    emailAddress?: string | null;
    fromDate?: string;
    toDate?: string;
    emergencyPercentage?: number;
    highRiskPercentage?: number;
    highSkillPercentage?: number;
    referralLetterValidityDays?: number;
    registrationValidityDays?: number;
    visitType?: Array<number> | null;
    description?: string | null;
    documents?: Array<DocumentDetailsDto> | null;
    countryId?: string | null;
    districtId?: string | null;
    stateId?: string | null;
    cityId?: string | null;
    areaId?: string | null;
    pincode?: string | null;
    address?: string | null;
    emergencyContactName?: string | null;
    emergencyContactNo?: string | null;
    exclusions?: Array<ExclusionDto> | null;
    discountCategory?: string | null;
    discountGivenBy?: string | null;
    discounts?: Array<DiscountDetailsDto> | null;
    emergencyPackageApplicableDate?: string;
    emergencyPackageApplicableTime?: string;
    emergencyPackagePercentage?: number;
    isBlock?: boolean;
};

