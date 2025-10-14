import { PatientCompanyMasterListRequestDto } from '@/services/api-client';
import { PatientCompanyFilterState } from '@/store/patientCompanyFiltersSlice'; 



export function buildPatientCompanyRequestPayload(
  filters: PatientCompanyFilterState,
  page: number,
  pageSize: number,
): PatientCompanyMasterListRequestDto {
  return {
    searchTerm: filters.searchTerm ?? null,
    hosptialNameId: filters.hosptialNameId ?? null,
    patientCategoryType: filters.patientCategoryType ?? null,
    rateNameType: filters.rateNameType ?? null,
    deactivated: filters.deactivated ?? null,
    createdByList: filters.createdByList ?? null,
    modifiedByList: filters.modifiedByList ?? null,
    page: page,
    pageSize: pageSize,
  };
}
