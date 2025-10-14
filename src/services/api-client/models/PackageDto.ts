/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

import { ValidationError } from "./ValidationError";

export type PackageDto = {
    packageId?: string | null;
    packageName?: string | null;
};

export type PackageScore={
        data: {
          healthCheckup: number,
          medical: number,
          surgical: number,
          total: number
        }|null,
        isError?: boolean;
        errorMessage?: string | null;
        validationErrors?: Array<ValidationError> | null;
        errorCode?: string | null;
      }

export type PackageBillingItemDto = {
  id: string;
  name: string;
  packageType: string;
  applicableFor: string;
  effectiveDate: string;
  validFrom: string;
  validTo: string;
  status: string;
  modifiedOn: string;
  modifiedBy: string;
  createdOn: string;
  createdBy: string;
};

export type PackageBillingMetadataDto = {
  page: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
};
export type PackageBillingResponseDto = {
  data: {
    items: PackageBillingItemDto[];
    metadata: PackageBillingMetadataDto;
  } | null;
  isError?: boolean;
  errorMessage?: string | null;
  validationErrors?: Array<ValidationError> | null;
  errorCode?: string | null;
};
export type PackageBillingRequestDto = {
  visittypeid?: number[];
  pkgType?: number[];
  status?: number[];
  version?: boolean;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
};
