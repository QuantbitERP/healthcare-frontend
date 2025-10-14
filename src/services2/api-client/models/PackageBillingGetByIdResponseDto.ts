/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PackageItem } from './PackageItem';
import type { PackageMapping } from './PackageMapping';
export type PackageBillingGetByIdResponseDto = {
    id?: string;
    name?: string | null;
    isOpd?: boolean | null;
    validFrom?: string | null;
    validTo?: string | null;
    visitTypeId?: number | null;
    deptId?: string | null;
    duration?: number | null;
    multiVisitPackageFlag?: boolean | null;
    gender?: number | null;
    pkgType?: number | null;
    deptIds?: string | null;
    effectiveFrom?: string | null;
    isBlock?: boolean;
    packageMapping?: Array<PackageMapping> | null;
    packageItem?: Array<PackageItem> | null;
};

