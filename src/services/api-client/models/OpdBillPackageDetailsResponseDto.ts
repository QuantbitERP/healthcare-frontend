/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { OpdBillPackageDetailItemDto } from './OpdBillPackageDetailItemDto';
export type OpdBillPackageDetailsResponseDto = {
    id?: string;
    gender?: string | null;
    departmentName?: string | null;
    pkgType?: string | null;
    duration?: number | null;
    emergencyTariff?: number | null;
    visitTypeId?: string | null;
    validFrom?: string | null;
    validTo?: string | null;
    effectiveFrom?: string | null;
    tariff?: number | null;
    requisitionDateTime?: string | null;
    quantity?: number | null;
    conPercentage?: number | null;
    detailItems?: Array<OpdBillPackageDetailItemDto> | null;
};

