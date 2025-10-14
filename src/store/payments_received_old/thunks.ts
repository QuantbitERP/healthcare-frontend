import { createAsyncThunk } from "@reduxjs/toolkit";
import { PaymentsService } from "@/services/payments_received/services/PaymentsService";
import {
  Company,
  Concession,
  PaymentResponse,
  PaymentStats,
  PaymentDetailResponse,
  PaymentMeta,
  ColumnConfig,
  BillsResponse,
  FetchBillsParams,
} from "./types";

const DEFAULT_META: PaymentMeta = {
  total_count: 0,
  total_pages: 0,
  current_page: 1,
  per_page: 10,
  sort_by: '',
  sort_order: '',
};

// Metadata
export const fetchCompanies = createAsyncThunk<
  Company[],
  void,
  { rejectValue: string }
>("paymentMetadata/fetchCompanies", async (_, { rejectWithValue }) => {
  try {
    const response = await PaymentsService.getApiMnPaymentsCompanies();
    return response.companies ?? [];
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch companies"
    );
  }
});

export const fetchConcessions = createAsyncThunk<
  Concession[],
  void,
  { rejectValue: string }
>("paymentMetadata/fetchConcessions", async (_, { rejectWithValue }) => {
  try {
    const response = await PaymentsService.getApiMnPaymentsConcessions();
    return response.concessions ?? [];
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch concessions"
    );
  }
});

// Payments
export const fetchPayments = createAsyncThunk<
  PaymentResponse,
  void,
  { rejectValue: string }
>("payments/fetchPayments", async (_, { rejectWithValue }) => {
  try {
    const response = await PaymentsService.getApiMnPayments();
    return {
      payments: response.payments ?? [],
      meta: response.meta ?? DEFAULT_META,
    };
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch payments"
    );
  }
});

export const fetchPaymentStats = createAsyncThunk<
  PaymentStats,
  void,
  { rejectValue: string }
>("payments/fetchPaymentStats", async (_, { rejectWithValue }) => {
  try {
    const response = await PaymentsService.getApiMnPaymentsStats();
    if (!response.payment_stats) {
      return rejectWithValue("No payment stats found");
    }
    return response.payment_stats;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch payment stats";
    return rejectWithValue(errorMessage);
  }
});

export const fetchPaymentById = createAsyncThunk<
  PaymentDetailResponse,
  string,
  { rejectValue: string }
>("payments/fetchPaymentById", async (id, { rejectWithValue }) => {
  try {
    const response = await PaymentsService.getApiMnPayments1(Number(id));
    return { payment: response.payment };
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch payment"
    );
  }
});

export const fetchColumnConfig = createAsyncThunk<
  { all_columns: ColumnConfig[]; selected_columns: ColumnConfig[]; unselected_columns: ColumnConfig[] },
  void,
  { rejectValue: string }
>("columnConfig/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await PaymentsService.getApiMnPaymentsColumns();
    return {
      all_columns: response.all_columns,
      selected_columns: response.selected_columns,
      unselected_columns: response.unselected_columns,
    };
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch column config"
    );
  }
});
  
export const saveColumnConfig = createAsyncThunk<
void,
ColumnConfig[],
{ rejectValue: string }
>("columnConfig/save", async (selected_columns, { rejectWithValue }) => {
try {
  await PaymentsService.postApiMnPaymentsColumns({ 
    selected_columns: selected_columns.map(col => col.id) 
  });
  return;
} catch (err: unknown) {
  return rejectWithValue(
    err instanceof Error ? err.message : "Failed to save column config"
  );
}
});


export const fetchBills = createAsyncThunk<
  BillsResponse,
  FetchBillsParams,
  { rejectValue: string }
>("bills/fetchBills", async (params, { rejectWithValue }) => {
  try {
    const { id, queryParams } = params;
    const response = await PaymentsService.getApiMnPaymentsBills(
      Number(id),
      queryParams?.hospital_id ? Number(queryParams.hospital_id) : undefined,
      queryParams?.patient_id ? Number(queryParams.patient_id) : undefined,
      queryParams?.patient_name,
      queryParams?.referral_no,
      queryParams?.visit_no,
      queryParams?.bill_no,
      queryParams?.claim_no,
      queryParams?.sort_by,
      queryParams?.sort_order,
      queryParams?.page,
      queryParams?.per_page
    );
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch bills"
    );
  }
});