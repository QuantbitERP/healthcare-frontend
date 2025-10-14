/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CompanyTariffDto } from './CompanyTariffDto';
import type { DoctorTariffDto } from './DoctorTariffDto';
import type { HospitalTariffDto } from './HospitalTariffDto';
import type { PackageAdjustmentHead } from './PackageAdjustmentHead';
import type { PackageAdjustmentHeadDetail } from './PackageAdjustmentHeadDetail';
import type { PackageAdjustmentHeads } from './PackageAdjustmentHeads';
import type { PackageHeaderDto } from './PackageHeaderDto';
import type { PackageItemDto } from './PackageItemDto';
import type { PackageTypes } from './PackageTypes';
import type { Patient } from './Patient';
import type { PatientVisitPackageDetailDto } from './PatientVisitPackageDetailDto';
import type { RoomCategories } from './RoomCategories';
import type { VisitDetail } from './VisitDetail';
export type ApplyPackage = {
    patient?: Patient;
    packageHeader?: PackageHeaderDto;
    visitDetail?: VisitDetail;
    hospitalTariff?: Array<HospitalTariffDto> | null;
    companyTariff?: Array<CompanyTariffDto> | null;
    doctorTariff?: Array<DoctorTariffDto> | null;
    packageItem?: Array<PackageItemDto> | null;
    emergencypercentage?: number;
    packageAdjustmentHeadId?: string | null;
    packageEmergencyHeadId?: string | null;
    patientVisitPackageDetailDto?: Array<PatientVisitPackageDetailDto> | null;
    packageAdjustmentHead?: PackageAdjustmentHead;
    packageAdjustmentHeaddetail?: Array<PackageAdjustmentHeadDetail> | null;
    packageAdjustmentHeads?: Array<PackageAdjustmentHeads> | null;
    packageTypes?: PackageTypes;
    roomCategories?: Array<RoomCategories> | null;
    name?: string | null;
};

