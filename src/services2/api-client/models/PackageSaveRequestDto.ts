/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CompanyTariffDto } from './CompanyTariffDto';
import type { DoctorTariffDto } from './DoctorTariffDto';
import type { HospitalTariffDto } from './HospitalTariffDto';
import type { PackageItemDto } from './PackageItemDto';
export type PackageSaveRequestDto = {
    isopd?: boolean | null;
    id?: string;
    name?: string | null;
    visittypeId?: number | null;
    validfrom?: string | null;
    validto?: string | null;
    deptId?: string | null;
    duration?: number | null;
    multiVisitPkgFlag?: boolean | null;
    gender?: number | null;
    pkgType?: number | null;
    deptIds?: string | null;
    effectiveFrom?: string | null;
    isBlock?: boolean | null;
    hospitalTariff?: Array<HospitalTariffDto> | null;
    companyTariff?: Array<CompanyTariffDto> | null;
    doctorTariff?: Array<DoctorTariffDto> | null;
    packageItem?: Array<PackageItemDto> | null;
};

