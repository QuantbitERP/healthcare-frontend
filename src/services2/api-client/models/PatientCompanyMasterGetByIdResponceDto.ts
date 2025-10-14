/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AssociateSchemeCompanyIdList } from './AssociateSchemeCompanyIdList';
import type { ConcessionDiscountRuleDetils } from './ConcessionDiscountRuleDetils';
import type { DocumentDetilslist } from './DocumentDetilslist';
import type { Exclusion } from './Exclusion';
import type { HospitalId } from './HospitalId';
export type PatientCompanyMasterGetByIdResponceDto = {
    hospitalId?: Array<HospitalId> | null;
    id?: string;
    name: string;
    rateNameId?: string | null;
    patientCategoryId?: string | null;
    shortName?: string | null;
    ismediclaim?: boolean | null;
    isExcludeFromDoctorProfessionalFee?: boolean;
    isBlock?: boolean;
    isIPMaterial?: boolean;
    isIPService?: boolean;
    isOPMaterial?: boolean;
    isOPService?: boolean;
    associateSchemeCompanyId?: Array<AssociateSchemeCompanyIdList> | null;
    licenseno?: string | null;
    registrationno?: string | null;
    pan?: string | null;
    gstNumber?: string | null;
    mobileno?: string | null;
    contactno?: string | null;
    fax?: string | null;
    website?: string | null;
    fromDate?: string;
    toDate?: string;
    highSkillPercentage?: number;
    highRiskPercentage?: number;
    emergencyPercentage?: number;
    referraLetterValidityDays?: number;
    visitType?: string | null;
    description?: string | null;
    registrationValidityDays?: number;
    documentDetils?: Array<DocumentDetilslist> | null;
    countryid?: string | null;
    stateid?: string | null;
    districtid?: string | null;
    cityid?: string | null;
    areaid?: string | null;
    pincode?: string | null;
    address?: string | null;
    exclusion?: Array<Exclusion> | null;
    discountCategory?: string | null;
    authorizedBy?: string | null;
    concessionDiscountRuleDetils?: Array<ConcessionDiscountRuleDetils> | null;
    emergencycontactPersonname?: string | null;
    emergencycontactPersonno?: string | null;
    emergencyPackageApplicableDate?: string;
    emergencyPackageApplicableTime?: string;
    emergencyPackagePercentage?: number;
};

