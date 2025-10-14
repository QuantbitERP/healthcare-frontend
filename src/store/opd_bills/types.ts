import { GetBillsResponseDto } from "@/services/api-client/models/GetBillsResponseDto";
export interface ScoreItem {
  label: string;
  count: number;
}

export interface OPDState {
  bills: GetBillsResponseDto[];
  loading: boolean;
  error: string | null;
  cancelStatus: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}

export interface CommonParams {
  version: string;
  tenant?: string;
  patientId?: string|null;
  billId?: string;
  requestBody?: Array<string>;
}


export interface PackagesParams {
  version: string;
  tenant?: string;
}