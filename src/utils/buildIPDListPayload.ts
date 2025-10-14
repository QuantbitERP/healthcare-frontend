import { IpdListRequestDto } from '@/services/api-client';
import { IpdFiltersState } from '@/store/ipdBillsFiltersSlice';
import { DateRange } from "react-day-picker";

export const getTodayDate = (): string => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); 
    return today.toISOString();
  };
  
export const getTomorrowDate = (): string => {
const tomorrow = new Date();
tomorrow.setUTCDate(tomorrow.getUTCDate() + 1); 
tomorrow.setUTCHours(0, 0, 0, 0); 
return tomorrow.toISOString();
};

export const convertToUTCStartOfDay = (date: Date): string => {
const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
);
return utcDate.toISOString();
};

export function buildIpdListRequestPayload(
  filters: IpdFiltersState,
  userId: string,
  page: number,
  pageSize: number,
  date?: DateRange,
): IpdListRequestDto {
  return {
    patientCategory: filters.patientCategory ?? null,
    patientCompany: filters.patientCompany ?? null,
    billingClass: filters.billingClass ?? null,
    admittingDoctor: filters.admittingDoctor ?? null,
    ward: filters.ward ?? null,
    billStatus: filters.billStatus ?? null,
    paidStatus: filters.paidStatus ?? null,
    gender: filters.gender ?? null,
    modifiedByList: filters.modifiedByList ?? null,
    createdByList:filters.meMode ? [userId] : filters.createdByList ?? null,
    package: filters.package ?? false,
    surgeryDone: filters.surgeryDone ?? false,
    showBilledAndDischargedPatients: filters.showBilledAndDischargedPatients ?? false,
    searchTerm: filters.searchTerm ?? null,
    startDate: date?.from ? convertToUTCStartOfDay(date.from) : getTodayDate(),
    endDate: date?.to ? convertToUTCStartOfDay(date.to) : getTomorrowDate(),
    page: page,
    pageSize: pageSize,
  };
}
