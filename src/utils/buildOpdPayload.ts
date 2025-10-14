import { GetBillsDto } from "@/services/api-client/models/GetBillsDto";
import { OPDFiltersState } from "@/store/slices/opdFiltersSlice";
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

export function buildOpdPayload(
  filters: OPDFiltersState,
  userId: string,
  pageNumber: number,
  pageSize: number,
  date?: DateRange,
): GetBillsDto {
  return {
    hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
    startDate: date?.from ? convertToUTCStartOfDay(date.from) : getTodayDate(),
    endDate: date?.to ? convertToUTCStartOfDay(date.to) : getTomorrowDate(),
    billStatuses: filters.billStatuses ?? [],
    createdByList: filters.meMode ? [userId] : filters.createdByList ?? [],
    companyIds: filters.companyIds ?? [],
    schemeCompanyTypeIds: filters.schemeCompanyTypeIds ?? [],
    isCancelled: filters.isCancelled ?? false,
    searchTerm: filters.searchTerm ?? null,
    pageNumber,
    pageSize,
  };
}

